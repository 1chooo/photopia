/**
 * Generate a shimmer placeholder for image loading
 * This creates a base64 encoded SVG that shows a gradient animation
 */
export const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f3f4f6" offset="0%" />
      <stop stop-color="#e5e7eb" offset="50%" />
      <stop stop-color="#f3f4f6" offset="100%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f3f4f6" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

/**
 * Convert shimmer SVG to base64 data URL
 */
const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

/**
 * Generate a blur data URL for Next.js Image placeholder
 * @param w - Width of the placeholder
 * @param h - Height of the placeholder
 * @returns Base64 encoded data URL for use with Next.js Image
 */
export const getBlurDataURL = (w: number = 800, h: number = 600): string => {
  return `data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`;
};
