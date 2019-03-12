drop table if exists days;
drop table if exists meals;
drop table if exists amounts;

create table amounts (
    id serial 
        primary key,
    percent varchar(4)
);

insert into amounts
    (percent) 
values
    ('0%'),
    ('25%'),
    ('50%'),
    ('75%'),
    ('100%');

create table meals (
    id serial 
        primary key,
    time time,
    amountId int 
        references amounts(id),
    notes text 
        not null 
        default ''
);

create table days (
    id serial 
        primary key,
    date timestamptz
        default now()::timestamptz
        unique,
    morningMealId int 
        references meals(id),
    eveningMealId int 
        references meals(id),
    notes text 
        not null 
        default ''
);

