// @MX:ANCHOR: [AUTO] Search utility - called from SearchModal, SearchBar, and build script
// @MX:REASON: Central search API - signature changes affect 3+ consumers

import FlexSearch from 'flexsearch';

export interface SearchDocument {
  id: string;
  title: string;
  content: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  href?: string;
  breadcrumb?: string;
}

export interface SearchResult {
  id: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  href: string;
  preview: string;
  breadcrumb: string;
}

interface SerializedIndex {
  documents: SearchDocument[];
}

export interface SearchIndex {
  add: (doc: SearchDocument) => void;
  search: (query: string) => SearchResult[];
  export: () => SerializedIndex;
  import: (data: SerializedIndex) => void;
}

export function createSearchIndex(): SearchIndex {
  const flexIndex = new FlexSearch.Index({
    tokenize: 'forward',
    resolution: 9,
  });

  const documents = new Map<string, SearchDocument>();
  const numToDocId = new Map<number, string>();
  let idCounter = 0;

  function add(doc: SearchDocument): void {
    const numericId = idCounter++;
    numToDocId.set(numericId, doc.id);
    documents.set(doc.id, doc);

    const searchableText = [doc.title, doc.content, doc.tags.join(' '), doc.difficulty].join(' ');
    flexIndex.add(numericId, searchableText);
  }

  function search(query: string): SearchResult[] {
    const results = flexIndex.search(query);
    return results
      .map((numId) => {
        const docId = numToDocId.get(numId as number);
        if (!docId) return null;
        const doc = documents.get(docId);
        if (!doc) return null;
        return {
          id: doc.id,
          title: doc.title,
          difficulty: doc.difficulty,
          href: doc.href ?? `/${doc.id}`,
          preview: doc.content.slice(0, 120),
          breadcrumb: doc.breadcrumb ?? (doc.id.split('/').slice(0, -1).join(' > ') || doc.title),
        };
      })
      .filter((r): r is SearchResult => r !== null);
  }

  function exportIndex(): SerializedIndex {
    return { documents: Array.from(documents.values()) };
  }

  function importIndex(data: SerializedIndex): void {
    for (const doc of data.documents) {
      add(doc);
    }
  }

  return {
    add,
    search,
    export: exportIndex,
    import: importIndex,
  };
}

export function searchContent(index: SearchIndex, query: string): SearchResult[] {
  return index.search(query);
}

export function getAutocompleteSuggestions(
  index: SearchIndex,
  query: string,
  limit = 5,
): SearchResult[] {
  return index.search(query).slice(0, limit);
}

let globalIndex: SearchIndex | null = null;

export function initializeSearchIndex(docs: SearchDocument[]): void {
  globalIndex = createSearchIndex();
  for (const doc of docs) {
    globalIndex.add(doc);
  }
}

export async function search(query: string): Promise<SearchResult[]> {
  if (!globalIndex) return [];
  return globalIndex.search(query);
}
