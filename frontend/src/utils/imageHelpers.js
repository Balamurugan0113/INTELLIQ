// frontend/src/utils/imageHelpers.js

/**
 * Automatically converts Google Drive share links into direct image URLs.
 * Works with:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 * 
 * Target output:
 * https://lh3.googleusercontent.com/d/FILE_ID
 */
export function formatGoogleDriveUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();

  // If it's a Google Drive link, extract file ID
  if (trimmed.includes('drive.google.com')) {
    const match =
      trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
      trimmed.match(/id=([a-zA-Z0-9_-]+)/);

    if (match && match[1]) {
      const fileId = match[1];
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
  }

  return trimmed;
}

/**
 * Compresses an image file from local device to a lightweight base64 data URL.
 * Prevents hitting localStorage quota limits while preserving high-definition visual quality.
 */
export function compressImageFile(file, maxWidth = 1600, maxHeight = 1600, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('Selected file is not an image'));
    }

    // Keep SVG vectors intact
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = err => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onerror = err => reject(err);
    reader.onload = event => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio bounds
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to uncompressed if canvas context fails
          return resolve(event.target.result);
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to efficient JPEG or WEBP
        const outputFormat = file.type === 'image/png' ? 'image/webp' : 'image/jpeg';
        let compressedDataUrl = canvas.toDataURL(outputFormat, quality);

        // Fallback to JPEG if browser doesn't support webp export
        if (!compressedDataUrl.startsWith('data:image/webp') && outputFormat === 'image/webp') {
          compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(compressedDataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Format file size in human-readable bytes (KB, MB).
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Process a batch of files uploaded from local device/computer.
 */
export async function processLocalFiles(fileList) {
  const files = Array.from(fileList || []);
  const results = [];

  for (const file of files) {
    try {
      const dataUrl = await compressImageFile(file);
      results.push(dataUrl);
    } catch (err) {
      console.error('Failed to process image file:', file.name, err);
    }
  }

  return results;
}

/**
 * Process a batch of files uploaded from local device/computer, preserving file metadata.
 */
export async function processLocalFilesWithMetadata(fileList) {
  const files = Array.from(fileList || []);
  const results = [];

  for (const file of files) {
    try {
      const dataUrl = await compressImageFile(file);
      results.push({
        name: file.name,
        size: file.size,
        sizeFormatted: formatFileSize(file.size),
        type: file.type,
        dataUrl
      });
    } catch (err) {
      console.error('Failed to process image file:', file.name, err);
    }
  }

  return results;
}
