import { Columns, Layout } from 'lucide-react'
import './LayoutToggle.css'

type LayoutType = 'sidebar' | 'swiss'

interface LayoutToggleProps {
  current: LayoutType
  onChange: (layout: LayoutType) => void
}

export function LayoutToggle({ current, onChange }: LayoutToggleProps) {
  return (
    <div className="layout-toggle no-print">
      <button
        className={`layout-option ${current === 'sidebar' ? 'active' : ''}`}
        onClick={() => onChange('sidebar')}
        aria-label="Sidebar layout"
        title="Sidebar layout"
      >
        <Columns size={18} />
      </button>
      <button
        className={`layout-option ${current === 'swiss' ? 'active' : ''}`}
        onClick={() => onChange('swiss')}
        aria-label="Swiss layout"
        title="Swiss layout"
      >
        <Layout size={18} />
      </button>
    </div>
  )
}
