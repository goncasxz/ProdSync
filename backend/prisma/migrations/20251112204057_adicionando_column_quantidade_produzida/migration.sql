/*
  Warnings:

  - Added the required column `quantidadeProduzida` to the `Producao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Producao" ADD COLUMN     "quantidadeProduzida" INTEGER NOT NULL;
