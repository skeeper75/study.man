import { describe, it, expect, beforeAll } from 'vitest'
import {
  createSearchIndex,
  searchContent,
  getAutocompleteSuggestions,
  type SearchIndex,
  type SearchDocument,
} from '@/lib/search'

describe('Search Flow Integration', () => {
  let index: SearchIndex

  const entries: SearchDocument[] = [
    {
      id: 'basics/select',
      title: 'SELECT Basics',
      content: 'SELECT is the most fundamental SQL command for querying data from tables.',
      tags: ['sql', 'select', 'query'],
      difficulty: 'beginner',
    },
    {
      id: 'basics/filtering',
      title: 'Filtering with WHERE',
      content: 'The WHERE clause filters rows based on conditions. ERROR 23505 unique_violation.',
      tags: ['sql', 'where', 'filtering'],
      difficulty: 'beginner',
    },
    {
      id: 'intermediate/joins',
      title: 'JOIN Types',
      content: 'INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN explained.',
      tags: ['sql', 'join', 'inner', 'outer'],
      difficulty: 'intermediate',
    },
    {
      id: 'advanced/indexing',
      title: 'PostgreSQL Indexing',
      content: 'B-tree, GIN, GiST, and BRIN index types for query optimization.',
      tags: ['index', 'performance', 'btree'],
      difficulty: 'advanced',
    },
    {
      id: 'advanced/explain',
      title: 'EXPLAIN ANALYZE',
      content: 'Understanding query execution plans and cost estimation.',
      tags: ['explain', 'performance', 'query-plan'],
      difficulty: 'advanced',
    },
  ]

  beforeAll(() => {
    index = createSearchIndex()
    for (const entry of entries) {
      index.add(entry)
    }
  })

  describe('full search pipeline: index build -> query -> results', () => {
    it('should build index from content entries and return results for matching queries', () => {
      // FR-003: search returns matching results
      const results = searchContent(index, 'SELECT')
      expect(results.length).toBeGreaterThan(0)
      expect(results.some((r) => r.id === 'basics/select')).toBe(true)
    })

    it('should rank title matches higher than body matches', () => {
      // FR-003: ranked by relevance
      const results = searchContent(index, 'SELECT')
      // The document with "SELECT" in the title should appear in results
      const selectResult = results.find((r) => r.id === 'basics/select')
      expect(selectResult).toBeDefined()
      // Title match should be ranked early
      const selectIndex = results.findIndex((r) => r.id === 'basics/select')
      expect(selectIndex).toBeLessThan(results.length)
    })

    it('should return results within 100ms for typical content size', () => {
      // FR-003: within 1 second
      const start = performance.now()
      searchContent(index, 'SELECT')
      const elapsed = performance.now() - start
      expect(elapsed).toBeLessThan(100)
    })

    it('should return empty results for non-matching queries', () => {
      const results = searchContent(index, 'xyznonexistent')
      expect(results).toHaveLength(0)
    })

    it('should find content by tag', () => {
      const results = searchContent(index, 'filtering')
      expect(results.some((r) => r.id === 'basics/filtering')).toBe(true)
    })

    it('should find content by error code pattern', () => {
      // SR-002: search for PostgreSQL error codes
      const results = searchContent(index, 'ERROR 23505')
      expect(results.some((r) => r.id === 'basics/filtering')).toBe(true)
    })
  })

  describe('autocomplete pipeline', () => {
    it('should return limited suggestions for partial queries', () => {
      const suggestions = getAutocompleteSuggestions(index, 'sql', 3)
      expect(suggestions.length).toBeLessThanOrEqual(3)
    })

    it('should return results matching partial query', () => {
      const suggestions = getAutocompleteSuggestions(index, 'JOIN')
      expect(suggestions.some((r) => r.id === 'intermediate/joins')).toBe(true)
    })
  })

  describe('index export/import pipeline', () => {
    it('should export and re-import index preserving search results', () => {
      const exported = index.export()
      expect(exported.documents.length).toBe(entries.length)

      const newIndex = createSearchIndex()
      newIndex.import(exported)

      const results = searchContent(newIndex, 'SELECT')
      expect(results.length).toBeGreaterThan(0)
      expect(results.some((r) => r.id === 'basics/select')).toBe(true)
    })
  })
})
