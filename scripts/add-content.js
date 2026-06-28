import fs from "fs/promises";
import path from "path";

// --- CONFIG ---
const STAGING_ROOT = "scripts/staging";
const MEDIA_TARGET_ROOT = "public/media";
const MANIFEST_PATH = "src/data/media-manifest.json";
const NEWS_MD_ROOT = "src/news";
const AFISHA_MD_ROOT = "src/afisha";
const DIPLOM_MD_ROOT = "src/diploms";
// --- END CONFIG ---

function createSlug(text) {
  const a = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "yo",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "н",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "kh",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "shch",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
  };
  return text
    .toLowerCase()
    .split("")
    .map((char) => a[char] || char)
    .join("")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function parseContentFile(filePath) {
  const content = await fs.readFile(filePath, "utf-8");
  const parts = content.split("---");
  const frontmatterStr = parts[0].trim();
  const body = parts.length > 1 ? parts.slice(1).join("---").trim() : "";
  const frontmatter = {};
  frontmatterStr.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, "");
      frontmatter[key] = value;
    }
  });
  return { frontmatter, body };
}

async function addContent() {
  console.log("🚀 Запуск процесса добавления контента...");
  let manifest = [];
  try {
    manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, "utf-8"));
  } catch (error) {
    console.warn(
      `Не удалось прочитать медиа-манифест по пути ${MANIFEST_PATH}. Будет создан новый.`,
    );
  }
  const stagingDirs = await fs.readdir(STAGING_ROOT, { withFileTypes: true });
  for (const dirEntry of stagingDirs) {
    if (!dirEntry.isDirectory()) continue;
    const stagingItemPath = path.join(STAGING_ROOT, dirEntry.name);
    console.log(`\nОбработка папки: ${dirEntry.name}`);
    try {
      const itemFiles = await fs.readdir(stagingItemPath);
      let contentFilePath = null;
      let contentType = null;
      for (const fileName of itemFiles) {
        if (fileName.endsWith(".txt")) {
          const baseName = path.basename(fileName, ".txt");
          if (["news", "afisha", "diplom"].includes(baseName)) {
            contentFilePath = path.join(stagingItemPath, fileName);
            contentType = baseName;
            break;
          }
        }
      }
      if (!contentFilePath || !contentType) {
        console.warn(
          `  - В папке ${dirEntry.name} не найден файл контента (news.txt, afisha.txt, diplom.txt). Пропуск.`,
        );
        await fs.rm(stagingItemPath, { recursive: true, force: true });
        continue;
      }
      const { frontmatter, body } = await parseContentFile(contentFilePath);
      const title = frontmatter.Title || dirEntry.name;
      const date = frontmatter.Date || new Date().toISOString().slice(0, 10);
      const category = frontmatter.Category || "без категории";
      const time = frontmatter.Time;
      const venue = frontmatter.Venue;
      const tags = frontmatter.Tags
        ? frontmatter.Tags.split(",").map((t) => t.trim())
        : [];
      const albumSlug = createSlug(frontmatter.Slug || title);
      const year = new Date(date).getFullYear().toString();
      const albumId = `${albumSlug}-${year}`;
      if (manifest.some((album) => album.albumId === albumId)) {
        console.warn(
          `  - Альбом с ID "${albumId}" уже существует в манифесте. Пропуск.`,
        );
        await fs.rm(stagingItemPath, { recursive: true, force: true });
        continue;
      }
      const newAlbumPath = path.join(
        MEDIA_TARGET_ROOT,
        year,
        `${date}-${albumSlug}`,
      );
      await fs.mkdir(newAlbumPath, { recursive: true });
      console.log(`  - Создана папка медиа: ${newAlbumPath}`);
      const photoObjects = [];
      let imageCounter = 1;
      const coverFileName = itemFiles.find((f) =>
        f.toLowerCase().startsWith("cover."),
      );
      let coverImageId = null;
      for (const fileName of itemFiles) {
        if (fileName.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
          const oldImageFullPath = path.join(stagingItemPath, fileName);
          const newImageFullPath = path.join(newAlbumPath, fileName);
          await fs.rename(oldImageFullPath, newImageFullPath);
          const photoId = `${albumSlug.replace(/-/g, "_")}_${year}_${String(imageCounter).padStart(2, "0")}`;
          const relativeSrc = `/${path.relative("public", newImageFullPath).replace(/\\/g, "/")}`;
          photoObjects.push({ id: photoId, src: relativeSrc, title: title });
          if (fileName === coverFileName) {
            coverImageId = photoId;
          }
          imageCounter++;
        }
      }
      if (!coverImageId && photoObjects.length > 0) {
        coverImageId = photoObjects[0].id;
      }
      const newAlbum = {
        albumId,
        albumTitle: title,
        albumDate: date,
        albumCategory: category,
        photos: photoObjects,
      };
      manifest.push(newAlbum);
      console.log(`  - Альбом "${title}" добавлен в медиа-манифест.`);
      let mdTargetRoot;
      switch (contentType) {
        case "news":
          mdTargetRoot = NEWS_MD_ROOT;
          break;
        case "afisha":
          mdTargetRoot = AFISHA_MD_ROOT;
          break;
        case "diplom":
          await fs.mkdir(DIPLOM_MD_ROOT, { recursive: true });
          mdTargetRoot = DIPLOM_MD_ROOT;
          break;
        default:
          throw new Error(`Неизвестный тип контента: ${contentType}`);
      }
      const mdDir = path.join(mdTargetRoot, year);
      await fs.mkdir(mdDir, { recursive: true });
      const mdFileName = `${date}-${albumSlug}.md`;
      const mdFilePath = path.join(mdDir, mdFileName);
      const galleryIds = photoObjects
        .filter((p) => p.id !== coverImageId)
        .map((p) => `- ${p.id}`)
        .join("\n");
      const galleryBlock = galleryIds
        ? `\n\n<!-- gallery -->\n${galleryIds}`
        : "";
      let mdContent = `---\ntitle: "${title}"\ndate: ${date}\ncategory: ${category}`;
      if (contentType === "afisha") {
        if (time) mdContent += `\ntime: "${time}"`;
        if (venue) mdContent += `\nvenue: "${venue}"`;
        if (tags.length > 0)
          mdContent += `\ntags: [${tags.map((t) => `'${t}'`).join(", ")}]`;
      }
      if (coverImageId) {
        mdContent += `\ncoverImageId: ${coverImageId}`;
      }
      mdContent += `\n---\n\n${body}${galleryBlock}\n`;
      await fs.writeFile(mdFilePath, mdContent, "utf-8");
      console.log(`  - Создан Markdown-файл: ${mdFilePath}`);
      await fs.rm(stagingItemPath, { recursive: true, force: true });
      console.log(
        `  - Исходная папка '${dirEntry.name}' удалена из стейджинга.`,
      );
    } catch (error) {
      console.error(`  - Ошибка при обработке ${dirEntry.name}:`, error);
    }
  }
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf-8");
  console.log("\n✅ Медиа-манифест обновлен.");
  console.log("🎉 Процесс добавления контента завершен!");
}

addContent().catch(console.error);
