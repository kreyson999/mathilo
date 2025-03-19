-- Create sheets table
CREATE TABLE sheets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    release_date DATE NOT NULL,
    is_practice BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add sheet_id column to tasks table
ALTER TABLE tasks ADD COLUMN sheet_id INTEGER REFERENCES sheets(id) ON DELETE SET NULL;

-- Create draw_history table
CREATE TABLE draw_history (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    is_sheet BOOLEAN NOT NULL DEFAULT FALSE,
    sheet_id INTEGER REFERENCES sheets(id) ON DELETE SET NULL,
    task_id INTEGER REFERENCES tasks(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_sheet_or_task CHECK (
        (is_sheet = TRUE AND sheet_id IS NOT NULL AND task_id IS NULL) OR
        (is_sheet = FALSE AND sheet_id IS NULL AND task_id IS NOT NULL)
    )
);

-- Create indexes for better performance
CREATE INDEX idx_tasks_sheet ON tasks(sheet_id);
CREATE INDEX idx_draw_history_user ON draw_history(user_id);
CREATE INDEX idx_draw_history_sheet ON draw_history(sheet_id);
CREATE INDEX idx_draw_history_task ON draw_history(task_id);

-- Add triggers for updated_at columns
CREATE TRIGGER update_sheets_modtime
BEFORE UPDATE ON sheets
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_draw_history_modtime
BEFORE UPDATE ON draw_history
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Enable Row Level Security on new tables
ALTER TABLE sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE draw_history ENABLE ROW LEVEL SECURITY;

-- Create security policies for sheets table
CREATE POLICY "Allow public read access for sheets" 
ON sheets FOR SELECT 
USING (true);

CREATE POLICY "Allow service_role to insert sheets" 
ON sheets FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow service_role to update sheets" 
ON sheets FOR UPDATE 
USING (auth.role() = 'service_role');

CREATE POLICY "Allow service_role to delete sheets" 
ON sheets FOR DELETE 
USING (auth.role() = 'service_role');

-- Create security policies for draw_history table
CREATE POLICY "Allow users to view their own draw history" 
ON draw_history FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own draw history" 
ON draw_history FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own draw history" 
ON draw_history FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own draw history" 
ON draw_history FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Allow service_role to manage all draw history" 
ON draw_history 
USING (auth.role() = 'service_role');

