import { useState, useEffect } from 'react'
import './GitHubAvatar.css'

interface GitHubAvatarProps {
  content: string
}

export function GitHubAvatar({ content }: GitHubAvatarProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    // Extract GitHub username from content
    // Looks for patterns like github.com/username or github.com/username/repo
    const match = content.match(/github\.com\/([a-zA-Z0-9_-]+)/)
    if (match && match[1] && match[1] !== 'username') {
      const user = match[1]
      setUsername(user)
      // GitHub avatar URL format
      setAvatarUrl(`https://github.com/${user}.png`)
    }
  }, [content])

  if (!avatarUrl || !username || username === 'username') {
    // Fallback to initials or placeholder
    return (
      <div className="github-avatar github-avatar-placeholder">
        <span>CV</span>
      </div>
    )
  }

  return (
    <div className="github-avatar">
      <img
        src={avatarUrl}
        alt={`${username}'s GitHub avatar`}
        className="github-avatar-image"
        onError={(e) => {
          // If image fails to load, show placeholder
          (e.target as HTMLImageElement).style.display = 'none'
        }}
      />
    </div>
  )
}
