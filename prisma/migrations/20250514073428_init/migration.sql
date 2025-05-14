-- DropForeignKey
ALTER TABLE "Files" DROP CONSTRAINT "Files_userId_fkey";

-- DropForeignKey
ALTER TABLE "PastInsights" DROP CONSTRAINT "PastInsights_fileId_fkey";

-- DropForeignKey
ALTER TABLE "PastInsights" DROP CONSTRAINT "PastInsights_userId_fkey";

-- AddForeignKey
ALTER TABLE "Files" ADD CONSTRAINT "Files_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PastInsights" ADD CONSTRAINT "PastInsights_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PastInsights" ADD CONSTRAINT "PastInsights_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "Files"("id") ON DELETE CASCADE ON UPDATE CASCADE;
