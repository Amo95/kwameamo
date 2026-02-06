"use client";

import { useState, useTransition } from "react";
import { addNote } from "@/app/guestbook/actions";

const PASTEL_COLORS = [
  { name: "yellow", class: "bg-yellow-200" },
  { name: "pink", class: "bg-pink-200" },
  { name: "blue", class: "bg-blue-200" },
  { name: "green", class: "bg-green-200" },
  { name: "purple", class: "bg-purple-200" },
];

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddNoteModal({ isOpen, onClose }: AddNoteModalProps) {
  const [selectedColor, setSelectedColor] = useState(
    PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)].name
  );
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.set("colour", selectedColor);

    startTransition(async () => {
      const result = await addNote(formData);

      if (result?.error) {
        setError(result.error);
      } else {
        onClose();
        (e.target as HTMLFormElement).reset();
      }
    });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-border bg-background p-5 shadow-xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">
            Add a Sticky Note
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted transition-colors hover:bg-border hover:text-foreground"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name input */}
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-[13px] font-medium text-foreground"
            >
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              maxLength={30}
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-[14px] text-foreground placeholder-muted focus:border-foreground focus:outline-none min-h-[44px]"
              placeholder="John Doe"
            />
          </div>

          {/* Message input */}
          <div>
            <label
              htmlFor="message"
              className="mb-1 block text-[13px] font-medium text-foreground"
            >
              Message (max 100 chars)
            </label>
            <textarea
              id="message"
              name="message"
              required
              maxLength={100}
              rows={3}
              className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-[14px] text-foreground placeholder-muted focus:border-foreground focus:outline-none"
              placeholder="Leave a note..."
            />
          </div>

          {/* Color picker */}
          <div>
            <label className="mb-2 block text-[13px] font-medium text-foreground">
              Note Color
            </label>
            <div className="flex gap-2">
              {PASTEL_COLORS.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color.name)}
                  className={`h-10 w-10 rounded-md border-2 transition-all ${color.class} ${
                    selectedColor === color.name
                      ? "border-foreground scale-110"
                      : "border-border hover:scale-105"
                  }`}
                  aria-label={`Select ${color.name}`}
                />
              ))}
            </div>
          </div>

          {error && (
            <p className="text-[13px] text-red-500 dark:text-red-400">
              {error}
            </p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isPending}
            className="mt-2 rounded-md bg-gray-900 px-4 py-3 text-[14px] font-medium text-white transition-all duration-200 hover:bg-gray-700 disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
          >
            {isPending ? "Adding..." : "Add Note"}
          </button>
        </form>
      </div>
    </div>
  );
}
