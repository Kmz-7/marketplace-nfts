import type { NftContract } from '@/types/nft.contracts'

/** Origem reconhecida do código lido pelo scanner. */
export type ScanCodeKind = 'certificate' | 'share-link' | 'nft-id'

export interface ScanResolveRequest {
  /** Conteúdo bruto do QR code ou digitado manualmente. */
  code: string
}

export interface ScanResolveContract {
  code: string
  kind: ScanCodeKind
  /** `true` quando o código é um certificado Kurio emitido para o token. */
  verified: boolean
  tokenId: string
  nft: NftContract
  resolvedAt: string
}
