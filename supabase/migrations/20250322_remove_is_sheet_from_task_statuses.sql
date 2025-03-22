-- Remove is_sheet and sheet_id fields from task_statuses table
ALTER TABLE task_statuses DROP COLUMN is_sheet;
ALTER TABLE task_statuses DROP COLUMN sheet_id;


-- Update the constraint to only check that task_id is not null
ALTER TABLE task_statuses DROP CONSTRAINT check_sheet_or_task;
ALTER TABLE task_statuses ADD CONSTRAINT check_task_not_null CHECK (
    task_id IS NOT NULL
);

-- Make task_id column NOT NULL to ensure it always has a value
ALTER TABLE task_statuses ALTER COLUMN task_id SET NOT NULL;