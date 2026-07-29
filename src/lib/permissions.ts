export const roleAccess: Record<string, string[]> = {
    '/dashboard/users': ['Administrator'],
    '/dashboard/patients': ['Administrator', 'Pharmacist'],
    '/dashboard/recommendation': ['Administrator', 'Pharmacist', 'Visitor'],
    '/dashboard': ['Administrator', 'Pharmacist'],
}

export function getDeniedRedirectPath(pathname: string, role: string) {
    const restrictedPath = Object.keys(roleAccess).find((path) => pathname.startsWith(path))

    if (!restrictedPath) return null

    const allowedRoles = roleAccess[restrictedPath]
    if (allowedRoles.includes(role)) return null

    return '/dashboard/recommendation'
}
