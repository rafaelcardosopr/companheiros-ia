import { sql } from "drizzle-orm";
import {
  check,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  vector,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["user", "admin"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  role: userRole("role").notNull().default("user"),
  birthDate: date("birth_date"),
  ageConfirmedAt: timestamp("age_confirmed_at", { withTimezone: true }),
  termsAcceptedAt: timestamp("terms_accepted_at", { withTimezone: true }),
  suspendedAt: timestamp("suspended_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Tokens de uso único do link mágico. Guardamos só o hash.
export const loginTokens = pgTable("login_tokens", {
  tokenHash: text("token_hash").primaryKey(),
  email: text("email").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Sessões. O cookie leva o token; aqui fica só o hash.
export const sessions = pgTable(
  "sessions",
  {
    idHash: text("id_hash").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
);

// Personagens. ownerId nulo = personagem do catálogo oficial.
export const characters = pgTable(
  "characters",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: uuid("owner_id").references(() => users.id, { onDelete: "cascade" }),
    slug: text("slug").unique(),
    name: text("name").notNull(),
    age: integer("age").notNull(),
    tagline: text("tagline").notNull().default(""),
    bio: text("bio").notNull().default(""),
    appearance: text("appearance").notNull().default(""),
    archetype: text("archetype").notNull().default(""),
    personality: text("personality").notNull().default(""),
    backstory: text("backstory").notNull().default(""),
    occupation: text("occupation").notNull().default(""),
    hobbies: text("hobbies").notNull().default(""),
    relationship: text("relationship").notNull().default(""),
    speakingStyle: text("speaking_style").notNull().default(""),
    greeting: text("greeting").notNull().default(""),
    tags: text("tags").array().notNull().default(sql`'{}'::text[]`),
    avatarUrl: text("avatar_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    check("characters_adult_age", sql`${t.age} >= 18`),
    index("characters_owner_idx").on(t.ownerId),
  ],
);

export const conversations = pgTable(
  "conversations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    characterId: uuid("character_id")
      .notNull()
      .references(() => characters.id, { onDelete: "cascade" }),
    title: text("title"),
    summary: text("summary").notNull().default(""),
    summarizedUpTo: integer("summarized_up_to").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("conversations_user_idx").on(t.userId, t.characterId)],
);

export const messageRole = pgEnum("message_role", ["user", "assistant", "system"]);

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    role: messageRole("role").notNull(),
    content: text("content").notNull(),
    // bge-m3 gera vetores de 1024 dimensões
    embedding: vector("embedding", { dimensions: 1024 }),
    blockedReason: text("blocked_reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("messages_conversation_idx").on(t.conversationId, t.createdAt)],
);

// Fatos de memória ("slots") que o usuário pode ver e editar.
export const memoryFacts = pgTable(
  "memory_facts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    characterId: uuid("character_id")
      .notNull()
      .references(() => characters.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    pinned: integer("pinned").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("memory_facts_user_char_idx").on(t.userId, t.characterId)],
);

// Como o usuário quer ser visto pelos personagens.
export const personas = pgTable("personas", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reportStatus = pgEnum("report_status", ["open", "reviewed", "dismissed"]);

export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  reporterId: uuid("reporter_id").references(() => users.id, { onDelete: "set null" }),
  messageId: uuid("message_id").references(() => messages.id, { onDelete: "set null" }),
  characterId: uuid("character_id").references(() => characters.id, { onDelete: "set null" }),
  reason: text("reason").notNull(),
  status: reportStatus("status").notNull().default("open"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
