import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const contentEntries = sqliteTable("content_entries", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const mediaItems = sqliteTable("media_items", {
  id: text("id").primaryKey(),
  filename: text("filename").notNull(),
  contentType: text("content_type").notNull(),
  size: integer("size").notNull(),
  objectKey: text("object_key").notNull(),
  alt: text("alt").notNull().default(""),
  placement: text("placement").notNull().default("library"),
  isVisible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
