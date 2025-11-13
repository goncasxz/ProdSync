/*
  Warnings:

  - You are about to drop the column `dataProducao` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `lote` on the `Produto` table. All the data in the column will be lost.
  - Added the required column `lote` to the `Producao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `Producao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Producao" ADD COLUMN     "lote" TEXT NOT NULL,
ADD COLUMN     "usuarioId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Produto" DROP COLUMN "dataProducao",
DROP COLUMN "lote";

-- AddForeignKey
ALTER TABLE "Producao" ADD CONSTRAINT "Producao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
