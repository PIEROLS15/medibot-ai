export const getRoleUser = (role: string) => {
    if (role === 'Administrator') {
        return 'bg-primary hover:bg-primary text-white'
    } else {
        return 'bg-secondary hover:bg-secondary text-white'
    }
}

export const getNameRoleUser = (role: string) => {
    if (role === 'Administrator') {
        return 'Administrador'
    } else {
        return 'Farmaceútico'
    }
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