-- CreateTable
CREATE TABLE "Track" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "createdAt" DATETIME NOT NULL,
    "location" TEXT NOT NULL,
    "bpm" TEXT,
    "album" TEXT,
    "fileType" TEXT,
    "initialKey" TEXT,
    "length" TEXT,
    "size" TEXT,
    "year" TEXT,
    "plays" TEXT,
    "biterate" TEXT,
    "samplerate" TEXT,
    "like" BOOLEAN NOT NULL,
    "pinned" BOOLEAN NOT NULL,
    "updateDate" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Artist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT
);

-- CreateTable
CREATE TABLE "ArtistsOnTrack" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trackId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "GenreOnTrack" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "genreId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "createdAt" TEXT
);

-- CreateTable
CREATE TABLE "Label" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "LabelOnTrack" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "labelId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Group" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "GroupOnTrack" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "groupId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Composer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ComposerOnTrack" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "composerId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Remixer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "RemixerOnTrack" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "remixerId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "CommentOnTrack" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "commentId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Playlist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PlaylistOnTrack" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "playlistId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Mood" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "moodOnTrack" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "moodId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Timing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "timingOnTrack" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "timingId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Track_location_key" ON "Track"("location");

-- CreateIndex
CREATE UNIQUE INDEX "Track_id_location_key" ON "Track"("id", "location");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_name_key" ON "Artist"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ArtistsOnTrack_trackId_artistId_key" ON "ArtistsOnTrack"("trackId", "artistId");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_key" ON "Genre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GenreOnTrack_genreId_trackId_key" ON "GenreOnTrack"("genreId", "trackId");

-- CreateIndex
CREATE UNIQUE INDEX "Label_name_key" ON "Label"("name");

-- CreateIndex
CREATE UNIQUE INDEX "LabelOnTrack_labelId_trackId_key" ON "LabelOnTrack"("labelId", "trackId");

-- CreateIndex
CREATE UNIQUE INDEX "Group_name_key" ON "Group"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GroupOnTrack_groupId_trackId_key" ON "GroupOnTrack"("groupId", "trackId");

-- CreateIndex
CREATE UNIQUE INDEX "Composer_name_key" ON "Composer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ComposerOnTrack_composerId_trackId_key" ON "ComposerOnTrack"("composerId", "trackId");

-- CreateIndex
CREATE UNIQUE INDEX "Remixer_name_key" ON "Remixer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RemixerOnTrack_remixerId_trackId_key" ON "RemixerOnTrack"("remixerId", "trackId");

-- CreateIndex
CREATE UNIQUE INDEX "Comment_name_key" ON "Comment"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CommentOnTrack_commentId_trackId_key" ON "CommentOnTrack"("commentId", "trackId");

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_name_key" ON "Playlist"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistOnTrack_playlistId_trackId_key" ON "PlaylistOnTrack"("playlistId", "trackId");

-- CreateIndex
CREATE UNIQUE INDEX "Mood_name_key" ON "Mood"("name");

-- CreateIndex
CREATE UNIQUE INDEX "moodOnTrack_moodId_trackId_key" ON "moodOnTrack"("moodId", "trackId");

-- CreateIndex
CREATE UNIQUE INDEX "Timing_name_key" ON "Timing"("name");

-- CreateIndex
CREATE UNIQUE INDEX "timingOnTrack_timingId_trackId_key" ON "timingOnTrack"("timingId", "trackId");
