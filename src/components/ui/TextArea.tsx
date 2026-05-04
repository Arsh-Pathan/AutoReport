"use client";
import { type TextareaHTMLAttributes } from "react";
import clsx from "clsx";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string };

export function TextArea({ label, className, ...rest }: Props) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-ink mb-1">{label}</span>
      <textarea
        {...rest}
        className={clsx(
          "w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm leading-relaxed",
          "focus:outline-none focus:ring-2 focus:ring-ink/40 focus:border-ink",
          className
        )}
      />
    </label>
  );
}
