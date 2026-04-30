import { useRef, useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Mail, MapPin } from 'lucide-react'
import { GitHubIcon, XIcon } from './components/ContactIcons/ContactIcons'
import { DownloadButton } from './components/DownloadButton/DownloadButton'
import { ThemeToggle } from './components/ThemeToggle/ThemeToggle'
import { LayoutToggle } from './components/LayoutToggle/LayoutToggle'
import { GitHubAvatar } from './components/GitHubAvatar/GitHubAvatar'
import fullstackContent from './content/fullstack.md?raw'
import frontendContent from './content/frontend.md?raw'
import devopsContent from './content/devops.md?raw'
import backendContent from './content/backend.md?raw'
import './App.css'
import { pdfFilenameFromCvMarkdown } from './utils/pdfFilename'

type LayoutType = 'sidebar' | 'swiss'
type VariantType = 'fullstack' | 'frontend' | 'backend' | 'devops'

const contentMap: Record<VariantType, string> = {
  fullstack: fullstackContent,
  frontend: frontendContent,
  backend: backendContent,
  devops: devopsContent,
}

function App() {
  const [layout, setLayout] = useState<LayoutType>('sidebar')
  const [variant, setVariant] = useState<VariantType>('fullstack')
  const contentRef = useRef<HTMLElement>(null)

  // Read variant from URL query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const v = params.get('v') as VariantType | null
    if (v && contentMap[v]) {
      setVariant(v)
    }
  }, [])

  const content = contentMap[variant]
  const pdfFilename = pdfFilenameFromCvMarkdown(content, `cv-${variant}.pdf`)

  return (
    <div className="cv-page">
      <header className="page-header no-print">
        <div className="page-header-content">
          <GitHubAvatar content={content} />
          <div className="page-controls">
            <LayoutToggle current={layout} onChange={setLayout} />
            <ThemeToggle />
            <DownloadButton contentRef={contentRef} filename={pdfFilename} />
          </div>
        </div>
      </header>

      <main>
        {layout === 'sidebar' ? (
          <SidebarView contentRef={contentRef} content={content} />
        ) : (
          <SwissView contentRef={contentRef} content={content} />
        )}
      </main>
    </div>
  )
}

// Swiss Layout Component
function SwissView({ contentRef, content }: { contentRef: React.RefObject<HTMLElement | null>, content: string }) {
  return (
    <article ref={contentRef} className="swiss-layout">
      <div className="swiss-content">
        <ReactMarkdown
          components={{
            h1: ({ children }) => <h1 className="swiss-title">{children}</h1>,
            h2: ({ children }) => <h2 className="swiss-section-title">{children}</h2>,
            h3: ({ children }) => <h3 className="swiss-job-title">{children}</h3>,
            p: ({ children }) => <p className="swiss-paragraph">{children}</p>,
            ul: ({ children }) => <ul className="swiss-list">{children}</ul>,
            li: ({ children }) => <li className="swiss-list-item">{children}</li>,
            a: ({ href, children }) => (
              <ContactLink href={href} className="swiss-link">{children}</ContactLink>
            ),
            strong: ({ children }) => <strong className="swiss-strong">{children}</strong>,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </article>
  )
}

// Sidebar Layout Component
function SidebarView({ contentRef, content }: { contentRef: React.RefObject<HTMLElement | null>, content: string }) {
  // Parse content sections
  const sections = content.split(/^## /m).filter(Boolean)
  const headerContent = sections[0] || ''
  const skillSection = sections.find(s => s.toLowerCase().includes('skill'))
  const educationSection = sections.find(s => s.toLowerCase().includes('education'))
  const mainSections = sections.filter(s =>
    !s.toLowerCase().includes('skill') &&
    !s.toLowerCase().includes('education') &&
    s !== headerContent
  )
  const sidebarContent = [skillSection, educationSection].filter(Boolean).join('\n\n## ')
  const mainContent = mainSections.join('\n\n## ')

  return (
    <article ref={contentRef} className="sidebar-layout">
      <div className="sidebar-header">
        <ReactMarkdown
          components={{
            h1: ({ children }) => <h1 className="sidebar-title">{children}</h1>,
            p: ({ children }) => <p className="sidebar-subtitle">{children}</p>,
            a: ({ href, children }) => (
              <ContactLink href={href} className="sidebar-header-link">{children}</ContactLink>
            ),
          }}
        >
          {headerContent}
        </ReactMarkdown>
      </div>

      <div className="sidebar-grid">
        <aside className="sidebar-column">
          <ReactMarkdown
            components={{
              h2: ({ children }) => <h2 className="sidebar-section-title">{children}</h2>,
              h3: ({ children }) => <h3 className="sidebar-subsection-title">{children}</h3>,
              p: ({ children }) => <p className="sidebar-text">{children}</p>,
              ul: ({ children }) => <ul className="sidebar-list">{children}</ul>,
              li: ({ children }) => <li className="sidebar-list-item">{children}</li>,
              strong: ({ children }) => <strong className="sidebar-strong">{children}</strong>,
              a: ({ href, children }) => (
                <a href={href} className="sidebar-link" target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
            }}
          >
            {'## ' + sidebarContent}
          </ReactMarkdown>
        </aside>

        <div className="sidebar-main">
          <ReactMarkdown
            components={{
              h2: ({ children }) => <h2 className="sidebar-section-title">{children}</h2>,
              h3: ({ children }) => <h3 className="sidebar-job-title">{children}</h3>,
              p: ({ children }) => <p className="sidebar-text">{children}</p>,
              ul: ({ children }) => <ul className="sidebar-list">{children}</ul>,
              li: ({ children }) => <li className="sidebar-list-item">{children}</li>,
              strong: ({ children }) => <strong className="sidebar-strong">{children}</strong>,
              a: ({ href, children }) => (
                <a href={href} className="sidebar-link" target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
            }}
          >
            {'## ' + mainContent}
          </ReactMarkdown>
        </div>
      </div>
    </article>
  )
}

function ContactLink({
  href,
  children,
  className,
}: {
  href?: string
  children: React.ReactNode
  className: string
}) {
  const isEmail = href?.startsWith('mailto:')
  const isGithub = href?.includes('github.com')
  const isX = href?.includes('x.com') || href?.includes('twitter.com')
  const isLocation = href?.includes('maps.google.com') || href?.includes('google.com/maps')
  const hasIcon = isEmail || isGithub || isX || isLocation

  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {isEmail && <Mail size={14} aria-hidden="true" className="contact-link-icon" />}
      {isGithub && <GitHubIcon className="contact-link-icon" />}
      {isX && <XIcon className="contact-link-icon" />}
      {isLocation && <MapPin size={14} aria-hidden="true" className="contact-link-icon" />}
      <span className={hasIcon ? 'contact-link-text' : undefined}>{children}</span>
    </a>
  )
}

export default App
