import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..');

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
const outputDir = path.resolve(projectRoot, process.env.SCREENSHOT_DIR || 'docs/screenshots/auto');
const pageWaitMs = Number(process.env.PAGE_WAIT_MS || 1100);
const headless = process.env.HEADLESS !== 'false';
const viewportWidth = Number(process.env.SCREENSHOT_VIEWPORT_WIDTH || 1800);
const viewportHeight = Number(process.env.SCREENSHOT_VIEWPORT_HEIGHT || 1200);
const deviceScaleFactor = Number(process.env.SCREENSHOT_SCALE_FACTOR || 2);
const fullPage = process.env.SCREENSHOT_FULL_PAGE === 'true';
const uiScale = Number(process.env.SCREENSHOT_UI_SCALE || 1.35);
const screenshotTheme = (process.env.SCREENSHOT_THEME || 'dark').toLowerCase();

function log(message) {
  console.log(`[screenshots] ${message}`);
}

function sanitizeFileName(name) {
  return name
    .replace(/^\/+/, '')
    .replace(/[^a-zA-Z0-9-_/.]/g, '-')
    .replace(/\/{2,}/g, '/')
    .replace(/\/$/, '')
    .replace(/\//g, '__') || 'home';
}

function buildUrl(route) {
  return new URL(route, baseUrl).toString();
}

function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

async function pause(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function safeGoto(page, route) {
  const url = buildUrl(route);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  await pause(pageWaitMs);
}

async function saveScreenshot(page, label) {
  const fileName = `${sanitizeFileName(label)}.png`;
  const target = path.join(outputDir, fileName);
  await page.screenshot({ path: target, fullPage });
  log(`saved ${path.relative(projectRoot, target)}`);
}

async function normalizeSidebarForShot(page) {
  const sidebar = page.locator('.sidebar');
  if (!(await sidebar.count())) return;

  const isCollapsed = await sidebar.first().evaluate((node) => node.classList.contains('collapsed'));
  if (!isCollapsed) {
    const collapseButton = page.locator('.collapse-btn');
    if (await collapseButton.count()) {
      await collapseButton.first().click({ force: true }).catch(() => {});
      await pause(250);
    }
  }
}

async function applyCaptureScale(page) {
  if (Number.isNaN(uiScale) || uiScale <= 0 || uiScale === 1) return;

  await page.evaluate((scale) => {
    document.documentElement.style.zoom = String(scale);
  }, uiScale).catch(() => {});
}

async function configureTheme(context, page) {
  if (screenshotTheme === 'system') {
    return;
  }

  const isDark = screenshotTheme === 'dark';
  await context.addInitScript((darkMode) => {
    const value = JSON.stringify(Boolean(darkMode));
    window.localStorage.setItem('darkMode', value);
    document.cookie = `darkMode=${value};path=/`;
  }, isDark);

  await page.emulateMedia({ colorScheme: isDark ? 'dark' : 'light' });
}

async function waitForApp(page) {
  log(`checking app availability at ${baseUrl}`);
  await page.goto(buildUrl('/login'), { waitUntil: 'domcontentloaded', timeout: 60000 });
}

async function registerOrLogin(page) {
  const usernameFromEnv = process.env.APP_USERNAME;
  const passwordFromEnv = process.env.APP_PASSWORD;

  if (usernameFromEnv && passwordFromEnv) {
    log(`logging in with APP_USERNAME=${usernameFromEnv}`);
    await safeGoto(page, '/login');
    await page.fill('input[name="username"]', usernameFromEnv);
    await page.fill('input[name="password"]', passwordFromEnv);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/', { timeout: 20000 });
    await pause(500);
    return;
  }

  const unique = Date.now().toString().slice(-8);
  const generatedUsername = `shot_${unique}`;
  const generatedPassword = `Shot_${unique}_Pass!`;

  log(`registering throwaway user ${generatedUsername}`);
  await safeGoto(page, '/register');
  await page.fill('input[name="username"]', generatedUsername);
  await page.fill('input[name="password"]', generatedPassword);
  await page.fill('input[name="confirmPassword"]', generatedPassword);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/', { timeout: 20000 });

  log(`created user ${generatedUsername} (use APP_USERNAME/APP_PASSWORD to reuse an account)`);
}

async function addSampleAddiction(page) {
  log('creating sample addiction entry for dynamic screens');
  await safeGoto(page, '/add-addiction');

  await page.selectOption('select[name="addictionType"]', { label: '🚬 Nicotine' }).catch(async () => {
    await page.selectOption('select[name="addictionType"]', { index: 1 });
  });

  const stopDate = new Date();
  stopDate.setDate(stopDate.getDate() - 3);
  await page.fill('input[name="stopDate"]', toIsoDate(stopDate));

  const timeInput = page.locator('input[name="stopTime"]');
  if (await timeInput.count()) {
    await timeInput.fill('08:30');
  }

  await page.fill('input[name="frequencyPerDay"]', '8');
  await page.fill('input[name="moneySpentPerDay"]', '15.5');
  await page.fill('textarea[name="notes"]', 'Auto-generated by screenshot runner.');

  await saveScreenshot(page, 'form__add-addiction__filled');

  await page.click('button[type="submit"]');
  await page.waitForURL('**/', { timeout: 20000 });
  await pause(700);
}

async function collectRoutes(page) {
  const discovered = await page.$$eval('a[href^="/"]', (anchors) => {
    return anchors
      .map((a) => a.getAttribute('href'))
      .filter(Boolean);
  });

  const routeSet = new Set([
    '/login',
    '/register',
    '/self-assessment',
    '/',
    '/add-addiction',
    '/profile',
    '/diary',
    '/mood',
    '/weight',
    '/memories',
    '/achievements',
    '/meditation',
    '/mindfulness',
    '/exercise',
    '/therapy',
    '/hobbies',
    '/craving-game',
    '/crisis',
    '/preparation-plan',
    '/withdrawal-symptoms',
    '/how-to-succeed',
    '/why-use-this',
    '/privacy'
  ]);

  for (const route of discovered) {
    if (!route.startsWith('/')) continue;
    routeSet.add(route);
  }

  return [...routeSet];
}

async function captureRoutes(page, routes) {
  for (const route of routes) {
    await safeGoto(page, route);
    await applyCaptureScale(page);
    await normalizeSidebarForShot(page);

    if (route === '/craving-game') {
      const guessInput = page.locator('input[maxlength="5"]');
      if (await guessInput.count()) {
        await guessInput.fill('apple');
        await guessInput.press('Enter').catch(() => {});
        await pause(400);
      }
    }

    if (route === '/') {
      const categoryButtons = page.locator('.category-header');
      const count = await categoryButtons.count();
      for (let i = 0; i < count; i += 1) {
        await categoryButtons.nth(i).click({ force: true }).catch(() => {});
      }
      await pause(400);
    }

    await saveScreenshot(page, `route__${route}`);
  }
}

async function run() {
  await fs.mkdir(outputDir, { recursive: true });

  const browser = await chromium.launch({ headless });
  const context = await browser.newContext({
    viewport: { width: viewportWidth, height: viewportHeight },
    deviceScaleFactor
  });
  const page = await context.newPage();
  await configureTheme(context, page);

  try {
    await waitForApp(page);
    await safeGoto(page, '/login');
    await applyCaptureScale(page);
    await normalizeSidebarForShot(page);
    await saveScreenshot(page, 'route__login');

    await safeGoto(page, '/register');
    await applyCaptureScale(page);
    await normalizeSidebarForShot(page);
    await saveScreenshot(page, 'route__register');

    await safeGoto(page, '/self-assessment');
    await applyCaptureScale(page);
    await normalizeSidebarForShot(page);
    await saveScreenshot(page, 'route__self-assessment');

    await registerOrLogin(page);
    await applyCaptureScale(page);
    await normalizeSidebarForShot(page);
    await saveScreenshot(page, 'route__home__after-auth');

    await addSampleAddiction(page);

    await safeGoto(page, '/');
    const routes = await collectRoutes(page);
    log(`capturing ${routes.length} routes`);

    await captureRoutes(page, routes);
    log(`done, screenshots are in ${path.relative(projectRoot, outputDir)}`);
  } finally {
    await context.close();
    await browser.close();
  }
}

run().catch((error) => {
  console.error('[screenshots] failed:', error.message);
  process.exitCode = 1;
});
