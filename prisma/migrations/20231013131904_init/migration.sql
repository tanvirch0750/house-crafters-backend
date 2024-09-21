/*
  Warnings:

  - You are about to drop the column `slot` on the `booking` table. All the data in the column will be lost.
  - Added the required column `slotId` to the `booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "booking" DROP COLUMN "slot",
ADD COLUMN     "slotId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "slot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
