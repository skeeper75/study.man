export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Frontmatter {
  title: string;
  description: string;
  difficulty: Difficulty;
  tags: string[];
  version?: string;
  lastUpdated?: string;
  related?: string[];
}

export interface ValidationResult {
  valid: boolean;
  data?: Frontmatter;
  errors?: string[];
}

const VALID_DIFFICULTIES: ReadonlySet<string> = new Set(['beginner', 'intermediate', 'advanced']);

export function validateFrontmatter(input: Frontmatter): ValidationResult {
  const errors: string[] = [];

  if (!input.title || typeof input.title !== 'string') {
    errors.push('title is required and must be a string');
  }

  if (!input.description || typeof input.description !== 'string') {
    errors.push('description is required and must be a string');
  }

  if (!VALID_DIFFICULTIES.has(input.difficulty)) {
    errors.push(`difficulty must be one of: beginner, intermediate, advanced`);
  }

  if (!Array.isArray(input.tags)) {
    errors.push('tags must be an array');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, data: input };
}

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: '초급',
  intermediate: '중급',
  advanced: '고급',
};

export function getDifficultyLabel(difficulty: Difficulty): string {
  return DIFFICULTY_LABELS[difficulty];
}

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  beginner: 'text-green-600 bg-green-50',
  intermediate: 'text-yellow-600 bg-yellow-50',
  advanced: 'text-red-600 bg-red-50',
};

export function getDifficultyColor(difficulty: Difficulty): string {
  return DIFFICULTY_COLORS[difficulty];
}
