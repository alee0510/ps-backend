/*
  Warnings:

  - You are about to drop the column `authorId` on the `Article` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Article" DROP CONSTRAINT "Article_authorId_fkey";

-- DropIndex
DROP INDEX "public"."Article_authorId_key";

-- AlterTable
ALTER TABLE "public"."Article" DROP COLUMN "authorId";
