CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table products (
	id uuid primary key default uuid_generate_v4(),
	title text not null,
	description text,
	price float
)

create table stocks (
	product_id uuid,
    count integer,
    foreign key ("product_id") references "products" ("id")
)

insert into products (id, title, description, price) values
('7567ec4b-b10c-48c5-9345-fc73c48a80aa', 'ProductOne', 'Short Product Description1', 2.4),
('7567ec4b-b10c-48c5-9345-fc73c48a80a0', 'ProductNew', 'Short Product Description2', 10),
('7567ec4b-b10c-48c5-9345-fc73c48a80a2', 'ProductTop', 'Short Product Description3', 23),
('7567ec4b-b10c-48c5-9345-fc73c48a80a1', 'ProductTitle', 'Short Product Description4', 15),
('7567ec4b-b10c-48c5-9345-fc73c48a80a3', 'Product', 'Short Product Description5', 23),
('7567ec4b-b10c-48c5-9345-fc73348a80a4', 'ProductTest', 'Short Product Description6', 15),
('7567ec4b-b10c-48c5-9445-fc73c48a80a5', 'Product2', 'Short Product Description7', 23),
('7567ec4b-b10c-45c5-9345-fc73c48a80a6', 'ProductName', 'Short Product Description8', 15)

insert into stocks (product_id, count) values
('7567ec4b-b10c-48c5-9345-fc73c48a80aa', 4),
('7567ec4b-b10c-48c5-9345-fc73c48a80a0', 6),
('7567ec4b-b10c-48c5-9345-fc73c48a80a2', 7),
('7567ec4b-b10c-48c5-9345-fc73c48a80a1', 12),
('7567ec4b-b10c-48c5-9345-fc73c48a80a3', 7),
('7567ec4b-b10c-48c5-9345-fc73348a80a4', 8),
('7567ec4b-b10c-48c5-9445-fc73c48a80a5', 2),
('7567ec4b-b10c-45c5-9345-fc73c48a80a6', 3)
