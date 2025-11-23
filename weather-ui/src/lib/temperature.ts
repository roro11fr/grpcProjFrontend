export function toUnit(tempC: number, unit: 'C' | 'F') {
  return unit === 'C' ? tempC : (tempC * 9) / 5 + 32
}

export function fmtTemp(tempC: number, unit: 'C' | 'F', decimals = 0) {
  return Number(toUnit(tempC, unit).toFixed(decimals))
}
