import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import './ThemeToggle.css'

export function ThemeToggle() {
  const [theme, toggleTheme] = useTheme()

  return (
    <button
      className="theme-toggle no-print"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  )
}
