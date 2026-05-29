/**
 * Open Library cover lookup. Free, no API key.
 *
 * We search by title + author, take the best match, and build a cover URL.
 * Anything that misses just returns null — the UI shows a clean placeholder,
 * so a missing cover never breaks a result.
 */

interface OpenLibraryDoc {
  cover_i?: number;
  cover_edition_key?: string;
  isbn?: string[];
}

interface OpenLibrarySearchResponse {
  docs?: OpenLibraryDoc[];
}

/** Returns a cover image URL for a book, or null if none is found. */
export async function fetchCoverUrl(
  title: string,
  author: string
): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      title,
      author,
      limit: "1",
      fields: "cover_i,cover_edition_key,isbn",
    });
    const res = await fetch(
      `https://openlibrary.org/search.json?${params.toString()}`,
      {
        headers: { "User-Agent": "Dogear/1.0 (book mood recommender)" },
        // Covers rarely change; let the platform cache for a day.
        next: { revalidate: 86400 },
      }
    );
    if (!res.ok) return null;

    const data = (await res.json()) as OpenLibrarySearchResponse;
    const doc = data.docs?.[0];
    if (!doc) return null;

    if (typeof doc.cover_i === "number") {
      return `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
    }
    if (doc.cover_edition_key) {
      return `https://covers.openlibrary.org/b/olid/${doc.cover_edition_key}-L.jpg`;
    }
    if (doc.isbn?.[0]) {
      return `https://covers.openlibrary.org/b/isbn/${doc.isbn[0]}-L.jpg`;
    }
    return null;
  } catch {
    return null;
  }
}

/** Attaches cover URLs to a list of {title, author} items, in parallel. */
export async function attachCovers<T extends { title: string; author: string }>(
  items: T[]
): Promise<(T & { coverUrl: string | null })[]> {
  return Promise.all(
    items.map(async (item) => ({
      ...item,
      coverUrl: await fetchCoverUrl(item.title, item.author),
    }))
  );
}
