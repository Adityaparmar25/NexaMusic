
// ═══════════════════════════════════════════
//  lib/drive.ts  — Google Drive URL helpers
// ═══════════════════════════════════════════

/** Build a streaming URL from a Drive file ID */
export const driveStreamUrl = (fileId: string) =>
  `https://drive.google.com/uc?export=download&id=${fileId}`;

/** Build a thumbnail URL from a Drive file ID */
export const driveThumbnailUrl = (fileId: string, size = 400) =>
  `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;

/** Extract file ID from a standard Google Drive shareable URL */
export function extractDriveFileId(url: string): string | null {
  // https://drive.google.com/file/d/FILE_ID/view
  const fileMatch = url.match(/\/file\/d\/([^/]+)/);
  if (fileMatch) return fileMatch[1];
  // https://drive.google.com/open?id=FILE_ID
  const idMatch = url.match(/[?&]id=([^&]+)/);
  if (idMatch) return idMatch[1];
  // Raw ID (no URL prefix)
  if (/^[a-zA-Z0-9_-]{25,}$/.test(url)) return url;
  return null;
}