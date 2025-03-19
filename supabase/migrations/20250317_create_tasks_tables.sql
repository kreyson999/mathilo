-- Create task type enum
CREATE TYPE task_type AS ENUM (
    'single_choice',           -- zadanie jednokrotnego lub wielokrotnego wyboru
    'multiple_choice',           -- zadanie jednokrotnego lub wielokrotnego wyboru
    'open',             -- zadanie otwarte
    'true_false',       -- zadanie typu prawda/fałsz
    'fill_in'           -- zadanie typu uzupełnij
);

-- Tabela dla kategorii zadań
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Główna tabela zadań
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    type task_type NOT NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    max_points NUMERIC(5,2) NOT NULL,
    image_path VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela dla opcji wyboru w zadaniach typu wybór pojedynczy i wielokrotny
CREATE TABLE choice_options (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE
);

-- Tabela dla odpowiedzi do uzupełnienia w zadaniach typu uzupełnij
CREATE TABLE fill_in_tasks (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    template TEXT NOT NULL,
    answer_order INTEGER NOT NULL,
    correct_answer TEXT NOT NULL
);

-- Tabela dla stwierdzeń w zadaniach typu prawda/fałsz
CREATE TABLE true_false_tasks (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    statement TEXT NOT NULL,
    is_true BOOLEAN NOT NULL,
    statement_order INTEGER NOT NULL
);

-- Tabela dla zadań typu otwarte
CREATE TABLE open_tasks (
    task_id INTEGER PRIMARY KEY REFERENCES tasks(id) ON DELETE CASCADE,
    solution TEXT,
    solution_points_steps TEXT
);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_categories_modtime
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_tasks_modtime
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Enable Row Level Security on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE choice_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE fill_in_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE true_false_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE open_tasks ENABLE ROW LEVEL SECURITY;

-- Create security policies

-- Categories policies
CREATE POLICY "Allow public read access for categories" 
ON categories FOR SELECT 
USING (true);

CREATE POLICY "Allow service_role to insert categories" 
ON categories FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow service_role to update categories" 
ON categories FOR UPDATE 
USING (auth.role() = 'service_role');

CREATE POLICY "Allow service_role to delete categories" 
ON categories FOR DELETE 
USING (auth.role() = 'service_role');

-- Tasks policies
CREATE POLICY "Allow authenticated users to read tasks" 
ON tasks FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow service_role to insert tasks" 
ON tasks FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow service_role to update tasks" 
ON tasks FOR UPDATE 
USING (auth.role() = 'service_role');

CREATE POLICY "Allow service_role to delete tasks" 
ON tasks FOR DELETE 
USING (auth.role() = 'service_role');

-- Choice options policies
CREATE POLICY "Allow authenticated users to read choice_options" 
ON choice_options FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow service_role to insert choice_options" 
ON choice_options FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow service_role to update choice_options" 
ON choice_options FOR UPDATE 
USING (auth.role() = 'service_role');

CREATE POLICY "Allow service_role to delete choice_options" 
ON choice_options FOR DELETE 
USING (auth.role() = 'service_role');

-- Fill in tasks policies
CREATE POLICY "Allow authenticated users to read fill_in_tasks" 
ON fill_in_tasks FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow service_role to insert fill_in_tasks" 
ON fill_in_tasks FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow service_role to update fill_in_tasks" 
ON fill_in_tasks FOR UPDATE 
USING (auth.role() = 'service_role');

CREATE POLICY "Allow service_role to delete fill_in_tasks" 
ON fill_in_tasks FOR DELETE 
USING (auth.role() = 'service_role');

-- True false tasks policies
CREATE POLICY "Allow authenticated users to read true_false_tasks" 
ON true_false_tasks FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow service_role to insert true_false_tasks" 
ON true_false_tasks FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow service_role to update true_false_tasks" 
ON true_false_tasks FOR UPDATE 
USING (auth.role() = 'service_role');

CREATE POLICY "Allow service_role to delete true_false_tasks" 
ON true_false_tasks FOR DELETE 
USING (auth.role() = 'service_role');

-- Open tasks policies
CREATE POLICY "Allow authenticated users to read open_tasks" 
ON open_tasks FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow service_role to insert open_tasks" 
ON open_tasks FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow service_role to update open_tasks" 
ON open_tasks FOR UPDATE 
USING (auth.role() = 'service_role');

CREATE POLICY "Allow service_role to delete open_tasks" 
ON open_tasks FOR DELETE 
USING (auth.role() = 'service_role');

-- Create indexes for better performance
CREATE INDEX idx_tasks_category ON tasks(category_id);
CREATE INDEX idx_tasks_type ON tasks(type);
CREATE INDEX idx_choice_options_task ON choice_options(task_id);
CREATE INDEX idx_fill_in_tasks_task ON fill_in_tasks(task_id);
CREATE INDEX idx_true_false_tasks_task ON true_false_tasks(task_id);
CREATE INDEX idx_open_tasks_task ON open_tasks(task_id);

-- Dodaj wszystkie możliwe kategorie --
INSERT INTO categories (name) VALUES ('Wartość bezwzględna liczby');
INSERT INTO categories (name) VALUES ('Potęgi i pierwiastki');
INSERT INTO categories (name) VALUES ('Logarytmy');
INSERT INTO categories (name) VALUES ('Silnia. Współczynnik dwumianowy');
INSERT INTO categories (name) VALUES ('Wzór dwumianowy Newtona');
INSERT INTO categories (name) VALUES ('Wzory skróconego mnożenia');
INSERT INTO categories (name) VALUES ('Funkcja kwadratowa');
INSERT INTO categories (name) VALUES ('Ciągi');
INSERT INTO categories (name) VALUES ('Trygonometria');
INSERT INTO categories (name) VALUES ('Planimetria');
INSERT INTO categories (name) VALUES ('Geometria analityczna na płaszczyźnie kartezjańskiej');
INSERT INTO categories (name) VALUES ('Stereometria');
INSERT INTO categories (name) VALUES ('Kombinatoryka');
INSERT INTO categories (name) VALUES ('Rachunek prawdopodobieństwa');
INSERT INTO categories (name) VALUES ('Parametry danych statystycznych');
INSERT INTO categories (name) VALUES ('Pochodna funkcji');
INSERT INTO categories (name) VALUES ('Tablica wartości funkcji trygonometrycznych');

