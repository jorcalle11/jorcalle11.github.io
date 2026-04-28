import { Download } from 'lucide-react'
import { useRef, useCallback } from 'react'
import './DownloadButton.css'

interface DownloadButtonProps {
  filename?: string
  contentRef: React.RefObject<HTMLElement | null>
}

export function DownloadButton({ filename = 'cv.pdf', contentRef }: DownloadButtonProps) {
  const isGeneratingRef = useRef(false)

  const handleDownload = useCallback(async () => {
    if (isGeneratingRef.current) return

    const element = contentRef.current
    if (!element) {
      console.warn('No content element found for PDF generation')
      return
    }

    isGeneratingRef.current = true

    try {
      const html2pdf = (await import('html2pdf.js')).default

      const opt = {
        margin: [10, 10],
        filename,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          windowWidth: 1200,
        },
        jsPDF: {
          unit: 'mm' as const,
          format: 'a4' as const,
          orientation: 'portrait' as const
        }
      }

      await html2pdf().set(opt as any).from(element).save()
    } catch (error) {
      console.error('PDF generation failed:', error)
    } finally {
      isGeneratingRef.current = false
    }
  }, [filename, contentRef])

  return (
    <button
      className="download-button no-print"
      onClick={handleDownload}
      aria-label="Download CV as PDF"
      title="Download CV as PDF"
    >
      <Download size={18} />
      <span>PDF</span>
    </button>
  )
}
