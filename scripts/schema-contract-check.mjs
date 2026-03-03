import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const migrationsDir = join(root, 'supabase', 'migrations');
const typesPath = join(root, 'src', 'integrations', 'supabase', 'types.ts');

const requiredMigrationPatterns = [
  'create_recharge_payment_order',
  'confirm_recharge_payment',
  'search_app_content',
  'submit_content_report',
  'get_admin_dashboard',
  'apply_content_moderation_action',
  'list_pending_recharge_orders',
  'admin_confirm_recharge_order',
  'content_reports',
  'audit_events',
  'app_config',
];

const migrationFiles = readdirSync(migrationsDir)
  .filter((name) => name.endsWith('.sql'))
  .sort();

const migrationText = migrationFiles
  .map((name) => readFileSync(join(migrationsDir, name), 'utf8'))
  .join('\n');

const missingPatterns = requiredMigrationPatterns.filter(
  (pattern) => !migrationText.includes(pattern)
);

if (missingPatterns.length > 0) {
  console.error('Missing migration contracts:', missingPatterns.join(', '));
  process.exit(1);
}

const typesText = readFileSync(typesPath, 'utf8');
const requiredTypePatterns = [
  'create_recharge_payment_order',
  'search_app_content',
  'get_admin_dashboard',
  'review_content_report',
  'apply_content_moderation_action',
  'list_pending_recharge_orders',
  'admin_confirm_recharge_order',
  'upsert_app_config',
];

const missingTypePatterns = requiredTypePatterns.filter(
  (pattern) => !typesText.includes(pattern)
);

if (missingTypePatterns.length > 0) {
  console.error('Missing generated type contracts:', missingTypePatterns.join(', '));
  process.exit(1);
}

console.log('Schema contract check passed.');
