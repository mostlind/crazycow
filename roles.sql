create role anon;
grant anon to crazycow;

create role webuser;
grant usage on schema public to webuser;
grant all privileges on all tables in schema public to webuser;
grant all privileges on all sequences in schema public to webuser;
grant webuser to crazycow;