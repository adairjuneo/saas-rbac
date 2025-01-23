/*
  Warnings:

  - You are about to drop the column `user_id` on the `invite` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "invite" DROP CONSTRAINT "invite_user_id_fkey";

-- AlterTable
ALTER TABLE "invite" DROP COLUMN "user_id",
ADD COLUMN     "author_id" TEXT;

-- AddForeignKey
ALTER TABLE "invite" ADD CONSTRAINT "invite_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
