-- Create NotificationChannel enum
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'IN_APP');

-- Add channel column to Notification (default to IN_APP for existing records)
ALTER TABLE "Notification" ADD COLUMN "channel" "NotificationChannel" NOT NULL DEFAULT 'IN_APP';

-- Create index on channel
CREATE INDEX "Notification_channel_idx" ON "Notification"("channel");

-- Update UserPreference: change from Json to Boolean
-- First drop the old columns
ALTER TABLE "UserPreference" DROP COLUMN "emailNotifications";
ALTER TABLE "UserPreference" DROP COLUMN "pushNotifications";

-- Add new boolean columns
ALTER TABLE "UserPreference" ADD COLUMN "emailNotifications" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "UserPreference" ADD COLUMN "inAppNotifications" BOOLEAN NOT NULL DEFAULT true;
