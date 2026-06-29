import fs from "fs/promises";
import path from "path";

// --- CONFIG ---
const STAGING_ROOT = "scripts/staging";
const MEDIA_TARGET_ROOT = "public/media";
const OLD_MANIFEST_PATH = "src/data/media-manifest.json"; // For Photo Gallery page
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
    л: "l", // Исправлено: было "л"
    м: "m",
    н: "n", // Исправлено: было "н"
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
  const frontmatterStr = parts[0]?.trim() || "";
  const body = parts.length > 1 ? parts.slice(1).join("---").trim() : "";
  const frontmatter = {};

  if (frontmatterStr) {
    frontmatterStr.split(/\r?\n/).forEach((line) => {
      const match = line.match(/^([^:]+):\s*(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, "");
        frontmatter[key] = value;
      }
    });
  }

  return { frontmatter, body };
}

async function generatePublicManifest() {
  console.log("🔄 Обновление публичного манифеста...");
  const mediaRoot = "public/media";
  const manifestPath = path.join(mediaRoot, "manifest.json");

  async function findMdFiles(dir) {
    let files = [];
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          files = files.concat(await findMdFiles(fullPath));
        } else if (entry.isFile() && entry.name.endsWith(".md")) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.error(`Ошибка при сканировании директории ${dir}:`, error);
    }
    return files;
  }

  try {
    const allMdPaths = await findMdFiles(mediaRoot);
    const relativePaths = allMdPaths.map(
      (p) => "/" + path.relative("public", p).replace(/\\/g, "/"),
    );

    await fs.writeFile(
      manifestPath,
      JSON.stringify(relativePaths, null, 2),
      "utf-8",
    );
    console.log("✅ Публичный манифест для новостей/афиши обновлен.");
  } catch (error) {
    console.error("Ошибка при генерации публичного манифеста:", error);
    throw error;
  }
}

async function addContent() {
  console.log("🚀 Запуск процесса добавления контента...");
  let oldManifest = [];
  try {
    oldManifest = JSON.parse(await fs.readFile(OLD_MANIFEST_PATH, "utf-8"));
  } catch (_error) {
    console.warn(
      `Не удалось прочитать старый медиа-манифест по пути ${OLD_MANIFEST_PATH}. Будет создан новый.`,
    );
  }

  try {
    const stagingDirs = await fs.readdir(STAGING_ROOT, { withFileTypes: true });

    for (const dirEntry of stagingDirs) {
      if (!dirEntry.isDirectory()) continue;

      const stagingItemPath = path.join(STAGING_ROOT, dirEntry.name);
      console.log(`Обработка папки: ${dirEntry.name}`);

      try {
        const itemFiles = await fs.readdir(stagingItemPath);
        const contentFileName = itemFiles.find(
          (fileName) =>
            fileName.endsWith(".txt") &&
            ["news", "afisha", "diplom"].includes(
              path.basename(fileName, ".txt"),
            ),
        );

        if (!contentFileName) {
          console.warn(
            `  - В папке ${dirEntry.name} не найден файл контента (news.txt, afisha.txt, diplom.txt). Пропуск.`,
          );
          await fs.rm(stagingItemPath, { recursive: true, force: true });
          continue;
        }

        const contentType = path.basename(contentFileName, ".txt");
        const contentFilePath = path.join(stagingItemPath, contentFileName);
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

        if (oldManifest.some((album) => album.albumId === albumId)) {
          console.warn(
            `  - Альбом с ID "${albumId}" уже существует в старом манифесте. Пропуск.`,
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
            if (fileName === coverFileName) coverImageId = photoId;
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
        oldManifest.push(newAlbum);
        console.log(
          `  - Альбом "${title}" добавлен в старый медиа-манифест (для фотогалереи).`,
        );

        // --- NEW MARKDOWN LOGIC ---
        const mdFileName = `${date}-${albumSlug}.md`;
        const mdFilePath = path.join(newAlbumPath, mdFileName);

        const galleryIds = photoObjects
          .filter((p) => p.id !== coverImageId)
          .map((p) => `- ${p.id}`)
          .join("\n");
        const galleryBlock = galleryIds
          ? `

<!-- gallery -->
${galleryIds}`
          : "";

        // Use JSON array format for category
        let mdContent = `---
title: "${title}"
date: ${date}
category: ["${contentType}"]`;

        if (contentType === "afisha") {
          if (time) {
            mdContent += `
time: "${time}"`;
          }
          if (venue) {
            mdContent += `
venue: "${venue}"`;
          }
          if (tags.length > 0) {
            mdContent += `
tags: [${tags.map((t) => `'${t}'`).join(", ")}]`;
          }
        }

        if (coverImageId) {
          mdContent += `
coverImageId: ${coverImageId}`;
        }

        mdContent += `
---

${body}${galleryBlock}
`;

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

    await fs.writeFile(
      OLD_MANIFEST_PATH,
      JSON.stringify(oldManifest, null, 2),
      "utf-8",
    );
    console.log("✅ Старый медиа-манифест (для фотогалереи) обновлен.");

    await generatePublicManifest();

    console.log("🎉 Процесс добавления контента завершен!");
  } catch (error) {
    console.error("Критическая ошибка при добавлении контента:", error);
    throw error;
  }
}

addContent().catch(console.error);
