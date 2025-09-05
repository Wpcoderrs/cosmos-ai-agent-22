
// List of allowed file types
export const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'text/csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'text/html',
  'application/json',
  'text/plain'
];

// Map file extensions to types for validation
export const EXTENSION_MAP: Record<string, string> = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  csv: 'text/csv',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xls: 'application/vnd.ms-excel',
  html: 'text/html',
  json: 'application/json',
  txt: 'text/plain'
};

// Stone colors to cycle through for progress bars
export const STONE_COLORS = [
  'var(--tw-colors-thanos-stone-soul)',    // Purple
  'var(--tw-colors-thanos-stone-space)',   // Blue
  'var(--tw-colors-thanos-stone-power)',   // Red
  'var(--tw-colors-thanos-stone-reality)', // Orange
  'var(--tw-colors-thanos-stone-time)',    // Green
  'var(--tw-colors-thanos-stone-mind)'     // Yellow
];

// Validate file type
export const isValidFileType = (file: File): boolean => {
  // Check direct MIME type first
  if (ALLOWED_TYPES.includes(file.type)) return true;
  
  // If no type or not recognized, check extension
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  return extension in EXTENSION_MAP && ALLOWED_TYPES.includes(EXTENSION_MAP[extension]);
};

// Generate file icon based on type
export const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  if (['pdf'].includes(extension)) return 'file';
  if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return 'image';
  if (['csv', 'xlsx', 'xls'].includes(extension)) return 'fileSpreadsheet';
  if (['json'].includes(extension)) return 'fileJson';
  return 'fileText';
};
