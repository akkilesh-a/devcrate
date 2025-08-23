"use client";

import { useEffect, useRef } from "react";
import { ChevronRightIcon, Search } from "lucide-react";
import { Button, Input, KbdKey, Kbd } from "@/components/ui";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  disabled = false,
  placeholder = "Search tools or tags...",
  className = "",
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+K (Windows/Linux) or Cmd+K (Mac)
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    // Add event listener to document
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleClearSearch = () => {
    onSearchChange("");
    inputRef.current?.focus();
  };

  return (
    <div className={`relative max-w-2xl mx-auto ${className}`}>
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
      <Input
        ref={inputRef}
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="px-8 py-5 text-2xl pr-24"
        disabled={disabled}
      />

      {/* Clear button when there's search text */}
      {searchQuery && !disabled && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-20 top-1/2 transform -translate-y-1/2 h-auto p-1 text-muted-foreground hover:text-foreground"
          onClick={handleClearSearch}
        >
          ✕
        </Button>
      )}

      {/* Keyboard shortcut indicator */}
      <Kbd
        className="absolute right-4 top-1/2 transform -translate-y-1/2"
        separator={
          <span className="text-muted-foreground/50">
            <ChevronRightIcon size={12} />
          </span>
        }
      >
        <KbdKey aria-label="Meta">⌘</KbdKey>
        <KbdKey>K</KbdKey>
      </Kbd>
    </div>
  );
}
