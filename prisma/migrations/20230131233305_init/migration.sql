/*
  Warnings:

  - You are about to drop the `CommentOnTrack` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ComposerOnTrack` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GenreOnTrack` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GroupOnTrack` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LabelOnTrack` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RemixerOnTrack` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `moodOnTrack` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `timingOnTrack` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CommentOnTrack";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ComposerOnTrack";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GenreOnTrack";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GroupOnTrack";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "LabelOnTrack";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "RemixerOnTrack";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "moodOnTrack";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "timingOnTrack";
PRAGMA foreign_keys=on;
