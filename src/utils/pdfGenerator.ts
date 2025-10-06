import { jsPDF } from "jspdf"
import { typeIdentification } from "@/utils/recommendation"
import { Recommendation, UserData } from "@/types/recommendation"

export async function generatePDF(
    userData: UserData,
    recommendations: Recommendation[],
    reason: string | null
): Promise<void> {
    const doc = new jsPDF()

    // === Logo y encabezado ===
    const { dataUrl, width, height } = await loadLogoAsBase64("/logo.jpg")
    doc.addImage(dataUrl, "JPEG", 20, 10, width, height)

    doc.setFont("helvetica", "bold").setFontSize(14)
    doc.text("Recomendación de medicamentos", 140, 20, { align: "center" })

    const fecha = new Date().toLocaleDateString()
    doc.setFont("helvetica", "normal").setFontSize(10)
    doc.text(`Generado el ${fecha}`, 190, 28, { align: "right" })

    // empezar debajo del logo
    let yPos = 10 + height + 20

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
 * Carga el logo de /public/logo.jpg y lo escala proporcionalmente
 */
async function loadLogoAsBase64(url: string): Promise<{ dataUrl: string; width: number; height: number }> {
    const response = await fetch(url)
    const blob = await response.blob()

    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => {
            const img = new Image()
            img.src = reader.result as string
            img.onload = () => {
                const maxWidth = 40  // ancho máximo
                const maxHeight = 20 // alto máximo
                let { width, height } = img

                // escalar proporcionalmente
                if (width > maxWidth) {
                    height = (maxWidth / width) * height
                    width = maxWidth
                }
                if (height > maxHeight) {
                    width = (maxHeight / height) * width
                    height = maxHeight
                }

                resolve({ dataUrl: reader.result as string, width, height })
            }
            img.onerror = reject
        }
        reader.onerror = reject
        reader.readAsDataURL(blob)
    })
}
