import { pgTable, uuid, text, timestamp, date, numeric, boolean, pgEnum } from 'drizzle-orm/pg-core';

export const serviceTypeEnum = pgEnum('service_type', ['website', 'hosting', 'domain', 'email', 'ssl', 'maintenance']);
export const currencyEnum = pgEnum('currency', ['COP', 'USD']);

export const contacts = pgTable('contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  phone: text('phone'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyName: text('company_name').notNull(),
  domain: text('domain'),
  contactId: uuid('contact_id').references(() => contacts.id),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const services = pgTable('services', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id').references(() => clients.id).notNull(),
  serviceType: serviceTypeEnum('service_type').notNull(),
  domain: text('domain'),
  provider: text('provider'),
  startDate: date('start_date'),
  expiryDate: date('expiry_date').notNull(),
  price: numeric('price', { precision: 12, scale: 2 }),
  currency: currencyEnum('currency').default('COP'),
  autoRenew: boolean('auto_renew').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const notificationLogs = pgTable('notification_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  serviceId: uuid('service_id').references(() => services.id).notNull(),
  sentAt: timestamp('sent_at').defaultNow(),
  type: text('type'), // '30d', '15d', '7d', 'expired'
  status: text('status'), // 'sent', 'failed'
});

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').default('admin'),
  createdAt: timestamp('created_at').defaultNow(),
});