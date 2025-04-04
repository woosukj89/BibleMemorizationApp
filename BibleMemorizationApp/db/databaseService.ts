import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Observable } from '@/utils/Observable';

let db: SQLite.SQLiteDatabase | null = null;

type schema = {
    id?: string;
    book?: string;
    chapter?: number;
    verse?: number;
    text?: string;
}

export const tableNames = {
    ko_gygj: "개역개정",
    ko_nkjv: "NKJV",
    en_nkjv: "NKJV",
    en_kjv: "KJV",
    en_nasb: "NASB",
    en_niv: "NIV",
    en_nrsv: "NRSV",
    en_rsv: "RSV"
}

export const tableNameObservable = new Observable<keyof typeof tableNames | undefined>(undefined);

export async function initializeDatabase(language: string) {
  if (db && checkDbStatus()) {
    return db;
  }
  const dbName = 'bible.sqlite';
  const dbDirectory = `${FileSystem.documentDirectory}SQLite`;
  const dbPath = `${dbDirectory}/${dbName}`;

  const { exists } = await FileSystem.getInfoAsync(dbPath);

  if (!exists) {
    await FileSystem.makeDirectoryAsync(dbDirectory, { intermediates: true });
    const asset = Asset.fromModule(require('../assets/bible.sqlite'));
    await asset.downloadAsync();
    await FileSystem.copyAsync({
      from: asset.localUri!,
      to: dbPath
    });
  }

  db = await SQLite.openDatabaseAsync(dbName);
  initializeTableName(language);
  return db;
}

function checkDbStatus() {
    try {
        db.getFirstSync('SELECT 1');
        return true;
    } catch (error) {
        return false;
    }
}

async function initializeTableName(language: string) {
  const savedTranslation = await AsyncStorage.getItem('selected-translation');
  if (savedTranslation) {
      setTableName(savedTranslation);
  } else {
      setTableName((await getAvailableTranslations(language))[0])
  }
}

export function getTableName() {
  return tableNameObservable.get();
}

export function setTableName(version: string) {
  tableNameObservable.set(version as keyof typeof tableNames);
}

export async function getAvailableTranslations(language: string) {
  if (!db) throw new Error('Database not initialized');
  const rows = await db.getAllAsync(`SELECT name FROM sqlite_master WHERE type='table' and name LIKE ?`, `${language}_%`)
  return rows?.map(r => r.name);
}

export function getBooks() {
  if (!db || !getTableName()) throw new Error('Database not initialized');
  const rows: schema[] = db.getAllSync(`SELECT DISTINCT book FROM ${getTableName()} ORDER BY CAST(id AS integer)`);
  return rows.map(r => r.book)
}

export function getChapters(book: string) {
  if (!db || !getTableName()) throw new Error('Database not initialized');
  let query = `SELECT DISTINCT chapter FROM ${getTableName()} WHERE book = ? ORDER BY chapter`

  try {
    const rows: schema[] = db.getAllSync(query, book);

    return rows.map(r => r.chapter);
  } catch (error) {
    throw new Error(`Failed to get verses: ${error}`);
  }
}

export function getVerseNumbers(book: string, chapter: number) {
  if (!db || !getTableName()) throw new Error('Database not initialized');
  let query = `SELECT verse FROM ${getTableName()} WHERE book = ? AND chapter = ? ORDER BY verse`

  try {
    const rows: schema[] = db.getAllSync(query, book, chapter);

    return rows.map(r => r.verse);
  } catch (error) {
    throw new Error(`Failed to get verses: ${error}`);
  }
}

export async function getVerses(book: string, chapter: number, startVerse?: number, endVerse?: number) {
  if (!db || !getTableName()) throw new Error('Database not initialized');

  let query = `SELECT verse, text FROM ${getTableName()} WHERE book = ? AND chapter = ?`;
  const params = [book, chapter];

  if (startVerse) {
    query += ' AND verse >= ?';
    params.push(startVerse);
  }
  if (endVerse) {
    query += ' AND verse <= ?';
    params.push(endVerse);
  }

  try {
    const result: schema[] = await db.getAllAsync(query, params);

    const verses = result.reduce((acc, row) => {
      if (row.verse) {
        acc[row.verse] = row.text ?? "";
      }
      return acc;
    }, {} as {[verse:number]: string});

    return verses;
  } catch (error) {
    throw new Error(`Failed to get verses: ${error}`);
  }
}

export function getLastVerseNumber(book: string, chapter: number) {
  if (!db || !getTableName()) throw new Error('Database not initialized');

  try {
    const result: (schema | null) = db.getFirstSync(
        `SELECT MAX(verse) as verse FROM ${getTableName()} WHERE book = ? AND chapter = ?`,
        [book, chapter]
    );

    return result?.verse;
  } catch (error) {
    throw new Error(`Failed to get last verse number: ${error}`);
  }
}