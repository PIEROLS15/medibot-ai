import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'

export default withAuth(
    async function middleware(request: NextRequest) {
        const token = await getToken({ req: request })
        const { pathname } = request.nextUrl

        if (!token) {
            const loginUrl = new URL('/', request.url)
            return NextResponse.redirect(loginUrl)
        }

        const userRole = token.role as string

        const roleAccess: Record<string, string[]> = {
            '/dashboard/users': ['Administrator'],
            '/dashboard/patients': ['Administrator', 'Pharmacist'],
            '/dashboard/recommendation': ['Administrator', 'Pharmacist', 'Visitor'],
            '/dashboard': ['Administrator', 'Pharmacist'],
        }

        const restrictedPath = Object.keys(roleAccess).find((path) =>
            pathname.startsWith(path)
        )

        if (restrictedPath) {
            const allowedRoles = roleAccess[restrictedPath]
            if (!allowedRoles.includes(userRole)) {
                const deniedUrl = new URL('/dashboard/recommendation', request.url)
                deniedUrl.searchParams.set('denied', 'true')
                return NextResponse.redirect(deniedUrl)
            }
        }

        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
)

export const config = {
    matcher: ['/dashboard/:path*'],
}
