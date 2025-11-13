/*
  Warnings:

  - You are about to drop the column `materiaPrimaId` on the `Producao` table. All the data in the column will be lost.
  - You are about to drop the column `quantidadeUsada` on the `Producao` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Producao" DROP CONSTRAINT "Producao_materiaPrimaId_fkey";

-- AlterTable
ALTER TABLE "Producao" DROP COLUMN "materiaPrimaId",
DROP COLUMN "quantidadeUsada";

-- CreateTable
CREATE TABLE "ProducaoMateriaPrima" (
    "id" SERIAL NOT NULL,
    "producaoId" INTEGER NOT NULL,
    "materiaPrimaId" INTEGER NOT NULL,
    "quantidadeUsada" INTEGER NOT NULL,

    CONSTRAINT "ProducaoMateriaPrima_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProducaoMateriaPrima" ADD CONSTRAINT "ProducaoMateriaPrima_producaoId_fkey" FOREIGN KEY ("producaoId") REFERENCES "Producao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProducaoMateriaPrima" ADD CONSTRAINT "ProducaoMateriaPrima_materiaPrimaId_fkey" FOREIGN KEY ("materiaPrimaId") REFERENCES "MateriaPrima"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
