revoke usage on schema public from webuser;
revoke all privileges on all tables in schema public from webuser;
revoke all privileges on all sequences in schema public from webuser;

drop role anon;
drop role webuser;