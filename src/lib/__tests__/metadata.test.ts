import { describe, it, expect } from 'vitest';
import {
  validateFrontmatter,
  type Frontmatter,
} from '../metadata';

describe('Metadata Library', () => {
  describe('validateFrontmatter', () => {
    it('should validate valid frontmatter', () => {
      const input: Frontmatter = {
        title: 'SQL Joins',
        description: 'Learn about SQL joins',
        difficulty: 'intermediate',
        tags: ['sql', 'joins'],
        version: '16',
        lastUpdated: '2024-01-15',
        related: ['select-queries', 'subqueries'],
      };

      const result = validateFrontmatter(input);
      expect(result.valid).toBe(true);
      expect(result.data).toEqual(input);
    });

    it('should validate minimal frontmatter', () => {
      const input: Frontmatter = {
        title: 'Introduction',
        description: 'Getting started',
        difficulty: 'beginner',
        tags: [],
      };

      const result = validateFrontmatter(input);
      expect(result.valid).toBe(true);
    });

    it('should reject missing title', () => {
      const input = {
        description: 'Some description',
        difficulty: 'beginner',
        tags: [],
      };

      const result = validateFrontmatter(input as unknown as Frontmatter);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });

    it('should reject invalid difficulty', () => {
      const input = {
        title: 'Test',
        description: 'Test',
        difficulty: 'expert',
        tags: [],
      };

      const result = validateFrontmatter(input as unknown as Frontmatter);
      expect(result.valid).toBe(false);
    });

    it('should reject missing description', () => {
      const input = {
        title: 'Test',
        difficulty: 'beginner',
        tags: [],
      };

      const result = validateFrontmatter(input as unknown as Frontmatter);
      expect(result.valid).toBe(false);
    });

    it('should accept all difficulty levels', () => {
      const levels = ['beginner', 'intermediate', 'advanced'] as const;
      for (const difficulty of levels) {
        const result = validateFrontmatter({
          title: 'Test',
          description: 'Test',
          difficulty,
          tags: [],
        });
        expect(result.valid).toBe(true);
      }
    });

    it('should handle optional fields being undefined', () => {
      const input: Frontmatter = {
        title: 'Test',
        description: 'Description',
        difficulty: 'beginner',
        tags: ['test'],
      };

      const result = validateFrontmatter(input);
      expect(result.valid).toBe(true);
      expect(result.data?.version).toBeUndefined();
      expect(result.data?.lastUpdated).toBeUndefined();
      expect(result.data?.related).toBeUndefined();
    });
  });

  describe('getDifficultyLabel', () => {
    it('should return Korean labels for difficulties', async () => {
      const { getDifficultyLabel } = await import('../metadata');
      expect(getDifficultyLabel('beginner')).toBe('초급');
      expect(getDifficultyLabel('intermediate')).toBe('중급');
      expect(getDifficultyLabel('advanced')).toBe('고급');
    });
  });

  describe('getDifficultyColor', () => {
    it('should return color classes for difficulties', async () => {
      const { getDifficultyColor } = await import('../metadata');
      expect(getDifficultyColor('beginner')).toContain('green');
      expect(getDifficultyColor('intermediate')).toContain('yellow');
      expect(getDifficultyColor('advanced')).toContain('red');
    });
  });
});
