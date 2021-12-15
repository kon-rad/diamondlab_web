// prisma/seed.ts

import { PrismaClient } from '@prisma/client'
import { nftdrops } from '../data/nftdrops'
const prisma = new PrismaClient()

async function main() {
  await prisma.nFTDrop.createMany({
    data: nftdrops,
  })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })