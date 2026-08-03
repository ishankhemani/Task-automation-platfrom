/*
  Warnings:

  - The `type` column on the `notifications` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INFO', 'SUCCESS', 'WARNING', 'ERROR', 'TASK_UPDATE', 'SYSTEM');

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "type",
ADD COLUMN     "type" "NotificationType" NOT NULL DEFAULT 'INFO';

-- CreateIndex
CREATE INDEX "queue_jobs_taskId_idx" ON "queue_jobs"("taskId");

-- AddForeignKey
ALTER TABLE "queue_jobs" ADD CONSTRAINT "queue_jobs_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
