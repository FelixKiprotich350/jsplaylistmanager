/*
  Warnings:

  - The primary key for the `Timing` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Timing` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Mood` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Mood` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Timing" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Timing" ("id", "name") SELECT "id", "name" FROM "Timing";
DROP TABLE "Timing";
ALTER TABLE "new_Timing" RENAME TO "Timing";
CREATE UNIQUE INDEX "Timing_name_key" ON "Timing"("name");
CREATE TABLE "new_Mood" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Mood" ("id", "name") SELECT "id", "name" FROM "Mood";
DROP TABLE "Mood";
ALTER TABLE "new_Mood" RENAME TO "Mood";
CREATE UNIQUE INDEX "Mood_name_key" ON "Mood"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
