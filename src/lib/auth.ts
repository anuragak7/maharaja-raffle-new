export function assertAdminAuth(req: Request) {
  const header = req.headers.get('authorization') || ''
  const pass = process.env.ADMIN_PASSWORD
  if (!pass) {
    return new Response('Server not configured: ADMIN_PASSWORD missing', { status: 500 })
  }
  if (!header.startsWith('Bearer ')) {
    return new Response('Missing Bearer token', { status: 401 })
  }
  const token = header.slice(7)
  if (token !== pass) {
    return new Response('Unauthorized', { status: 401 })
  }
  return null
}
