create table roles (
  id bigint primary key generated always as identity,
  name text not null
);

create table users (
  id bigint primary key generated always as identity,
  name text not null,
  email text not null unique,
  password text not null,
  role_id bigint not null references roles (id)
);

create table candidates (
  user_id bigint primary key references users (id),
  gender text,
  age int,
  resume_link text
);

CREATE TABLE employees (
  user_id BIGINT PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
  gender TEXT,
  age INT,
  plots_link TEXT,
  period TEXT
);

create table vacancies (
  id bigint primary key generated always as identity,
  title text not null,
  expiration_date date not null,
  salary_range text,
  description text,
  requirements text,
  benefits text,
  recruiter_id bigint not null references users (id),
  manager_id bigint not null references users (id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
);

create table applications (
  id bigint primary key generated always as identity,
  candidate_id bigint not null references candidates (user_id),
  vacancy_id bigint not null references vacancies (id) on delete cascade,
  message TEXT,
  status text check (
    status in (
      'Aplicación',
      'Prueba de idioma',
      'Prueba técnica',
      'Entrevista',
      'Rechazado',
	    'Aceptado'
    )
  ) not null,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

create table interviews (
  id bigint primary key generated always as identity,
  candidate_id bigint not null references candidates (user_id),
  manager_id bigint not null references users (id),
  interview_date timestamp not null,
  interview_link text
);

-- TESTS --

-- Inserción de roles
INSERT INTO roles (name) VALUES('candidate'), ('recruiter'), ('manager'). ('employee');
SELECT * FROM roles;

-- Inserción de candidato
WITH new_user AS (
  INSERT INTO users (name, email, password, role_id)
  VALUES (
    'Juan Pérez Hernández',
    'juan@gmail.com',
    '12345678',
    (SELECT id FROM roles WHERE name = 'candidate')
  )
  RETURNING id
)
INSERT INTO candidates (user_id, gender, age, resume_link)
VALUES (
  (SELECT id FROM new_user), -- Usa el 'id' capturado
  'Masculino',
  25,
  'https://www.isaijesus.com/cv-isaijesus.pdf'
);
SELECT * FROM users;
SELECT * FROM candidates;

-- Inserción de empleado
WITH new_user AS (
  INSERT INTO users (name, email, password, role_id)
  VALUES (
    'Carlos Eduardo Ramírez Gómez',
    'carlos@gmail.com',
    '123456789',
    (SELECT id FROM roles WHERE name = 'employee')
  )
  RETURNING id
)
INSERT INTO employees (user_id, gender, age, plots_link, period)
VALUES (
  (SELECT id FROM new_user), -- Usa el 'id' capturado
  'Masculino',
  32,
  'https://grafiacas.com',
  '15/02/2025 - 15/08/2025'
);

-- Inserción de reclutador
INSERT INTO users (name, email, password, role_id) 
VALUES(
	'Ana Sofía Martínez Delgado',
	'ana@gmail.com',
	'12345678',
	2
);

-- Inserción de jefe de área
INSERT INTO users (name, email, password, role_id) 
VALUES(
	'Miguel Ángel Castillo Romero',
	'miguel@gmail.com',
	'12345678',
	3
);

-- Inserción de una vacante
INSERT INTO vacancies (
  title,
  expiration_date,
  salary_range,
  description,
  requirements,
  benefits,
  recruiter_id,
  manager_id
)
VALUES (
  'Cientifiko00. de datos',
  '2025-11-30', -- YYYY-MM-DD
  '$10,000 - $15,000 mensual',
  'Únete a nuestro equipo como analista de datos y ayuda a transformar información en decisiones estratégicas de negocio.',
  
  -- $$ para delimitar el texto multilínea (no hace falta en una petición)
  $$• Licenciatura en áreas económico-administrativas, ingeniería o afín
• 2+ años de experiencia en análisis de datos
• Dominio de SQL y Excel avanzado
• Experiencia con herramientas de visualización (Tableau, Power BI)
• Pensamiento analítico y atención al detalle$$,
  
  $$• Prestaciones superiores a las de ley
• Bonos por desempeño
• Oportunidades de crecimiento
• Capacitación especializada
• Ambiente profesional$$,
  
  2,
  3
);

-- Inserción de aplicación
INSERT INTO applications(
	candidate_id,
	vacancy_id,
	status
) VALUES(
	1,
	1,
	'Aplicación'
);

-- Inserción de entrevista
INSERT INTO interviews(
	candidate_id,
	manager_id,
	interview_date,
  interview_link
) VALUES(
	1,
	3,
	'2025-11-15 14:30:00',
  'https://zoom.us/...'
);

-- MODIFICACIONES

SELECT * FROM candidates;
SELECT * FROM users;
SELECT * FROM roles;

SELECT * FROM vacancies;
SELECT * FROM vacancies WHERE id = 1; 

SELECT * FROM applications;
SELECT * FROM applications WHERE candidate_id = 1;

-- 'Aplicación'
-- 'Prueba de idioma'
-- 'Prueba técnica'
-- 'Entrevista'
-- 'Rechazado'
-- 'Aceptado'

UPDATE applications SET status = 'Prueba técnica' WHERE id = 1;

INSERT INTO applications(
	candidate_id,
	vacancy_id,
	status
) VALUES(
	1,
	1,
	'Aplicación'
);

SELECT * FROM applications;
SELECT id FROM applications WHERE vacancy_id = 1 AND candidate_id = 1;

SELECT * FROM users;
SELECT * FROM candidates;
SELECT * FROM roles;

SELECT * FROM applications;
SELECT * FROM vacancies WHERE id = 2;
SELECT * FROM interviews;

SELECT 
	usr.id,
	usr.name,
    cand.gender,
    cand.age,
    cand.resume_link,
	vac.id AS vacancy_id,
	app.id AS application_id,
	app.status
FROM 
    applications AS app
JOIN 
    vacancies AS vac ON app.vacancy_id = vac.id
JOIN 
    candidates AS cand ON app.candidate_id = cand.user_id
JOIN 
    users AS usr ON cand.user_id = usr.id
WHERE 
    vac.manager_id = 3
ORDER BY
    app.created_at DESC;

SELECT * FROM interviews;
SELECT * FROM applications;

DELETE FROM interviews WHERE id = 1;

SELECT * FROM applications;
UPDATE applications SET status = 'Entrevista' WHERE id = 2;

INSERT INTO roles (name) VALUES('employee');
SELECT * FROM roles;

