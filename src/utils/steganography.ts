// Zero-width character steganography
const ZWSP = '​';   // Zero-Width Space — binary 0
const ZWNJ = '‌';   // Zero-Width Non-Joiner — binary 1
const ZWJ = '‍';    // Zero-Width Joiner — word separator
const BOM = '﻿';    // Byte Order Mark — message start marker

function textToBinary(text: string): string {
  return text.split('').map(ch => {
    const codePoint = ch.codePointAt(0) ?? 0;
    return codePoint.toString(2).padStart(16, '0');
  }).join('');
}

function binaryToText(binary: string): string {
  const chars: string[] = [];
  for (let i = 0; i + 16 <= binary.length; i += 16) {
    const codePoint = parseInt(binary.slice(i, i + 16), 2);
    chars.push(String.fromCodePoint(codePoint));
  }
  return chars.join('');
}

function binaryToZeroWidth(binary: string): string {
  return binary.split('').map(bit => bit === '0' ? ZWSP : ZWNJ).join('');
}

export function encodeMessage(poem: string, secret: string): string {
  if (!secret) return poem;

  const binary = textToBinary(secret);
  const encoded = binaryToZeroWidth(binary);

  // Insert encoded message after the first line
  const lines = poem.split('\n');
  if (lines.length === 0) return BOM + encoded;

  // Place BOM + encoded data after the title or first line
  const insertIndex = lines[0].length > 0 ? 0 : 1;
  if (insertIndex < lines.length) {
    lines[insertIndex] = lines[insertIndex] + BOM + encoded;
  } else {
    lines.push(BOM + encoded);
  }

  return lines.join('\n');
}

export function decodeMessage(encodedPoem: string): string {
  const bomIndex = encodedPoem.indexOf(BOM);
  if (bomIndex === -1) return '';

  // Extract everything after BOM that is a zero-width character
  let binary = '';
  for (let i = bomIndex + 1; i < encodedPoem.length; i++) {
    const ch = encodedPoem[i];
    if (ch === ZWSP || ch === ZWNJ) {
      binary += ch === ZWSP ? '0' : '1';
    } else if (ch === ZWJ) {
      // Word separator — skip for binary decoding
      continue;
    } else {
      // Non-zero-width character — stop decoding
      break;
    }
  }

  if (binary.length === 0) return '';
  return binaryToText(binary);
}

export function encodeInComments(code: string, secret: string): string {
  if (!secret) return code;

  const words = secret.split(/\s+/);
  const lines = code.split('\n');
  const result: string[] = [];

  let wordIndex = 0;
  for (let i = 0; i < lines.length; i++) {
    result.push(lines[i]);

    // Insert a comment with the next word's first letter encoded
    if (wordIndex < words.length && i % 2 === 0) {
      const word = words[wordIndex];
      // Use first-letter steganography in comment
      const commentText = `// ${word[0]}${' '.repeat(Math.max(1, word.length))}`;
      result.push(commentText);
      wordIndex++;
    }
  }

  // If there are leftover words, append them as a block comment
  if (wordIndex < words.length) {
    result.push('');
    result.push('/*');
    while (wordIndex < words.length) {
      result.push(` * ${words[wordIndex]}`);
      wordIndex++;
    }
    result.push(' */');
  }

  return result.join('\n');
}

export function getStegStats(original: string, encoded: string): {
  capacity: number;
  used: number;
  visibleDiff: boolean;
} {
  // Count zero-width characters in encoded
  let zwCount = 0;
  for (const ch of encoded) {
    if (ch === ZWSP || ch === ZWNJ || ch === ZWJ || ch === BOM) {
      zwCount++;
    }
  }

  // Each character stores 1 bit, BOM takes 1 char
  const usedBytes = zwCount > 0 ? Math.floor((zwCount - 1) / 16) : 0;

  // Estimate capacity based on original length
  // Each visible character can carry a zero-width char
  const visibleChars = original.replace(/\s/g, '').length;
  const capacityBytes = Math.floor(visibleChars / 16);

  return {
    capacity: capacityBytes,
    used: usedBytes,
    visibleDiff: original.length !== encoded.length - zwCount,
  };
}
