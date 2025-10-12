-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('Administrator', 'Pharmacist', 'Visitor');

-- CreateEnum
CREATE TYPE "TypeIdentification" AS ENUM ('DNI', 'RUC');

-- CreateEnum
CREATE TYPE "TypeResultOptions" AS ENUM ('Improved', 'No_changes');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "resetToken" TEXT,
    "resetTokenExpiresAt" TIMESTAMP(3),
    "roleId" INTEGER NOT NULL,
    "googleId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" "RoleType" NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" SERIAL NOT NULL,
    "identificationId" INTEGER NOT NULL,
    "identificationNumber" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdentificationType" (
    "id" SERIAL NOT NULL,
    "type" "TypeIdentification" NOT NULL,

    CONSTRAINT "IdentificationType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medication" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sideEffects" TEXT,
    "interactions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Medication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicationHistory" (
    "id" SERIAL NOT NULL,
    "medicationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resultOptionId" INTEGER,
    "patientId" INTEGER NOT NULL,

    CONSTRAINT "MedicationHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResultOptions" (
    "id" SERIAL NOT NULL,
    "type" "TypeResultOptions" NOT NULL,

    CONSTRAINT "ResultOptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_identificationNumber_key" ON "Patient"("identificationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "IdentificationType_type_key" ON "IdentificationType"("type");

-- CreateIndex
CREATE UNIQUE INDEX "ResultOptions_type_key" ON "ResultOptions"("type");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_identificationId_fkey" FOREIGN KEY ("identificationId") REFERENCES "IdentificationType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationHistory" ADD CONSTRAINT "MedicationHistory_resultOptionId_fkey" FOREIGN KEY ("resultOptionId") REFERENCES "ResultOptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationHistory" ADD CONSTRAINT "MedicationHistory_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
