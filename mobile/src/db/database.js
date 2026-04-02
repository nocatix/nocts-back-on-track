import * as SQLite from 'expo-sqlite';

let db = null;
let dbInitialized = false;

export const initializeDatabase = async () => {
  if (dbInitialized && db) {
    console.log('Database already initialized');
    return;
  }

  try {
    db = await SQLite.openDatabaseAsync('noctsDB.db');
    console.log('Database opened successfully');
    
    // Create tables with proper error handling
    await db.execAsync(`
      PRAGMA foreign_keys = ON;
      
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        fullName TEXT NOT NULL,
        password TEXT NOT NULL,
        unitPreference TEXT DEFAULT 'imperial',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS addictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        name TEXT NOT NULL,
        stopDate DATETIME NOT NULL,
        frequencyPerDay REAL NOT NULL,
        moneySpentPerDay REAL NOT NULL,
        notes TEXT,
        notesIv TEXT,
        notesAuthTag TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(id)
      );
      
      CREATE TABLE IF NOT EXISTS moods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        date DATETIME NOT NULL,
        primaryMood TEXT NOT NULL,
        secondaryMood TEXT,
        intensity INTEGER DEFAULT 3,
        notes TEXT,
        notesIv TEXT,
        notesAuthTag TEXT,
        triggers TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(id),
        UNIQUE(userId, date)
      );
      
      CREATE TABLE IF NOT EXISTS diaries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        date DATETIME NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        contentIv TEXT,
        contentAuthTag TEXT,
        mood TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(id)
      );
      
      CREATE TABLE IF NOT EXISTS memories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        date DATETIME NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        descriptionIv TEXT,
        descriptionAuthTag TEXT,
        type TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(id)
      );
      
      CREATE TABLE IF NOT EXISTS weights (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        date DATETIME NOT NULL,
        weight REAL NOT NULL,
        unit TEXT DEFAULT 'lbs',
        notes TEXT,
        notesIv TEXT,
        notesAuthTag TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(id)
      );
      
      CREATE TABLE IF NOT EXISTS achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        type TEXT,
        unlockedDate DATETIME,
        isUnlocked INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(id)
      );
      
      CREATE TABLE IF NOT EXISTS trophies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        earnedDate DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(id)
      );
    `);
    
    dbInitialized = true;
    console.log('Database tables created successfully');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export const getDatabase = () => {
  if (!db || !dbInitialized) {
    throw new Error('Database not initialized. Call initializeDatabase() first');
  }
  return db;
};

export default getDatabase;
