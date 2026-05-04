import "server-only";
import imageSize from "image-size";

export type ProcessedImage = {
  buffer: Buffer;
  mime: string;
  dataUrl: string;
  width: number;
  height: number;
};

const DEFAULT_MIME = "image/jpeg";

export async function processImage(file: File): Promise<ProcessedImage> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const mime = file.type || DEFAULT_MIME;
  let width = 480;
  let height = 320;
  try {
    const size = imageSize(buffer);
    if (size.width && size.height) {
      width = size.width;
      height = size.height;
    }
  } catch {
    // fall back to defaults
  }
  const dataUrl = `data:${mime};base64,${buffer.toString("base64")}`;
  return { buffer, mime, dataUrl, width, height };
}

export function scaleToMaxWidth(
  width: number,
  height: number,
  maxWidth: number
): { width: number; height: number } {
  if (width <= maxWidth) return { width, height };
  const ratio = maxWidth / width;
  return { width: maxWidth, height: Math.round(height * ratio) };
}
