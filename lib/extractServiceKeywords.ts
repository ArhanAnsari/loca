import { keyword } from "@/lib/keywords";
import Fuse, { FuseResult } from 'fuse.js';

export function extractServiceKeywords(input: string): string | null {
  // Import keywords from @lib/keywords
  const lowercaseInput = input.toLowerCase();
  const words = lowercaseInput.split(/\s+/);

  for (const word of words) {
    if (keyword.includes(word)) {
      const nearIndex = words.indexOf("near");
      if (nearIndex !== -1 && nearIndex > words.indexOf(word)) {
        return words.slice(words.indexOf(word), nearIndex + 2).join(" ");
      }
      return `${word} near me`;
    }
  }

  return null;
}