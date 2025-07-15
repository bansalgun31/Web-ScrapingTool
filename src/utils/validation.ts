export const validateUrl = (url: string): { isValid: boolean; error?: string } => {
  if (!url.trim()) {
    return { isValid: false, error: 'URL cannot be empty' };
  }

  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { isValid: false, error: 'URL must use HTTP or HTTPS protocol' };
    }

    if (!urlObj.hostname) {
      return { isValid: false, error: 'URL must have a valid hostname' };
    }

    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: 'Invalid URL format' };
  }
};

export const normalizeUrl = (url: string): string => {
  try {
    const normalized = url.startsWith('http') ? url : `https://${url}`;
    return new URL(normalized).toString();
  } catch {
    return url;
  }
};

export const parseUrlList = (input: string): string[] => {
  return input
    .split(/[\n,;]/)
    .map(url => url.trim())
    .filter(url => url.length > 0)
    .map(normalizeUrl);
};