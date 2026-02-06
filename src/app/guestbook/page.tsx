"use client";

import { useEffect, useState } from "react";
import type { Metadata } from "next";
import StickyNote from "@/components/StickyNote";
import AddNoteModal from "@/components/AddNoteModal";
import { getNotes } from "./actions";
import type { GuestbookNote } from "@/lib/supabase";

// Generate random rotation for each note
const getRandomRotation = () => Math.random() * 6 - 3; // -3 to +3 degrees

export default function GuestbookPage() {
  const [notes, setNotes] = useState<GuestbookNote[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    setIsLoading(true);
    const data = await getNotes();
    setNotes(data);
    setIsLoading(false);
  };

  // Refresh notes when modal closes (after adding a new note)
  const handleModalClose = () => {
    setIsModalOpen(false);
    loadNotes();
  };

  return (
    <section className="flex flex-col gap-6 sm:gap-8 animate-fade-in-up">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          The Wall
        </h1>
        <p className="mt-2 text-[14px] text-muted sm:text-[15px]">
          Leave a note, say hi{" "}
          <span role="img" aria-label="wave">
            👋
          </span>
        </p>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center py-8 sm:py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-foreground" />
        </div>
      )}

      {/* Notes grid */}
      {!isLoading && (
        <>
          {notes.length === 0 ? (
            <div className="py-8 sm:py-12 text-center">
              <p className="text-[14px] text-muted sm:text-[15px]">
                No notes yet. Be the first to leave one!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {notes.map((note) => (
                <StickyNote
                  key={note.id}
                  note={note}
                  rotation={getRandomRotation()}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Floating Add Note Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl dark:bg-gray-100 dark:text-gray-900 sm:h-16 sm:w-16"
        aria-label="Add note"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {/* Add Note Modal */}
      <AddNoteModal isOpen={isModalOpen} onClose={handleModalClose} />
    </section>
  );
}
