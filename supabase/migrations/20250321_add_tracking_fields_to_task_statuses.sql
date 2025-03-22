-- Add fields to task_statuses table for tracking user interactions
ALTER TABLE task_statuses
ADD COLUMN canvas_data TEXT,
ADD COLUMN ai_messages JSONB,
ADD COLUMN user_answers JSONB,
ADD COLUMN is_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN received_points INTEGER;