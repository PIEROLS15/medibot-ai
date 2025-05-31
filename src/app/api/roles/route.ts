import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const roles = await prisma.role.findMany();

        return NextResponse.json(roles, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { error: 'Error al obtener los roles', details: (error as Error).message },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function POST() {
    return NextResponse.json({ error: 'Método no permitido' }, { status: 405 });
}

export async function PUT() {
    return NextResponse.json({ error: 'Método no permitido' }, { status: 405 });
}

export async function DELETE() {
    return NextResponse.json({ error: 'Método no permitido' }, { status: 405 });
}