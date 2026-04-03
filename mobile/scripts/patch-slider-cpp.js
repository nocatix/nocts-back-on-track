#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const headerPath = path.join(
  __dirname,
  '..',
  'node_modules',
  '@react-native-community',
  'slider',
  'common',
  'cpp',
  'react',
  'renderer',
  'components',
  'RNCSlider',
  'RNCSliderMeasurementsManager.h'
);

function patchSliderHeader(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('[patch-slider-cpp] slider header not found, skipping');
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  if (!content.includes('ContextContainer::Shared')) {
    console.log('[patch-slider-cpp] patch already applied');
    return;
  }

  content = content.replace(/ContextContainer::Shared/g, 'std::shared_ptr<const ContextContainer>');

  if (!content.includes('#include <memory>')) {
    content = content.replace('#include <react/utils/ContextContainer.h>\n', '#include <react/utils/ContextContainer.h>\n#include <memory>\n');
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('[patch-slider-cpp] applied compatibility patch for React Native 0.83+');
}

patchSliderHeader(headerPath);
