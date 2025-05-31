import { PrismaClient, $Enums } from '@prisma/client';

// Para ejecutar e insertar datos: npx tsx prisma/seed.ts

const prisma = new PrismaClient();

async function main() {
    // Insertar roles
    const roles: $Enums.RoleType[] = [$Enums.RoleType.Administrator, $Enums.RoleType.Pharmacist];

    for (const role of roles) {
        await prisma.role.upsert({
            where: { name: role },
            update: {},
            create: { name: role },
        });
    }

    // Insertar ResultOptions
    const resultOptions: $Enums.TypeResultOptions[] = [$Enums.TypeResultOptions.Improved, $Enums.TypeResultOptions.No_changes,];

    for (const type of resultOptions) {
        await prisma.resultOptions.upsert({
            where: { type },
            update: {},
            create: { type },
        });
    }

    // Insertar IdentificationType
    const identificationTypes: $Enums.TypeIdentification[] = [$Enums.TypeIdentification.DNI, $Enums.TypeIdentification.RUC,];

    for (const type of identificationTypes) {
        await prisma.identificationType.upsert({
            where: { type },
            update: {},
            create: { type },
        });
    }

    console.log('Seed data inserted successfully!');
}

main()
    .catch((e) => {
        console.error('Error inserting seed data:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
