import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("viajemais.db");

export default db;
