-- Social Network Dataset
-- Schema: users, posts, follows, likes

CREATE TABLE sn_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  bio TEXT,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  author_id INT REFERENCES sn_users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE follows (
  follower_id INT REFERENCES sn_users(id),
  following_id INT REFERENCES sn_users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id)
);

CREATE TABLE likes (
  user_id INT REFERENCES sn_users(id),
  post_id INT REFERENCES posts(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, post_id)
);

-- Seed: Users (15)
INSERT INTO sn_users (username, display_name, bio) VALUES
  ('devkim', 'Kim Developer', 'Full-stack developer from Seoul'),
  ('sqlmaster', 'SQL Master', 'Teaching SQL since 2010'),
  ('dataengineer', 'Data Engineer', 'Building data pipelines'),
  ('cloudnative', 'Cloud Native', 'Kubernetes enthusiast'),
  ('frontend_dev', 'Frontend Dev', 'React and TypeScript lover'),
  ('backend_guru', 'Backend Guru', 'API design specialist'),
  ('ml_researcher', 'ML Researcher', 'Machine learning and AI'),
  ('devops_ninja', 'DevOps Ninja', 'CI/CD pipeline expert'),
  ('security_pro', 'Security Pro', 'Application security'),
  ('mobile_dev', 'Mobile Dev', 'Flutter and React Native'),
  ('ux_designer', 'UX Designer', 'User experience advocate'),
  ('pm_lead', 'PM Lead', 'Product management'),
  ('qa_tester', 'QA Tester', 'Quality assurance'),
  ('tech_writer', 'Tech Writer', 'Technical documentation'),
  ('startup_cto', 'Startup CTO', 'Building startups');

-- Seed: Posts (30)
INSERT INTO posts (author_id, content) VALUES
  (1, 'Just deployed my first PostgreSQL cluster!'),
  (2, 'TIP: Always use parameterized queries to prevent SQL injection'),
  (3, 'Working on a new ETL pipeline with Apache Spark'),
  (4, 'Kubernetes 1.29 is out! Check out the new features'),
  (5, 'React Server Components are a game changer'),
  (1, 'PostgreSQL 16 window functions are amazing'),
  (2, 'Understanding EXPLAIN ANALYZE output is crucial'),
  (6, 'GraphQL vs REST: when to use each'),
  (7, 'Fine-tuning LLMs with custom datasets'),
  (8, 'GitHub Actions for automated deployments'),
  (3, 'Data lake vs data warehouse - my thoughts'),
  (9, 'OWASP Top 10 security checklist for 2024'),
  (10, 'Building cross-platform apps with Flutter'),
  (4, 'Service mesh with Istio - beginner guide'),
  (5, 'Next.js 15 App Router patterns'),
  (11, 'Design systems that scale'),
  (12, 'Agile estimation techniques that actually work'),
  (13, 'Load testing with k6 - a practical guide'),
  (14, 'Writing better API documentation'),
  (15, 'Scaling from 0 to 1M users'),
  (1, 'TDD with PostgreSQL - write tests first!'),
  (2, 'Index scan vs sequential scan - when to use each'),
  (6, 'Microservices communication patterns'),
  (7, 'Transformer architecture explained simply'),
  (8, 'Infrastructure as Code with Terraform'),
  (9, 'JWT authentication best practices'),
  (10, 'State management in React Native'),
  (11, 'Accessibility in web applications'),
  (12, 'OKR framework for engineering teams'),
  (15, 'How to hire your first 10 engineers');

-- Seed: Follows (40)
INSERT INTO follows (follower_id, following_id) VALUES
  (1, 2), (1, 3), (1, 6), (2, 1), (2, 3), (2, 7),
  (3, 1), (3, 2), (3, 4), (4, 1), (4, 8), (4, 15),
  (5, 1), (5, 6), (5, 11), (6, 1), (6, 2), (6, 5),
  (7, 2), (7, 3), (7, 9), (8, 4), (8, 9), (8, 15),
  (9, 6), (9, 8), (9, 12), (10, 5), (10, 11), (10, 13),
  (11, 5), (11, 10), (11, 14), (12, 15), (12, 13), (13, 12),
  (13, 14), (14, 2), (14, 13), (15, 1);

-- Seed: Likes (50)
INSERT INTO likes (user_id, post_id) VALUES
  (1, 2), (1, 7), (1, 8), (2, 1), (2, 6), (2, 21),
  (3, 1), (3, 2), (3, 7), (3, 22), (4, 10), (4, 14),
  (4, 25), (5, 5), (5, 15), (5, 28), (6, 1), (6, 8),
  (6, 23), (7, 2), (7, 9), (7, 24), (8, 4), (8, 10),
  (8, 25), (9, 8), (9, 12), (9, 26), (10, 5), (10, 13),
  (10, 27), (11, 5), (11, 16), (11, 28), (12, 15), (12, 17),
  (12, 29), (13, 13), (13, 18), (14, 2), (14, 19), (14, 7),
  (15, 1), (15, 20), (15, 30), (1, 3), (2, 4), (3, 5),
  (4, 6), (5, 7);
