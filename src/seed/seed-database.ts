import prisma from "../lib/prisma";
import { initialData } from "./seed";

async function main() {
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
}

(() => {
    main()
})()
