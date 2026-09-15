/**
 * ============================================================================
 * FRONTEND REACT CORE
 * ============================================================================
 * 
 * WHY THIS FILE IS SPECIAL:
 * This is the root configuration of the React application.
 * It sets up the Routing (which URL goes to which page) and global Theme Contexts.
 */
import { clsx, type ClassValue } from "clsx";                                                  // Conditional class name concatenator
import { twMerge } from "tailwind-merge";                                                       // Tailwind CSS class merge resolver

// Merges dynamic conditional class names safely resolving conflicting styling rules
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));                                                                 // Combine clsx and twMerge
}
