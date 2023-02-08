/*
  Warnings:

  - You are about to drop the `ArtistsOnTrack` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Track" ADD COLUMN "comments" TEXT;
ALTER TABLE "Track" ADD COLUMN "image" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ArtistsOnTrack";
PRAGMA foreign_keys=on;
