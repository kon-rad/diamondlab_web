// prisma/seed.ts

import { PrismaClient } from '@prisma/client'
import { projects } from '../data/nftdrops'
const prisma = new PrismaClient()

console.log('inside prisma/seed.ts', projects);

async function main() {
  await prisma.project.createMany({
    data: projects,
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