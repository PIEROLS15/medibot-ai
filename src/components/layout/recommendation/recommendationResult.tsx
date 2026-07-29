/* eslint-disable */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, AlertTriangle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { typeIdentification } from '@/lib/recommendation/formatters'
import { generatePDF } from '@/lib/recommendation/pdf'
import { MedicalResponse, Recommendation, UserData } from '@/types/recommendation'

interface RecomendacionResultadoProps {
    recommendations: MedicalResponse | null
    userData: UserData
    isLoading?: boolean
}

export { default } from '@/components/features/recommendation/recommendationResult'
