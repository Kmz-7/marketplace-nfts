import { useEffect, useRef, useState } from 'react'

type DetectedBarcode = { rawValue: string }
type BarcodeDetectorInstance = { detect: (source: HTMLVideoElement) => Promise<DetectedBarcode[]> }
type BarcodeDetectorConstructor = new (options?: { formats: string[] }) => BarcodeDetectorInstance

export type QrScannerStatus = 'starting' | 'scanning' | 'unsupported' | 'denied' | 'error'

function getBarcodeDetector() {
  if (typeof window === 'undefined') return undefined
  return (window as Window & { BarcodeDetector?: BarcodeDetectorConstructor }).BarcodeDetector
}

/**
 * Lê QR codes pela câmera traseira com a API nativa `BarcodeDetector` (Chrome/Edge Android, Safari 17+ com flag).
 * Sem suporte ou sem permissão, `status` informa o motivo e a tela oferece a digitação do código.
 */
export function useQrScanner({ enabled, onDetect }: { enabled: boolean; onDetect: (value: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const onDetectRef = useRef(onDetect)
  const supported = Boolean(getBarcodeDetector() && navigator.mediaDevices?.getUserMedia)
  const [status, setStatus] = useState<QrScannerStatus>(supported ? 'starting' : 'unsupported')

  useEffect(() => {
    onDetectRef.current = onDetect
  }, [onDetect])

  useEffect(() => {
    const Detector = getBarcodeDetector()
    if (!enabled || !Detector || !navigator.mediaDevices?.getUserMedia) return
    const detector = new Detector({ formats: ['qr_code'] })
    let stream: MediaStream | undefined
    let timeout: number | undefined
    let cancelled = false

    const scanFrame = async (video: HTMLVideoElement) => {
      if (cancelled) return
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        try {
          const value = (await detector.detect(video))[0]?.rawValue
          if (value && !cancelled) {
            onDetectRef.current(value)
            return
          }
        } catch {
          // Quadro ilegível; tenta o próximo.
        }
      }
      timeout = window.setTimeout(() => void scanFrame(video), 250)
    }

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      .then(async (mediaStream) => {
        const video = videoRef.current
        if (cancelled || !video) {
          mediaStream.getTracks().forEach((track) => track.stop())
          return
        }
        stream = mediaStream
        video.srcObject = mediaStream
        await video.play()
        setStatus('scanning')
        void scanFrame(video)
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setStatus(error instanceof DOMException && error.name === 'NotAllowedError' ? 'denied' : 'error')
      })

    return () => {
      cancelled = true
      window.clearTimeout(timeout)
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [enabled])

  return { videoRef, status }
}
