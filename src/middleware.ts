import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import { getDeniedRedirectPath } from '@/lib/permissions'

export default withAuth(
    async function middleware(request: NextRequest) {
        const token = await getToken({ req: request })
        const { pathname } = request.nextUrl

        if (!token) {
            const loginUrl = new URL('/', request.url)
            return NextResponse.redirect(loginUrl)
        }

        const userRole = token.role as string

        const deniedPath = getDeniedRedirectPath(pathname, userRole)

        if (deniedPath) {
            const deniedUrl = new URL(deniedPath, request.url)
            deniedUrl.searchParams.set('denied', 'true')
            return NextResponse.redirect(deniedUrl)
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
