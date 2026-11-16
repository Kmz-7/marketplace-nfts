const ETH_SCALE = 100_000_000n

export function parseEth(value: string) {
  const [whole, fraction = ''] = value.split('.')
  return BigInt(whole) * ETH_SCALE + BigInt(fraction.slice(0, 8).padEnd(8, '0') || '0')
}

export function formatEth(value: bigint) {
  const whole = value / ETH_SCALE
  const fraction = (value % ETH_SCALE).toString().padStart(8, '0').replace(/0+$/, '')
  return `${whole}.${fraction.padEnd(2, '0')}`
}

export function multiplyEth(value: string, quantity: number) {
  return formatEth(parseEth(value) * BigInt(quantity))
}
