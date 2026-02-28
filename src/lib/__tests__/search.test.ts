import { describe, it, expect, beforeEach } from 'vitest';
import {
  createSearchIndex,
  searchContent,
  getAutocompleteSuggestions,
  type SearchDocument,
  type SearchResult,
} from '../search';

const sampleDocs: SearchDocument[] = [
  {
    id: 'getting-started',
    title: 'Getting Started with PostgreSQL',
    content: 'PostgreSQL is a powerful relational database management system.',
    tags: ['introduction', 'basics'],
    difficulty: 'beginner',
  },
  {
    id: 'select-queries',
    title: 'SELECT Queries',
    content: 'The SELECT statement is used to retrieve data from a database table.',
    tags: ['sql', 'queries', 'select'],
    difficulty: 'beginner',
  },
  {
    id: 'joins',
    title: 'SQL Joins',
    content: 'JOIN clauses combine rows from two or more tables based on related columns.',
    tags: ['sql', 'joins', 'advanced'],
    difficulty: 'intermediate',
  },
  {
    id: 'indexes',
    title: 'Database Indexes',
    content: 'Indexes improve query performance by reducing the amount of data scanned.',
    tags: ['performance', 'indexes'],
    difficulty: 'advanced',
  },
];

describe('Search Library', () => {
  let index: ReturnType<typeof createSearchIndex>;

  beforeEach(() => {
    index = createSearchIndex();
    for (const doc of sampleDocs) {
      index.add(doc);
    }
  });

  describe('createSearchIndex', () => {
    it('should create an empty search index', () => {
      const emptyIndex = createSearchIndex();
      expect(emptyIndex).toBeDefined();
      expect(emptyIndex.add).toBeInstanceOf(Function);
    });

    it('should add documents to the index', () => {
      const newIndex = createSearchIndex();
      newIndex.add(sampleDocs[0]);
      const results = searchContent(newIndex, 'PostgreSQL');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('searchContent', () => {
    it('should find documents by title', () => {
      const results = searchContent(index, 'SELECT');
      expect(results.some((r: SearchResult) => r.id === 'select-queries')).toBe(true);
    });

    it('should find documents by content', () => {
      const results = searchContent(index, 'performance');
      expect(results.some((r: SearchResult) => r.id === 'indexes')).toBe(true);
    });

    it('should find documents by tags', () => {
      const results = searchContent(index, 'joins');
      expect(results.some((r: SearchResult) => r.id === 'joins')).toBe(true);
    });

    it('should return empty array for no matches', () => {
      const results = searchContent(index, 'xyznonexistent');
      expect(results).toEqual([]);
    });

    it('should return results with document metadata', () => {
      const results = searchContent(index, 'PostgreSQL');
      expect(results.length).toBeGreaterThan(0);
      const result = results[0];
      expect(result.id).toBeDefined();
      expect(result.title).toBeDefined();
      expect(result.difficulty).toBeDefined();
      expect(result.href).toBeDefined();
      expect(result.preview).toBeDefined();
      expect(result.breadcrumb).toBeDefined();
    });

    it('should generate href from document id when not provided', () => {
      const results = searchContent(index, 'PostgreSQL');
      const result = results.find((r) => r.id === 'getting-started');
      expect(result?.href).toBe('/getting-started');
    });

    it('should generate preview from content', () => {
      const results = searchContent(index, 'PostgreSQL');
      const result = results.find((r) => r.id === 'getting-started');
      expect(result?.preview).toContain('PostgreSQL');
    });
  });

  describe('getAutocompleteSuggestions', () => {
    it('should return suggestions for partial input', () => {
      const suggestions = getAutocompleteSuggestions(index, 'Post');
      expect(suggestions.length).toBeGreaterThan(0);
    });

    it('should return limited number of suggestions', () => {
      const suggestions = getAutocompleteSuggestions(index, 'S', 2);
      expect(suggestions.length).toBeLessThanOrEqual(2);
    });

    it('should return empty array for no matches', () => {
      const suggestions = getAutocompleteSuggestions(index, 'xyznonexistent');
      expect(suggestions).toEqual([]);
    });
  });

  describe('serialization', () => {
    it('should export and import the index', () => {
      const exported = index.export();
      expect(exported).toBeDefined();

      const newIndex = createSearchIndex();
      newIndex.import(exported);

      const results = searchContent(newIndex, 'PostgreSQL');
      expect(results.length).toBeGreaterThan(0);
    });
  });
});
