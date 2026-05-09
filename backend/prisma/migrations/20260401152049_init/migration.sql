/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `authors` table. All the data in the column will be lost.
  - You are about to drop the `author_books` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[isbn]` on the table `books` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `biography` to the `authors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birthYear` to the `authors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nationality` to the `authors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isbn` to the `books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pageCount` to the `books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publisherId` to the `books` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "author_books" DROP CONSTRAINT "author_books_author_id_fkey";

-- DropForeignKey
ALTER TABLE "author_books" DROP CONSTRAINT "author_books_book_id_fkey";

-- AlterTable
ALTER TABLE "authors" DROP COLUMN "updatedAt",
ADD COLUMN     "biography" TEXT NOT NULL,
ADD COLUMN     "birthYear" INTEGER NOT NULL,
ADD COLUMN     "nationality" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "books" ADD COLUMN     "authorId" INTEGER NOT NULL,
ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "isbn" TEXT NOT NULL,
ADD COLUMN     "language" TEXT NOT NULL,
ADD COLUMN     "pageCount" INTEGER NOT NULL,
ADD COLUMN     "publisherId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "author_books";

-- CreateTable
CREATE TABLE "publishers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "foundedYear" INTEGER NOT NULL,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "publishers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genres" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book_genres" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "genreId" INTEGER NOT NULL,

    CONSTRAINT "book_genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "userName" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "book_genres_bookId_genreId_key" ON "book_genres"("bookId", "genreId");

-- CreateIndex
CREATE UNIQUE INDEX "books_isbn_key" ON "books"("isbn");

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "authors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "publishers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_genres" ADD CONSTRAINT "book_genres_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_genres" ADD CONSTRAINT "book_genres_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;
