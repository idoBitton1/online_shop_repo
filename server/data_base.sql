CREATE DATABASE shift_manager;

CREATE TABLE users(
    id UUID PRIMARY KEY,
    username VARCHAR(15) NOT NULL UNIQUE,
    password VARCHAR(20) NOT NULL,
    CONSTRAINT check_min_length CHECK (length(username) >= 3),
    CONSTRAINT check_min_length_pass CHECK (length(password) >= 8)
);

CREATE TABLE jobs(
    id UUID PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL,
    salary_per_hour INTEGER NOT NULL,
    CONSTRAINT check_min CHECK (salary_per_hour > 0)
);

CREATE TABLE users_jobs(

);

CREATE TABLE records(
    id UUID PRIMARY KEY,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    daily_break INTEGER NOT NULL,
    user_id UUID REFERENCES users (id) NOT NULL,
    job_id UUID REFERENCES jobs (id) NOT NULL,
    CONSTRAINT check_min CHECK (daily_break >= 0),
    CONSTRAINT check_times CHECK (start_time < end_time)
);

CREATE TABLE special_record_types(
    id UUID PRIMARY KEY,
    type VARCHAR(20) NOT NULL UNIQUE,
    percentage SMALLINT NOT NULL,
    CONSTRAINT check_min CHECK (percentage >= 0)
);

CREATE TABLE special_records(
    id UUID PRIMARY KEY,
    date TIMESTAMP NOT NULL,
    hours_amount INTEGER NOT NULL,
    user_id UUID REFERENCES users (id) NOT NULL,
    job_id UUID REFERENCES jobs (id) NOT NULL,
    special_record_type_id UUID REFERENCES special_record_types (id) NOT NULL,
    CONSTRAINT check_min CHECK (hours_amount >= 1)
);

CREATE TABLE extras(
    id UUID PRIMARY KEY,
    date TIMESTAMP NOT NULL,
    bonus BOOLEAN NOT NULL,
    amount INTEGER NOT NULL,
    description VARCHAR(20),
    user_id UUID REFERENCES users (id) NOT NULL,
    job_id UUID REFERENCES jobs (id) NOT NULL
    CONSTRAINT check_min CHECK (amount >= 1)
);

CREATE OR REPLACE FUNCTION validate_user(_username VARCHAR, _password VARCHAR, OUT result VARCHAR) AS
$BODY$
DECLARE
BEGIN
IF EXISTS(SELECT 1 FROM users WHERE username=_username AND password=_password) THEN
SELECT id INTO result FROM users WHERE username=_username AND password=_password;
ELSE
result := '';
END IF;
RETURN;
END
$BODY$ language plpgsql;