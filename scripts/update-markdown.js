import fs from 'fs/promises';
import path from 'path';

// --- CONFIG ---
const MANIFEST_PATH = 'src/data/media-manifest.json';
const NEWS_MD_ROOT = 'src/news';
// --- END CONFIG ---

function createSlug(text) {
  const a = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 
    'и': 'i', 'й': 'y', 'к': 'k', 'л': 'л', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 
    'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 
    'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
  };
  return text.toLowerCase().split('').map(char => a[char] || char).join('').replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

async function parseMarkdownContent(content) {
  const frontmatterMatch = content.match(/^---([\s\S]*?)---/);
  if (!frontmatterMatch) return null;

  const frontmatterRaw = frontmatterMatch[1];
  const frontmatter = {};
  frontmatterRaw.split('\\n').forEach(line => {
    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (match) {
      frontmatter[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
    }
  });

  const body = content.substring(frontmatterMatch[0].length).trim();
  return { frontmatter, body };
}


async function updateMarkdownFiles() {
  console.log('🚀 Starting markdown update...');

  const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, 'utf-8'));
  console.log("Manifest loaded, total albums:", manifest.length);
  console.log("Manifest content (first album):", manifest[0]);
  console.log("Manifest content (last album):", manifest[manifest.length-1]);

  for (const album of manifest) {
  for (const album of manifest) {
    const { albumTitle, albumDate, albumCategory, photos, albumId } = album;
    console.log(`Current Album ID from manifest: "${albumId}"`); // Debugging line

    const year = new Date(albumDate).getFullYear();
    const dateSlug = albumDate; // YYYY-MM-DD
    const titleSlug = createSlug(albumTitle); // Re-create slug from title

    // This part tries to reconstruct the original MD file name
    // It's not perfect but should work for most of our migrated files
    let mdFileNamePartial = `${dateSlug}-${titleSlug}`;
    let mdFilePath = path.join(NEWS_MD_ROOT, String(year), `${mdFileNamePartial}.md`);

    // Handle cases where original MD filename might be slightly different from new slug
    let originalMdContent;
    try {
        originalMdContent = await fs.readFile(mdFilePath, 'utf-8');
    } catch (e) {
        // If exact match fails, try a fuzzy match by date and year
        const yearPath = path.join(NEWS_MD_ROOT, String(year));
        const filesInYear = await fs.readdir(yearPath);
        const possibleMdFile = filesInYear.find(f => f.startsWith(dateSlug) && f.endsWith('.md'));
        if (possibleMdFile) {
            mdFilePath = path.join(yearPath, possibleMdFile);
            originalMdContent = await fs.readFile(mdFilePath, 'utf-8');
            console.log(`💡 Found MD file by date for album "${albumTitle}": ${possibleMdFile}`);
        } else {
            console.warn(`Could not find MD file for album "${albumTitle}" at ${mdFilePath}. Skipping.`);
            continue;
        }
    }
    
    // console.log(`\n--- Debugging Album: ${albumTitle} (${albumId}) ---`); // Removed
    // console.log(`MD File Path: ${mdFilePath}`); // Removed
    // console.log(`Original MD Content (first 200 chars):\n${originalMdContent.substring(0,200)}...\n`); // Removed

    const parsedMd = await parseMarkdownContent(originalMdContent);
    if (!parsedMd) {
        console.warn(`Could not parse frontmatter for MD file: ${mdFilePath}. Skipping.`);
        continue;
    }

    const coverPhoto = photos.find(p => p.src.includes('cover.jpg'));
    const coverImageId = coverPhoto ? coverPhoto.id : undefined;
    const galleryPhotoIds = photos.filter(p => !p.src.includes('cover.jpg')).map(p => p.id);
    const galleryString = galleryPhotoIds.map(id => `- ${id}`).join('\\n');

    let updatedMdContent = originalMdContent;

    // console.log(`Cover Image ID to use: ${coverImageId}`); // Removed
    // Update coverImageId
    if (coverImageId) {
        // Replace old 'cover:' line or add 'coverImageId:' if not present
        updatedMdContent = updatedMdContent.replace(
            /^(cover(?:ImageId)?:\s*.*)$/m,
            `coverImageId: ${coverImageId}`
        );
    } else {
        // If no cover, remove coverImageId or cover line
        updatedMdContent = updatedMdContent.replace(/^(\s*cover(?:ImageId)?:\s*.*)\s*$/m, '');
    }
    // console.log(`Content after coverImageId replacement (first 200 chars):\n${updatedMdContent.substring(0,200)}...\n`); // Removed


    // console.log(`Gallery Photo IDs to use: ${galleryPhotoIds}`); // Removed
    // console.log(`Gallery String: \n${galleryString}\n`); // Removed
    // Update gallery block
    const galleryBlockRegex = /<!--\\s*gallery\\s*-->[\\s\\S]*?(?=(?:^---|\\n\\n\\n|$))/m; // Match gallery block until next frontmatter or triple newline or end of file

    if (galleryPhotoIds.length > 0) {
        if (updatedMdContent.match(galleryBlockRegex)) {
            // Replace existing gallery block
            updatedMdContent = updatedMdContent.replace(
                galleryBlockRegex,
                `<!-- gallery -->\\n${galleryString}`
            );
        } else {
            // Add new gallery block at the end of the content body, before the closing --- if any
            const lastFrontmatterEnd = updatedMdContent.indexOf('---', 3) + 3;
            if (lastFrontmatterEnd > 3) { // Ensure frontmatter exists
                let bodyContent = updatedMdContent.substring(lastFrontmatterEnd).trim();
                bodyContent = bodyContent.replace(galleryBlockRegex, '').trim(); // Remove any old gallery block
                updatedMdContent = updatedMdContent.substring(0, lastFrontmatterEnd) + `\\n\\n${bodyContent}\\n\\n<!-- gallery -->\\n${galleryString}`;
            } else {
                updatedMdContent += `\\n\\n<!-- gallery -->\\n${galleryString}`;
            }
        }
    } else {
        // Remove gallery block if no photos in album
        updatedMdContent = updatedMdContent.replace(galleryBlockRegex, '');
    }
    // console.log(`Content after gallery replacement (first 200 chars):\n${updatedMdContent.substring(0,200)}...\n`); // Removed
    
    await fs.writeFile(mdFilePath, updatedMdContent, 'utf-8');
    const finalMdFileName = path.basename(mdFilePath);
    console.log(`✅ Updated ${finalMdFileName}`);
  }
  }




  console.log('🎉 Markdown update complete!');
}

updateMarkdownFiles().catch(console.error);
