

/**
 * Parses gallery image IDs from a markdown comment block.
 */
export function parseGalleryIds(content: string): string[] {
  const galleryMatch = content.match(new RegExp(`<!--\\s*gallery\\s*-->\\r?
([\\s\\S]*?)$`));
  if (!galleryMatch || !galleryMatch[1]) {
    return [];
  }
  return galleryMatch[1]
    .split(/\r?\n/)
    .map(line => line.replace(/^-/, '').trim())
    .filter(Boolean);
}

/**
 * Strips the gallery block from the content.
 */
export function stripGallery(content: string): string {
    const galleryMatch = content.match(new RegExp(`<!--\\s*gallery\\s*-->`));
    if (galleryMatch && galleryMatch.index) {
        return content.slice(0, galleryMatch.index).trim();
    }
    return content;
}

/**
 * A generic markdown parser that separates frontmatter and body.
 */
export function parseMarkdown(content: string): { frontmatter: Record<string, string>, body: string } | null {
    // Удаляем BOM (Byte Order Mark), который может присутствовать в начале файла
    const cleanedContent = content.replace(/^\uFEFF/, '');
    const frontmatterMatch = cleanedContent.match(new RegExp(`^---([\\s\\S]*?)---([\\s\\S]*)$`));
    if (!frontmatterMatch) return null;

    const [, frontmatterStr, body] = frontmatterMatch;
    const frontmatter: Record<string, string> = {};
    const lines = frontmatterStr.split(/\r?\n/);

    for (const line of lines) {
        const match = line.match(/^([^:]+):\s*(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^["']|["']$/g, '');
            frontmatter[key] = value;
        }
    }

    return { frontmatter, body: body.trim() };
}

