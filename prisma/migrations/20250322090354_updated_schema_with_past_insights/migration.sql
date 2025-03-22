-- CreateTable
CREATE TABLE "PastInsights" (
    "id" SERIAL NOT NULL,
    "insights" JSONB NOT NULL,
    "userId" INTEGER NOT NULL,
    "fileId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PastInsights_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PastInsights_userId_idx" ON "PastInsights"("userId");

-- CreateIndex
CREATE INDEX "PastInsights_fileId_idx" ON "PastInsights"("fileId");

-- AddForeignKey
ALTER TABLE "PastInsights" ADD CONSTRAINT "PastInsights_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PastInsights" ADD CONSTRAINT "PastInsights_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "Files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
