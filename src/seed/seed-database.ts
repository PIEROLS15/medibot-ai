import prisma from "../lib/prisma";
import { initialData } from "./seed";

async function main() {
    try {
        const [roleCount, identificationTypeCount] = await Promise.all([
            prisma.role.count(),
            prisma.identificationType.count(),
        ])

        if (roleCount > 0 || identificationTypeCount > 0) {
            console.log('Seed omitido: la base de datos ya contiene datos iniciales')
            return
        }

        //Elimina registros de la base de datos
        // await prisma.user.deleteMany()
        await prisma.role.deleteMany()
        await prisma.identificationType.deleteMany()

        // Reiniciar los índices de autoincremento
        await prisma.$executeRaw`ALTER SEQUENCE "Role_id_seq" RESTART WITH 1`;
        // await prisma.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1`;
        await prisma.$executeRaw`ALTER SEQUENCE "IdentificationType_id_seq" RESTART WITH 1`;

        //Extrae los datos de initialData
        const { roles } = initialData
        // const { users } = initialData
        const { identifications } = initialData

        //Inserta los datos a la base de datos
        await prisma.role.createMany({
            data: roles
        });

        // await prisma.user.createMany({
        //     data: users
        // })

        await prisma.identificationType.createMany({
            data: identifications
        })

        console.log('Seed ejecutado correctamente')
    } finally {
        await prisma.$disconnect()
    }
}

main().catch((error) => {
    console.error('Error ejecutando seed:', error)
    process.exit(1)
})
