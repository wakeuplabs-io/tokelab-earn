-- Notification: Remove type, title, message columns and add templateId
-- The templateId references a template stored in the backend code

-- Drop columns that are no longer needed
ALTER TABLE "Notification" DROP COLUMN IF EXISTS "type";
ALTER TABLE "Notification" DROP COLUMN IF EXISTS "title";
ALTER TABLE "Notification" DROP COLUMN IF EXISTS "message";

-- Add templateId column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Notification' AND column_name = 'templateId') THEN
        ALTER TABLE "Notification" ADD COLUMN "templateId" TEXT NOT NULL DEFAULT 'unknown';
    END IF;
END $$;

-- Add index on templateId for faster lookups
CREATE INDEX IF NOT EXISTS "Notification_templateId_idx" ON "Notification"("templateId");
