/** Extract Instagram username from @handle, URL, or free text. */
export function extractInstagramUsername(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null

  const text = raw.trim()

  const urlMatch = text.match(
    /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([A-Za-z0-9._]+)/i
  )
  if (urlMatch?.[1] && !['p', 'reel', 'reels', 'stories', 'explore', 'direct'].includes(urlMatch[1].toLowerCase())) {
    return urlMatch[1]
  }

  const atMatch = text.match(/@([A-Za-z0-9._]{1,30})/)
  if (atMatch?.[1]) return atMatch[1]

  // Plain handle without @
  if (/^[A-Za-z0-9._]{1,30}$/.test(text)) return text

  return null
}

/** Opens Instagram DM thread. Message body cannot be prefilled by Instagram. */
export function instagramDmUrl(username: string): string {
  return `https://ig.me/m/${encodeURIComponent(username)}`
}
