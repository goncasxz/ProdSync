/*
  Warnings:

  - Added the required column `unidadeMedida` to the `MateriaPrima` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MateriaPrima" ADD COLUMN     "unidadeMedida" TEXT NOT NULL;
