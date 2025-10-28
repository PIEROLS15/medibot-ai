
# 🤖💊 Medibot AI

[![CI](https://github.com/PIEROLS15/medibot-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/PIEROLS15/medibot-ai/actions/workflows/ci.yml)

![Next.js](https://img.shields.io/badge/next-%3E%3D15-green)  
![Node.js](https://img.shields.io/badge/node-%3E%3D20-green)  
![React](https://img.shields.io/badge/react-18.x-blue)  
![TypeScript](https://img.shields.io/badge/typescript-5.x-blue)  
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

Sistema de recomendación de medicamentos con Inteligencia Artificial construido con **Next.js + TypeScript**. 
Incluye validaciones con **Zod**, linting con **ESLint/Prettier**, y CI con **GitHub Actions**.

---

## 🚀 Tecnologías principales

- [Node.js 20+](https://nodejs.org/) - Entorno de ejecución para JavaScript/TypeScript en el servidor
- [Next.js 15+](https://nextjs.org/) - Framework de React para aplicaciones web modernas con renderizado híbrido (SSR/SSG)
- [React 18+](https://nextjs.org/) - Biblioteca para construir interfaces de usuario interactivas y eficientes
- [TypeScript](https://www.typescriptlang.org/) - Superset de JavaScript
- [Zod](https://zod.dev/) - Biblioteca para validación y tipado seguro de datos 
- [ESLint](https://eslint.org/) - Reglas de estilo 
- [GitHub Actions](https://docs.github.com/en/actions) - CI/CD

---

## 📂 Estructura del proyecto

```bash
medibot-ai/
├── README.md                 # Documentación principal del proyecto
├── components.json           # Configuración de componentes (shadcn/ui)
├── cypress.config.ts         # Configuración de Cypress para pruebas E2E
├── eslint.config.mjs         # Reglas de linting con ESLint
├── next.config.ts            # Configuración del framework Next.js
├── package.json              # Dependencias y scripts del proyecto
├── postcss.config.js         # Configuración de PostCSS
├── tailwind.config.ts        # Configuración de TailwindCSS
├── tsconfig.json             # Configuración de TypeScript

├── cypress/                  # Pruebas automatizadas con Cypress
│   ├── e2e/                  # Pruebas E2E (por módulo o funcionalidad)
│   ├── fixtures/             # Datos mockeados para las pruebas
│   ├── support/              # Comandos y configuraciones compartidas
│   └── types/                # Tipos personalizados usados en las pruebas

├── prisma/                   # ORM y esquema de base de datos
│   ├── schema.prisma         # Definición del modelo de datos
│   └── migrations/           # Migraciones generadas por Prisma

├── public/                   # Archivos estáticos (imágenes, íconos, etc.)
│   └── logo_medibotai.webp   # Logo principal del proyecto

├── src/                      # Código fuente principal
│   ├── app/                  # Rutas y páginas (App Router de Next.js)
│   │   ├── api/              # Rutas API (Next.js Route Handlers)
│   │   ├── dashboard/        # Vistas del panel principal
│   │   ├── register/         # Página de registro
│   │   ├── layout.tsx        # Layout global
│   │   └── page.tsx          # Página principal (Home)
│   │
│   ├── components/           # Componentes reutilizables (UI, layout, auth, etc.)
│   ├── contexts/             # Contextos globales (auth, sidebar, etc.)
│   ├── hooks/                # Custom hooks (useLogin, useTheme, useUser, etc.)
│   ├── lib/                  # Configuraciones y utilidades compartidas
│   │   ├── prisma.ts         # Cliente Prisma configurado
│   │   ├── auth.ts           # Configuración de autenticación con NextAuth
│   │   └── validations/      # Esquemas Zod para validación de formularios
│   ├── seed/                 # Scripts de carga inicial (datos semilla)
│   ├── types/                # Tipos globales de TypeScript
│   └── utils/                # Funciones auxiliares (helpers)
│
└── .github/
    └── workflows/            # Automatización CI/CD
        └── ci.yml            # Pipeline de GitHub Actions
```

## 🛠️ Instalación

### Prerequisitos

Asegúrate de tener [Node](https://nodejs.org/es/) instalado en tu sistema:

```bash
node -v
 ```

### Configuración del proyecto

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/PIEROLS15/medibot-ai.git
   cd medibot-ai
   ```

2. **Instala las dependencias:**
   ```bash
   npm install

3. **Configura las variables de entorno:**

   El proyecto incluye un archivo de ejemplo .env.example. Cópialo para crear tu archivo .env y ajusta los valores según tu entorno local:
   ```bash
   cp .env.example .env
   ```
   Asegúrate de modificar los valores necesarios, por ejemplo:
   ```bash
   DATABASE_URL="postgresql://usuario:password@localhost:5432/recommendation_system_db?schema=public"
   NEXTAUTH_SECRET="tu_clave_secreta"
   NEXTAUTH_URL="http://localhost:3000"
   ```
   ⚠️ **Importante: Reemplaza usuario, password y el nombre de la base de datos con tus credenciales reales**
   
4. **Crea la base de datos en PostgreSQL:**

   Desde tu cliente SQL o terminal:
   ```bash
   CREATE DATABASE recommendation_system_db;
   ```
   
5. **Genera el cliente de Prisma:**
   ```bash
   npx prisma generate
   
6. **Ejecuta las migraciones para crear las tablas:**
   ```bash
   npx prisma migrate dev
   
7. **Ejecuta los datos semilla (seed):**
   ```bash
   npm run seed

8. **Inicia el servidor de desarrollo 🚀:**
   ```bash
   npm run dev

  El servidor estará disponible en `http://localhost:3000` y se conectará a la base de datos usando las variables del archivo `.env`.

## 🤝 Contribución

¡Gracias por tu interés en contribuir a Medibot AI! 🤖💊

Sigue estos pasos para colaborar de manera ordenada:

1. Haz un fork del proyecto
   ```bash
   git clone https://github.com/<tu_usuario>/medibot-ai.git
   cd medibot-ai
   git checkout -b feature/nueva-api
   ```
2. Clona tu fork y crea una nueva rama para tu feature:
   ```bash
   git fork https://github.com/PIEROLS15/medibot-ai.git
   ```
3. Agrega tu nuevo módulo o funcionalidad

   Si es una API, colócala dentro de:
   ```bash
   src/app/api/
   ```

   Ejemplo:
   ```bash
   src/app/api/user/route.ts
   ```
   
4. Ejecuta ESLint antes de hacer commit (corrige errores automáticamente):
   ```bash
   npm run lint:fix
   ```
   
5. Haz commit de tus cambios con un mensaje descriptivo:
   ```bash
   git commit -m "feat: agrega nueva API de usuarios"
   ```
6. Haz push de tu rama al repositorio remoto:
   ```bash
   git push origin feature/nueva-api
   ```
7. Abre un Pull Request (PR)
   
   - Dirígete al repositorio original:
     https://github.com/PIEROLS15/medibot-ai

   - Explica brevemente los cambios realizados y su propósito.

## 📄 Licencia

Este proyecto está bajo la licencia GPL. Ver `LICENSE` para más detalles.

---

Desarrollado por [PIEROLS15](https://github.com/PIEROLS15)
