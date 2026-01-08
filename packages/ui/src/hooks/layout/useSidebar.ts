/**
 * useSidebar Hook
 * Manages sidebar open/close state
 */

import { useState, useEffect } from "react";

export function useSidebar() {
  // On desktop (>= 768px), sidebar should be open by default
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 768;
    }
    return false;
  });

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  // Handle window resize - keep sidebar open on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        // Check if click is outside sidebar and not on the menu button
        if (
          !target.closest(".sidebar") &&
          !target.closest(".menu-button") &&
          window.innerWidth < 768 // Only on mobile
        ) {
          close();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        close();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
