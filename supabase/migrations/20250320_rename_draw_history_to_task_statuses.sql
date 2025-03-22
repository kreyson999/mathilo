-- Rename draw_history table to task_statuses
ALTER TABLE draw_history RENAME TO task_statuses;

-- Rename indexes
ALTER INDEX idx_draw_history_user RENAME TO idx_task_statuses_user;
ALTER INDEX idx_draw_history_sheet RENAME TO idx_task_statuses_sheet;
ALTER INDEX idx_draw_history_task RENAME TO idx_task_statuses_task;

-- Rename trigger
DROP TRIGGER IF EXISTS update_draw_history_modtime ON task_statuses;
CREATE TRIGGER update_task_statuses_modtime
BEFORE UPDATE ON task_statuses
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Drop old policies
DROP POLICY IF EXISTS "Allow users to view their own draw history" ON task_statuses;
DROP POLICY IF EXISTS "Allow users to insert their own draw history" ON task_statuses;
DROP POLICY IF EXISTS "Allow users to update their own draw history" ON task_statuses;
DROP POLICY IF EXISTS "Allow users to delete their own draw history" ON task_statuses;
DROP POLICY IF EXISTS "Allow service_role to manage all draw history" ON task_statuses;

-- Create new policies with updated names
CREATE POLICY "Allow users to view their own task statuses" 
ON task_statuses FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own task statuses" 
ON task_statuses FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own task statuses" 
ON task_statuses FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own task statuses" 
ON task_statuses FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Allow service_role to manage all task statuses" 
ON task_statuses 
USING (auth.role() = 'service_role');