/** 车架号：17 位，不含 I、O、Q */
export const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/i

export function normalizeVin(raw: string) {
  return raw.trim().toUpperCase().replace(/\s/g, '')
}

export function isValidVin(vin: string) {
  return VIN_REGEX.test(normalizeVin(vin))
}

export function isValidAccidentTime(s: string) {
  return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(s.trim())
}

/** NutUI DatePicker datetime 确认值 → 后端 accident_time */
export function formatAccidentTimeFromPicker(values: (string | number)[]): string {
  const [year, month, day, hour, minute, second = 0] = values.map((v) => Number(v))
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${year}-${pad(month)}-${pad(day)} ${pad(hour)}:${pad(minute)}:${pad(second)}`
}
