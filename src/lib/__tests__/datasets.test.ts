import { describe, it, expect, vi } from 'vitest';
import { getDatasetList, loadDataset, datasetMeta } from '../datasets/index';

// Mock the SQL file imports
vi.mock('../datasets/e-commerce.sql?raw', () => ({
  default: 'CREATE TABLE users (id SERIAL);',
}));
vi.mock('../datasets/social-network.sql?raw', () => ({
  default: 'CREATE TABLE sn_users (id SERIAL);',
}));
vi.mock('../datasets/log-data.sql?raw', () => ({
  default: 'CREATE TABLE application_logs (id SERIAL);',
}));

describe('Datasets', () => {
  describe('getDatasetList', () => {
    it('should return all available datasets', () => {
      const list = getDatasetList();
      expect(list).toHaveLength(3);
    });

    it('should include required metadata for each dataset', () => {
      const list = getDatasetList();
      for (const dataset of list) {
        expect(dataset.id).toBeDefined();
        expect(dataset.name).toBeDefined();
        expect(dataset.description).toBeDefined();
        expect(dataset.tables).toBeInstanceOf(Array);
        expect(dataset.tables.length).toBeGreaterThan(0);
      }
    });

    it('should include e-commerce dataset', () => {
      const list = getDatasetList();
      const ecommerce = list.find((d) => d.id === 'e-commerce');
      expect(ecommerce).toBeDefined();
      expect(ecommerce!.tables).toContain('users');
      expect(ecommerce!.tables).toContain('products');
      expect(ecommerce!.tables).toContain('orders');
    });

    it('should include social-network dataset', () => {
      const list = getDatasetList();
      const social = list.find((d) => d.id === 'social-network');
      expect(social).toBeDefined();
      expect(social!.tables).toContain('posts');
      expect(social!.tables).toContain('follows');
    });

    it('should include log-data dataset', () => {
      const list = getDatasetList();
      const logs = list.find((d) => d.id === 'log-data');
      expect(logs).toBeDefined();
      expect(logs!.tables).toContain('application_logs');
      expect(logs!.tables).toContain('error_events');
    });
  });

  describe('loadDataset', () => {
    it('should load e-commerce dataset SQL', async () => {
      const sql = await loadDataset('e-commerce');
      expect(sql).toContain('CREATE TABLE');
    });

    it('should load social-network dataset SQL', async () => {
      const sql = await loadDataset('social-network');
      expect(sql).toContain('CREATE TABLE');
    });

    it('should load log-data dataset SQL', async () => {
      const sql = await loadDataset('log-data');
      expect(sql).toContain('CREATE TABLE');
    });

    it('should throw for unknown dataset', async () => {
      await expect(loadDataset('nonexistent')).rejects.toThrow('Dataset not found');
    });
  });

  describe('datasetMeta', () => {
    it('should export dataset metadata', () => {
      expect(datasetMeta).toHaveLength(3);
      expect(datasetMeta[0].id).toBe('e-commerce');
      expect(datasetMeta[1].id).toBe('social-network');
      expect(datasetMeta[2].id).toBe('log-data');
    });
  });
});
