
export const getRoleUser = (role: string) => {
    if (role === 'Administrator') return 'bg-primary hover:bg-primary text-white'
    if (role === 'Pharmacist') return 'bg-secondary hover:bg-secondary text-white'
    if (role === 'Visitor') return 'bg-green-600 hover:bg-green-700 text-white'
    return 'bg-gray-500 hover:bg-gray-600 text-white'
}

export const getNameRoleUser = (role: string) => {
    if (role === 'Administrator') return 'Administrador'
    if (role === 'Pharmacist') return 'Farmaceútico'
    if (role === 'Visitor') return 'Visitante'
    return role
}

export const getStatusUser = (status: boolean) => {
    if (status == true) {
        return 'success'
    } else {
        return 'destructive'
    }
}

export const getInitials = (names: string, lastNames: string) => {
    const firstInitial = names ? names.charAt(0).toUpperCase() : ''
    const lastInitial = lastNames ? lastNames.charAt(0).toUpperCase() : ''
    return `${firstInitial}${lastInitial}`
}
