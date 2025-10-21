-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('Administrator', 'Pharmacist', 'Visitor');

-- CreateEnum
CREATE TYPE "TypeIdentification" AS ENUM ('DNI', 'RUC');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "resetToken" TEXT,
    "resetTokenExpiresAt" TIMESTAMP(3),
    "roleId" INTEGER NOT NULL,
    "googleId" TEXT,
    "profileImage" TEXT,
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
CREATE TABLE "IdentificationType" (
    "id" SERIAL NOT NULL,
    "type" "TypeIdentification" NOT NULL,

    CONSTRAINT "IdentificationType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" SERIAL NOT NULL,
    "identificationTypeId" INTEGER NOT NULL,
    "identificationNumber" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evaluation" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "sex" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "symptoms" JSONB NOT NULL,
    "allergies" JSONB,
    "preexistingDiseases" JSONB,
    "pregnancy" BOOLEAN,
    "currentMedication" TEXT,
    "symptomDuration" INTEGER NOT NULL,
    "severity" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" SERIAL NOT NULL,
    "evaluationId" INTEGER NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicationRecommendation" (
    "id" SERIAL NOT NULL,
    "recommendationId" INTEGER NOT NULL,
    "medication" TEXT NOT NULL,
    "form" TEXT NOT NULL,
    "via" TEXT NOT NULL,
    "amountValue" DOUBLE PRECISION NOT NULL,
    "amountUnit" TEXT NOT NULL,
    "everyHour" INTEGER NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "moment" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "warnings" JSONB NOT NULL,

    CONSTRAINT "MedicationRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "IdentificationType_type_key" ON "IdentificationType"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_identificationNumber_key" ON "Patient"("identificationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Recommendation_evaluationId_key" ON "Recommendation"("evaluationId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_identificationTypeId_fkey" FOREIGN KEY ("identificationTypeId") REFERENCES "IdentificationType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "Evaluation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationRecommendation" ADD CONSTRAINT "MedicationRecommendation_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "Recommendation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
