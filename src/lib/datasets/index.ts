export interface Dataset {
  id: string;
  name: string;
  description: string;
  tables: string[];
  sql: string;
}

const datasets: Record<string, () => Promise<string>> = {
  'e-commerce': () => import('./e-commerce.sql?raw').then((m) => m.default),
  'social-network': () => import('./social-network.sql?raw').then((m) => m.default),
  'log-data': () => import('./log-data.sql?raw').then((m) => m.default),
};

export const datasetMeta: Dataset[] = [
  {
    id: 'e-commerce',
    name: 'E-Commerce',
    description: 'Online store with products, orders, users, and reviews',
    tables: ['users', 'products', 'orders', 'order_items', 'reviews'],
    sql: '',
  },
  {
    id: 'social-network',
    name: 'Social Network',
    description: 'Social platform with users, posts, follows, and likes',
    tables: ['sn_users', 'posts', 'follows', 'likes'],
    sql: '',
  },
  {
    id: 'log-data',
    name: 'Log Data',
    description: 'Application logs and error events for monitoring',
    tables: ['application_logs', 'error_events'],
    sql: '',
  },
];

export async function loadDataset(id: string): Promise<string> {
  const loader = datasets[id];
  if (!loader) {
    throw new Error(`Dataset not found: ${id}`);
  }
  return loader();
}

export function getDatasetList(): Dataset[] {
  return datasetMeta;
}
