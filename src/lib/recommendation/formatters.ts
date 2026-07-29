export function listSymptoms(symptoms: string[]) {
    if (!symptoms || symptoms.length === 0) return 'no reportado'
    return symptoms.map((s) => `- ${s}`).join('\n')
}

export function listAllergies(allergies?: string[] | null) {
    if (!allergies || allergies.length === 0) return 'no reportado'
    return allergies.join(', ')
}

export function listDiseases(diseases?: string[] | null) {
    if (!diseases || diseases.length === 0) return 'no reportado'
    return diseases.join(', ')
}

export function fmtPregnancy(pregnancy?: boolean | null) {
    if (pregnancy === true) return 'sí'
    if (pregnancy === false) return 'no'
    return 'no aplica'
}

export function typeIdentification(idType: string) {
    if (idType === '1') return 'DNI'
    if (idType === '2') return 'RUC'
    return 'No reportado'
}
