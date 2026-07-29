import prisma from "../lib/prisma"
import { initialData } from "./seed"

async function main() {
    await prisma.role.deleteMany()
    await prisma.identificationType.deleteMany()

    await prisma.$executeRaw`ALTER SEQUENCE "Role_id_seq" RESTART WITH 1`
    await prisma.$executeRaw`ALTER SEQUENCE "IdentificationType_id_seq" RESTART WITH 1`

    const { roles } = initialData
    const { identifications } = initialData

    await prisma.role.createMany({
        data: roles
    })

    await prisma.identificationType.createMany({
        data: identifications
    })

    console.log('Seed ejecutado correctamente')
}

main()
    .catch((error) => {
        console.error('Error ejecutando seed:', error)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
