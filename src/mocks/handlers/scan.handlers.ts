import { delay, http, HttpResponse } from 'msw'
import type { ApiErrorContract } from '@/types/user.contracts'
import type { ScanCodeKind, ScanResolveContract } from '@/types/scan.contracts'
import { getNft } from '@/mocks/state/nft.store'

/**
 * Formatos aceitos:
 * - `kurio:nft:<id>`: QR do certificado impresso/exposto junto à obra (autenticidade verificada);
 * - link compartilhado da página do NFT (`.../nft?item=<id>`);
 * - identificador do NFT digitado (`emerald-ape-042`).
 */
function parseScanCode(rawCode: string): { kind: ScanCodeKind; nftId: string } | undefined {
  const code = rawCode.trim()
  const certificate = /^kurio:nft:([a-z0-9-]+)$/i.exec(code)
  if (certificate) return { kind: 'certificate', nftId: certificate[1].toLowerCase() }
  try {
    const url = new URL(code)
    const item = url.searchParams.get('item')
    if (item && url.pathname.replace(/\/$/, '').endsWith('/nft')) return { kind: 'share-link', nftId: item }
  } catch {
    // Não é URL; segue para o identificador simples.
  }
  if (/^[a-z0-9]+(-[a-z0-9]+)+$/i.test(code)) return { kind: 'nft-id', nftId: code.toLowerCase() }
  return undefined
}

export const scanHandlers = [
  http.post('/api/scan/resolve', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as { code?: unknown }
    await delay(450)
    if (typeof body.code !== 'string' || !body.code.trim() || body.code.length > 512) {
      const error: ApiErrorContract = {
        code: 'VALIDATION_ERROR',
        message: 'Informe o conteúdo do QR code.',
        fieldErrors: { code: 'Campo obrigatório.' },
      }
      return HttpResponse.json(error, { status: 422 })
    }
    const parsed = parseScanCode(body.code)
    const nft = parsed ? getNft(parsed.nftId) : undefined
    if (!parsed || !nft) {
      const error: ApiErrorContract = {
        code: 'SCAN_CODE_NOT_FOUND',
        message: 'Este código não corresponde a nenhum NFT da Kurio.',
      }
      return HttpResponse.json(error, { status: 404 })
    }
    const result: ScanResolveContract = {
      code: body.code.trim(),
      kind: parsed.kind,
      verified: parsed.kind === 'certificate',
      tokenId: `#${nft.id.match(/(\d+)$/)?.[1]?.padStart(4, '0') ?? nft.id}`,
      nft: { ...nft },
      resolvedAt: new Date().toISOString(),
    }
    return HttpResponse.json(result)
  }),
]
