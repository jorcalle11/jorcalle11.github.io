/** Strip characters unsafe in file names across common OSes. */
function sanitizeFilePart(value: string): string {
  return value
    .replace(/[/\\:*?"<>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Build a download name like "Jorge Calle - Senior Backend Engineer.pdf"
 * from the CV markdown header (# name, then **role**).
 */
export function pdfFilenameFromCvMarkdown(content: string, fallback: string): string {
  const lines = content.split(/\r?\n/)
  let name: string | undefined
  for (const line of lines) {
    const trimmed = line.trim()

    if (!name && trimmed.startsWith('# ')) {
      name = trimmed.slice(2).trim()
      continue
    }

    if (name) {
      const roleMatch = /^\*\*(.+)\*\*$/.exec(trimmed)
      if (roleMatch) {
        const role = roleMatch[1].trim()
        const safeName = sanitizeFilePart(name)
        const safeRole = sanitizeFilePart(role)
        if (safeName && safeRole) {
          return `${safeName} - ${safeRole}.pdf`
        }
        break
      }
    }
  }
  return fallback
}
