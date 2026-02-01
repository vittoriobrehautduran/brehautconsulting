-- Create busy_days table
CREATE TABLE IF NOT EXISTS "busy_days" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "date" TIMESTAMP(3) NOT NULL UNIQUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on date for faster queries
CREATE INDEX IF NOT EXISTS "busy_days_date_idx" ON "busy_days"("date");

