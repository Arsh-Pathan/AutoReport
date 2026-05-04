"use client";
import { type ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

const styles: Record<Variant, string> = {
  primary:
    "bg-ink text-white hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed",
  secondary:
    "bg-white border border-ink text-ink hover:bg-gray-100 disabled:opacity-60",
  ghost: "text-ink hover:bg-gray-100",
};

export function Button({ variant = "primary", className, ...rest }: Props) {
  return (
    <button
      {...rest}
      className={clsx(
        "inline-flex items-center justify-center rounded px-4 py-2 text-sm font-medium transition",
        styles[variant],
        className
      )}
    />
  );
}
