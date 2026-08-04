/**
 * Resolve a usable alt string from Prismic image fields and fallbacks.
 * Prismic Image fields expose `alt` (media library description) and optional `copyright`.
 *
 * @param {...(string|null|undefined|{alt?: string|null, copyright?: string|null}|false)} candidates
 * @returns {string}
 */
export function getImageAlt(...candidates) {
  for (const candidate of candidates) {
    if (!candidate) continue;

    if (typeof candidate === "string") {
      const trimmed = candidate.trim();
      if (trimmed) return trimmed;
      continue;
    }

    if (typeof candidate === "object") {
      const fromField =
        (typeof candidate.alt === "string" && candidate.alt.trim()) ||
        (typeof candidate.copyright === "string" && candidate.copyright.trim());
      if (fromField) return fromField;
    }
  }

  return "Image";
}
