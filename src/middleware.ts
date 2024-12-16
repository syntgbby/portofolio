import type { NextRequest } from 'next/server'
import {  NextResponse } from 'next/server'

const protectedRoutes = [
    '/admin-page',
    '/public',
    "/admin-page/work",
    "/admin-page/message/list",
    "/admin-page/message/form",
    "/admin-page/blogs/view",
    "/admin-page/blogs/view/:id",
    "/admin-page/blogs/list",
    "/admin-page/blogs/list/:id",
    "/admin-page/blogs/form",
    "/admin-page/blogs/form/:id",
]

export default async function middleware(req: NextRequest) {
    const cookie = await req.cookies.get(`${process.env.AUTH_COOKIE_NAME}`)
    const path = req.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.includes(path)

    if (isProtectedRoute && !cookie) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    return NextResponse.next()
}