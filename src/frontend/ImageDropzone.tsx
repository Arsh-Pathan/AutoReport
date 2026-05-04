"use client";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";

export type LocalPhoto = {
  id: string;
  file: File;
  dataUrl: string;
  caption: string;
};

type Props = {
  photos: LocalPhoto[];
  onAdd: (photos: LocalPhoto[]) => void;
  onRemove: (id: string) => void;
  onCaption: (id: string, caption: string) => void;
};

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = () => reject(fr.error);
    fr.readAsDataURL(file);
  });
}

export function ImageDropzone({ photos, onAdd, onRemove, onCaption }: Props) {
  const onDrop = useCallback(
    async (accepted: File[]) => {
      const next = await Promise.all(
        accepted.map(async (file) => ({
          id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
          file,
          dataUrl: await readAsDataUrl(file),
          caption: "",
        }))
      );
      onAdd(next);
    },
    [onAdd]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    multiple: true,
  });

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={clsx(
          "rounded border-2 border-dashed px-4 py-8 text-center cursor-pointer transition",
          isDragActive
            ? "border-ink bg-gray-100"
            : "border-gray-300 bg-white hover:bg-gray-50"
        )}
      >
        <input {...getInputProps()} />
        <p className="text-sm text-gray-700">
          {isDragActive
            ? "Drop the images here…"
            : "Drag & drop event photos, or click to browse"}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          PNG / JPG / WEBP. Multiple files allowed.
        </p>
      </div>

      {photos.length > 0 && (
        <ul className="grid grid-cols-2 gap-3">
          {photos.map((p) => (
            <li
              key={p.id}
              className="rounded border border-gray-300 bg-white p-2 space-y-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.dataUrl}
                alt={p.caption || "Uploaded photograph"}
                className="w-full h-32 object-cover rounded"
              />
              <input
                type="text"
                placeholder="Caption (e.g. Mr. Sharma during the keynote)"
                value={p.caption}
                onChange={(e) => onCaption(p.id, e.target.value)}
                className="w-full rounded border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-ink/40"
              />
              <button
                type="button"
                onClick={() => onRemove(p.id)}
                className="text-xs text-red-600 hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
