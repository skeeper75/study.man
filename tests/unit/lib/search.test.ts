import { describe, it, expect, beforeEach } from 'vitest'
import {
  createSearchIndex,
  searchContent,
  getAutocompleteSuggestions,
  type SearchDocument,
  type SearchIndex,
} from '@/lib/search'

const sampleDocs: SearchDocument[] = [
  {
    id: 'basics/select',
    title: 'SELECT Basics',
    content: 'SELECT is the most fundamental SQL command for retrieving data from tables.',
    tags: ['sql', 'select', 'basics', 'beginner'],
    difficulty: 'beginner',
  },
  {
    id: 'basics/filtering',
    title: 'Filtering with WHERE',
    content: 'The WHERE clause filters rows based on conditions. Use comparison operators.',
    tags: ['sql', 'where', 'filtering'],
    difficulty: 'beginner',
  },
  {
    id: 'intermediate/joins',
    title: 'JOIN Types',
    content: 'INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN explained with examples.',
    tags: ['sql', 'join', 'inner', 'outer', 'left'],
    difficulty: 'intermediate',
  },
  {
    id: 'advanced/indexes',
    title: 'PostgreSQL Indexes',
    content: 'B-tree, GiST, GIN, BRIN index types. Use EXPLAIN ANALYZE to verify.',
    tags: ['performance', 'indexes', 'btree', 'explain'],
    difficulty: 'advanced',
  },
  {
    id: 'reference/errors',
    title: 'Common Error Codes',
    content: 'ERROR 23505 unique_violation, ERROR 23503 foreign_key_violation, ERROR 42P01 undefined_table.',
    tags: ['errors', 'troubleshooting', 'reference'],
    difficulty: 'intermediate',
  },
]

describe('Search Library', () => {
  let index: SearchIndex

  beforeEach(() => {
    index = createSearchIndex()
    for (const doc of sampleDocs) {
      index.add(doc)
    }
  })

  describe('createSearchIndex', () => {
    it('should create an empty index', () => {
      const emptyIndex = createSearchIndex()
      const results = emptyIndex.search('anything')
      expect(results).toEqual([])
    })

    it('should add documents to the index', () => {
      const results = index.search('SELECT')
      expect(results.length).toBeGreaterThan(0)
    })

    it('should handle empty content array gracefully', () => {
      const emptyIndex = createSearchIndex()
      expect(emptyIndex.search('')).toEqual([])
    })
  })

  describe('searchContent', () => {
    it('should return matching results for a query', () => {
      const results = searchContent(index, 'SELECT')
      expect(results.length).toBeGreaterThan(0)
      expect(results[0].id).toBe('basics/select')
    })

    it('should return results with correct structure', () => {
      const results = searchContent(index, 'JOIN')
      expect(results.length).toBeGreaterThan(0)
      expect(results[0]).toHaveProperty('id')
      expect(results[0]).toHaveProperty('title')
      expect(results[0]).toHaveProperty('difficulty')
    })

    it('should support searching by title', () => {
      const results = searchContent(index, 'Filtering')
      expect(results.some((r) => r.id === 'basics/filtering')).toBe(true)
    })

    it('should support searching by content', () => {
      const results = searchContent(index, 'EXPLAIN ANALYZE')
      expect(results.some((r) => r.id === 'advanced/indexes')).toBe(true)
    })

    it('should support searching by tag', () => {
      const results = searchContent(index, 'performance')
      expect(results.some((r) => r.id === 'advanced/indexes')).toBe(true)
    })

    it('should support searching by error message', () => {
      // SR-002: search for error codes
      const results = searchContent(index, '23505')
      expect(results.some((r) => r.id === 'reference/errors')).toBe(true)
    })

    it('should return empty array for no matches', () => {
      const results = searchContent(index, 'xyznonexistent12345')
      expect(results).toEqual([])
    })

    it('should include difficulty in results', () => {
      const results = searchContent(index, 'SELECT')
      expect(results[0].difficulty).toBe('beginner')
    })

    it('should return results within 100ms for typical content size', () => {
      const start = performance.now()
      searchContent(index, 'SELECT')
      const elapsed = performance.now() - start
      expect(elapsed).toBeLessThan(100)
    })
  })

  describe('getAutocompleteSuggestions', () => {
    it('should return limited results based on limit parameter', () => {
      const suggestions = getAutocompleteSuggestions(index, 'sql', 2)
      expect(suggestions.length).toBeLessThanOrEqual(2)
    })

    it('should default to 5 results when limit not specified', () => {
      const suggestions = getAutocompleteSuggestions(index, 'sql')
      expect(suggestions.length).toBeLessThanOrEqual(5)
    })

    it('should return search results matching the query', () => {
      const suggestions = getAutocompleteSuggestions(index, 'JOIN')
      expect(suggestions.length).toBeGreaterThan(0)
    })
  })

  describe('export/import', () => {
    it('should export index data as serialized format', () => {
      const exported = index.export()
      expect(exported).toHaveProperty('documents')
      expect(exported.documents).toHaveLength(sampleDocs.length)
    })

    it('should import data and restore search functionality', () => {
      const exported = index.export()
      const newIndex = createSearchIndex()
      newIndex.import(exported)
      const results = newIndex.search('SELECT')
      expect(results.length).toBeGreaterThan(0)
    })
  })
})

describe('Global search functions', () => {
  it('initializeSearchIndex and search should work together', async () => {
    const { initializeSearchIndex, search } = await import('@/lib/search')

    // Test search when index is initialized
    initializeSearchIndex(sampleDocs)
    const results = await search('SELECT')
    expect(results.length).toBeGreaterThan(0)
  })
})
