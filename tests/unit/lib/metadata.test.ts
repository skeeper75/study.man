import { describe, it, expect } from 'vitest'

// metadata module is TASK-005 (just completed by backend-dev)
// Tests use it.todo for now since we need to verify the actual export names
// Will be converted to real imports once we confirm the interface

describe('Metadata Parser', () => {
  describe('parseFrontmatter', () => {
    it.todo('should parse valid YAML frontmatter from MDX content')
    it.todo('should extract tags as an array')
    it.todo('should parse difficulty level correctly')
    it.todo('should parse pgVersion string')
    it.todo('should parse lastUpdated date')
    it.todo('should parse related content references')
    it.todo('should return the body content without frontmatter')
    it.todo('should handle content without frontmatter')
    it.todo('should handle missing optional fields with defaults')
  })

  describe('validateFrontmatter', () => {
    it.todo('should pass for valid frontmatter with all required fields')
    it.todo('should reject missing title')
    it.todo('should reject missing description')
    it.todo('should reject invalid difficulty values')
    it.todo('should validate pgVersion format')
  })
})
