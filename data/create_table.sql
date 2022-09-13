BEGIN;

-- Il faut détruire les tables si elles existent --
DROP TABLE IF EXISTS "task";

-- Création de la table task --
CREATE TABLE IF NOT EXISTS "task" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "position" integer NOT NULL DEFAULT 0,
    "color" TEXT NOT NULL DEFAULT '#FFFFFF',
    "finish" BOOLEAN NOT NULL DEFAULT 'FALSE',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

-- Insertion de task test dans la table task --
INSERT INTO "task" ("name") VALUES
('To-do 1'),
('To-do 2'),
('To-do 3'),
('To-do 4'),
('To-do 5');


COMMIT;