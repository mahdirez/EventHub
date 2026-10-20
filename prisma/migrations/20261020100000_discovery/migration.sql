-- CreateEnum
CREATE TYPE "EventVisibility" AS ENUM ('private', 'public');

-- CreateTable
CREATE TABLE "categories" (
    "slug" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("slug")
);

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "city" TEXT,
ADD COLUMN     "visibility" "EventVisibility" NOT NULL DEFAULT 'private',
ADD COLUMN     "category_slug" TEXT,
ADD COLUMN     "cover_image_url" TEXT,
ADD COLUMN     "slug" TEXT;

-- CreateTable
CREATE TABLE "event_favorites" (
    "id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "event_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");

-- CreateIndex
CREATE INDEX "idx_events_discovery" ON "events"("visibility", "event_date" DESC);

-- CreateIndex
CREATE INDEX "idx_events_category" ON "events"("category_slug");

-- CreateIndex
CREATE UNIQUE INDEX "event_favorites_user_id_event_id_key" ON "event_favorites"("user_id", "event_id");

-- CreateIndex
CREATE INDEX "idx_favorites_user" ON "event_favorites"("user_id", "created_at" DESC);

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_category_slug_fkey" FOREIGN KEY ("category_slug") REFERENCES "categories"("slug") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_favorites" ADD CONSTRAINT "event_favorites_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed categories
INSERT INTO "categories" ("slug", "sort_order") VALUES
  ('technology', 1),
  ('music', 2),
  ('business', 3),
  ('art', 4),
  ('education', 5),
  ('sports', 6);
