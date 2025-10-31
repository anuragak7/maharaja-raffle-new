export function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 4) return '***'
  const tail = digits.slice(-4)
  return `XXX-XXX-${tail}`
}

export function formatPhone(phone: string) {
  const d = phone.replace(/\D/g, '')
  if (d.length !== 10) return phone
  return `${d.slice(0,3)}-${d.slice(3,6)}-${d.slice(6)}`
}
