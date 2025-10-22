import { jsPDF } from "jspdf"
import { typeIdentification } from "@/utils/recommendation"
import { Recommendation, UserData } from "@/types/recommendation"

export async function generatePDF(
    userData: UserData,
    recommendations: Recommendation[],
    reason: string | null
): Promise<void> {
    const doc = new jsPDF()
    const NEXTAUTH_URL = process.env.NEXT_PUBLIC_NEXTAUTH_URL ?? "No funciono"

    // === Cargar marca de agua ===
    const watermark = await loadLogoAsBase64("/logo_medibotai.png")

    // Tamaño de la marca de agua (ajusta según prefieras)
    const watermarkWidth = 200
    const watermarkHeight = watermark.height * (watermarkWidth / watermark.width)

    // Agregar marca de agua en la primera página
    await addWatermark(doc, watermark.dataUrl, watermarkWidth, watermarkHeight)

    // === Logo y encabezado ===
    const { dataUrl, width, height } = await loadLogoAsBase64("/logo_name_black.png")
    const xPos = 20
    const yPosLogo = 5
    doc.addImage(dataUrl, "PNG", xPos, yPosLogo, width, height)

    const titleYPos = yPosLogo + (height / 2) + 2
    doc.setFont("helvetica", "bold").setFontSize(14)
    const title = "Recomendación de medicamentos"
    const rightMargin = 190
    const textWidth = doc.getTextWidth(title)

    const titleX = rightMargin - textWidth
    doc.text(title, titleX, titleYPos)

    // Fecha
    const fecha = new Date().toLocaleDateString("es-PE", { timeZone: "America/Lima" })
    doc.setFont("helvetica", "normal").setFontSize(10)
    doc.text(`Generado el ${fecha}`, rightMargin, titleYPos + 8, { align: "right" })

    // empezar debajo del logo con menos espacio
    let yPos = yPosLogo + height + 10

    // === Información del Paciente ===
    doc.setFont("helvetica", "bold").setFontSize(13)
    doc.text("Información del Paciente", 20, yPos)
    doc.line(20, yPos + 2, 190, yPos + 2)
    yPos += 10

    yPos = printField(doc, "Paciente:", userData.fullName, yPos)
    yPos = printField(doc, "Tipo de identificación:", typeIdentification(userData.idType), yPos)
    yPos = printField(doc, "Número de identificación:", userData.idNumber, yPos)
    yPos = printField(doc, "Edad:", `${userData.age} años`, yPos)

    // === Síntomas reportados ===
    if (userData.symptoms) {
        yPos = printListField(doc, "Síntomas reportados:", userData.symptoms, yPos)
    }

    // === Alergias ===
    if (userData.allergies) {
        yPos = printListField(doc, "Alergias presentadas:", userData.allergies, yPos)
    }

    // === Enfermedades ===
    if (userData.diseases) {
        yPos = printListField(doc, "Enfermedades preexistentes:", userData.diseases, yPos)
    }

    yPos += 5

    // === Medicamentos Recomendados ===
    doc.setFont("helvetica", "bold").setFontSize(13)
    doc.text("Medicamentos Recomendados", 20, yPos)
    doc.line(20, yPos + 2, 190, yPos + 2)
    yPos += 10

    if (recommendations.length > 0) {
        recommendations.forEach((rec, index) => {
            if (yPos > 260) {
                doc.addPage()
                yPos = 20
                // Agregar marca de agua en la nueva página
                addWatermark(doc, watermark.dataUrl, watermarkWidth, watermarkHeight)
            }

            doc.setFont("helvetica", "bold").setFontSize(11)
            doc.text(`${index + 1}. ${rec.medication} (${rec.amount_value}${rec.amount_unit})`, 20, yPos)
            yPos += 7

            doc.setFont("helvetica", "bold")
            doc.text("Instrucciones:", 30, yPos)
            doc.setFont("helvetica", "normal")
            const instr = doc.splitTextToSize(rec.instructions, 140)
            doc.text(instr, 70, yPos)
            yPos += instr.length * 6 + 5

            if (rec.warnings?.length) {
                doc.setFont("helvetica", "bold")
                doc.text("Advertencias:", 30, yPos)
                yPos += 6
                doc.setFont("helvetica", "normal")
                rec.warnings.forEach(warning => {
                    const split = doc.splitTextToSize(warning, 130)
                    doc.text(`• ${split[0]}`, 40, yPos)
                    if (split.length > 1) {
                        for (let i = 1; i < split.length; i++) {
                            yPos += 6
                            doc.text(`  ${split[i]}`, 40, yPos)
                        }
                    }
                    yPos += 6
                })
            }
            yPos += 4
        })
    } else if (reason) {
        doc.setFont("helvetica", "bold")
        doc.text("Motivo:", 30, yPos)
        doc.setFont("helvetica", "normal")
        const reasonText = doc.splitTextToSize(reason, 150)
        doc.text(reasonText, 70, yPos)
    } else {
        doc.setFont("helvetica", "normal")
        doc.text("No hay recomendaciones disponibles.", 30, yPos)
    }

    printFooterURL(doc, NEXTAUTH_URL)

    const fileName = `Recomendacion_${userData.fullName.replace(/\s+/g, "_")}.pdf`
    doc.save(fileName)
}

/**
 * Imprime campos "Etiqueta: valor"
 */
function printField(doc: jsPDF, label: string, value: string, y: number): number {
    doc.setFont("helvetica", "bold").setFontSize(11)
    doc.text(label, 20, y)
    doc.setFont("helvetica", "normal")
    const split = doc.splitTextToSize(value, 110)
    doc.text(split, 70, y)
    return y + split.length * 6 + 4
}

/**
 * Imprime listas (síntomas, alergias, enfermedades) con viñetas
 */
function printListField(doc: jsPDF, label: string, value: string, y: number): number {
    doc.setFont("helvetica", "bold").setFontSize(11)
    doc.text(label, 20, y)
    y += 6
    doc.setFont("helvetica", "normal")
    const items = value.split(/[;,\n]/).map(i => i.trim()).filter(Boolean)
    items.forEach(item => {
        const split = doc.splitTextToSize(item, 120)
        doc.text(`• ${split[0]}`, 30, y)
        if (split.length > 1) {
            for (let i = 1; i < split.length; i++) {
                y += 6
                doc.text(`  ${split[i]}`, 30, y)
            }
        }
        y += 6
    })
    return y
}

/**
 * Carga el logo y lo ajusta proporcionalmente dentro de un contenedor fijo.
 */
async function loadLogoAsBase64(
    url: string
): Promise<{ dataUrl: string; width: number; height: number }> {
    const response = await fetch(url)
    const blob = await response.blob()

    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => {
            const img = new Image()
            img.src = reader.result as string
            img.onload = () => {
                // 🔧 Tamaño del contenedor (ajusta según prefieras)
                const containerWidth = 120
                const containerHeight = 50

                let { width, height } = img
                const ratio = Math.min(containerWidth / width, containerHeight / height)

                width = width * ratio
                height = height * ratio

                resolve({ dataUrl: reader.result as string, width, height })
            }
            img.onerror = reject
        }
        reader.onerror = reject
        reader.readAsDataURL(blob)
    })
}

/**
 * Agrega marca de agua centrada en la página actual
 */
async function addWatermark(doc: jsPDF, watermarkData: string, width: number, height: number): Promise<void> {
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    // Centrar la marca de agua
    const x = (pageWidth - width) / 2
    const y = (pageHeight - height) / 2

    // Agregar con opacidad reducida (marca de agua)
    doc.saveGraphicsState()
    // @ts-expect-error - `internal.GState` no está declarado en los tipos públicos de jsPDF
    doc.setGState(new doc.GState({ opacity: 0.2 }))
    doc.addImage(watermarkData, "PNG", x, y, width, height)
    doc.restoreGraphicsState()
}

/**
 * Función para imprimir el NEXTAUTH_URL al final de cada hoja
 */
function printFooterURL(doc: jsPDF, url: string) {
    const pageHeight = doc.internal.pageSize.getHeight()
    const rightMargin = 190
    doc.setFont("helvetica", "italic").setFontSize(9)
    doc.text(url, rightMargin, pageHeight - 10, { align: "right" })
}
