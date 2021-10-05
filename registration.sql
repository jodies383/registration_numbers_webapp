create table towns(
	id serial not null primary key,
	name text not null,
    regCode text not null
);

create table reg(
	id serial not null primary key,
    regNo text not null,
	reg_id int,
	foreign key (reg_id) references towns(id)
);

INSERT INTO towns (name,regCode) VALUES ('Cape Town','CA');
INSERT INTO towns (name,regCode) VALUES ('Paarl','CJ');
INSERT INTO towns (name,regCode) VALUES ('Bellville','CY');