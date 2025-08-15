/*
  Warnings:

  - You are about to drop the `_ArticleToUser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[authorId]` on the table `Article` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorId` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."_ArticleToUser" DROP CONSTRAINT "_ArticleToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ArticleToUser" DROP CONSTRAINT "_ArticleToUser_B_fkey";

-- AlterTable
ALTER TABLE "public"."Article" ADD COLUMN     "authorId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."_ArticleToUser";

-- CreateIndex
CREATE UNIQUE INDEX "Article_authorId_key" ON "public"."Article"("authorId");

-- AddForeignKey
ALTER TABLE "public"."Article" ADD CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
