import { beforeEach } from "vitest";
import { db } from "../src/db/database.js";
import {
  usersTable,
  collectionTable,
  flashCardTable,
  personnalFlashCardsTable,
} from "../src/db/schema.js";

// Vide toutes les tables avant chaque test (ordre important : FK)
beforeEach(async () => {
  await db.delete(personnalFlashCardsTable);
  await db.delete(flashCardTable);
  await db.delete(collectionTable);
  await db.delete(usersTable);
});
