"use client";

/**
 * ui-lite.tsx
 * Minimal, dependency-free replacements for the shadcn/Radix primitives
 * used across the app. Plain Tailwind only — no portals, no focus traps,
 * no Radix internals. Safe for older Electron/Chromium (v22-era) webviews.
 *
 * Put this file at e.g. app/components/ui-lite.tsx and import from there.
 */

import {
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { Check, ChevronsUpDown, X as XIcon } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border bg-white shadow-sm ${className}`}>{children}</div>;
}

export function CardHeader({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`p-6 pb-0 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
}

export function CardContent({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

/* ------------------------------------------------------------------ */
/* Button                                                              */
/* ------------------------------------------------------------------ */

type ButtonVariant = "default" | "outline" | "destructive" | "ghost";
type ButtonSize = "default" | "icon";

const buttonVariantClasses: Record<ButtonVariant, string> = {
  default: "bg-[#1447e6] text-white hover:bg-[#1139c2]",
  outline: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50",
  destructive: "bg-red-600 text-white hover:bg-red-700",
  ghost: "bg-transparent text-gray-900 hover:bg-gray-100",
};

const buttonSizeClasses: Record<ButtonSize, string> = {
  default: "h-10 px-4 text-sm",
  icon: "h-10 w-10 p-0",
};

export function Button({
  children,
  className = "",
  variant = "default",
  size = "default",
  disabled,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none ${buttonVariantClasses[variant]} ${buttonSizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Input / Label / Textarea                                           */
/* ------------------------------------------------------------------ */

export function Input({ className = "", disabled, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      disabled={disabled}
      className={`h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-[#1447e6] disabled:bg-gray-100 disabled:text-gray-500 ${className}`}
      {...props}
    />
  );
}

export function Label({ children, className = "", ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={`text-sm font-medium text-gray-700 ${className}`} {...props}>
      {children}
    </label>
  );
}

export function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`min-h-24 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#1447e6] ${className}`}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Badge                                                               */
/* ------------------------------------------------------------------ */

export function Badge({
  children,
  className = "",
  variant = "default",
}: {
  children: ReactNode;
  className?: string;
  variant?: "default" | "outline";
}) {
  const base =
    variant === "outline"
      ? "border border-gray-300 text-gray-700"
      : "bg-[#dbeafe] text-[#1447e6]";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${base} ${className}`}>
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Checkbox                                                            */
/* ------------------------------------------------------------------ */

export function Checkbox({
  checked,
  onCheckedChange,
  className = "",
}: {
  checked: boolean;
  onCheckedChange: () => void;
  className?: string;
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onCheckedChange}
      className={`h-4 w-4 rounded border-gray-300 accent-[#1447e6] ${className}`}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Select (native, styled to look consistent)                         */
/* ------------------------------------------------------------------ */

export function NativeSelect({
  value,
  onChange,
  children,
  className = "",
}: {
  value: string | number;
  onChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-[#1447e6] ${className}`}
    >
      {children}
    </select>
  );
}

/* ------------------------------------------------------------------ */
/* Modal (replaces Dialog — plain conditional render, no portal)      */
/* ------------------------------------------------------------------ */

export function Modal({
  open,
  onOpenChange,
  title,
  children,
  className = "",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
    >
      <div className={`max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-lg ${className}`}>
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button onClick={() => onOpenChange(false)} className="text-gray-400 hover:text-gray-700">
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Combobox (replaces Popover + Command — plain input + filtered list) */
/* ------------------------------------------------------------------ */

export type ComboboxOption<T = number> = {
  value: T;
  label: string;
  disabled?: boolean;
};

export function Combobox<T extends string | number>({
  value,
  options,
  onSelect,
  placeholder = "ابحث...",
  emptyText = "لا يوجد نتائج",
}: {
  value: T | null;
  options: ComboboxOption<T>[];
  onSelect: (value: T) => void;
  placeholder?: string;
  emptyText?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase().trim()),
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="outline"
        className="w-full justify-between"
        onClick={() => setOpen((v) => !v)}
      >
        {selected ? selected.label : placeholder}
        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {open && (
        <div className="absolute z-40 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="border-b p-2">
            <Input
              autoFocus
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="max-h-60 overflow-y-auto p-1">
            {filtered.length === 0 && (
              <p className="p-3 text-center text-sm text-gray-400">{emptyText}</p>
            )}

            {filtered.map((option) => (
              <button
                key={String(option.value)}
                type="button"
                disabled={option.disabled}
                onClick={() => {
                  if (option.disabled) return;
                  onSelect(option.value);
                  setOpen(false);
                  setQuery("");
                }}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-right hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {option.label}
                <Check className={`h-4 w-4 ${option.value === value ? "opacity-100" : "opacity-0"}`} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
