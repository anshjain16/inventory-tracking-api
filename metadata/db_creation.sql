CREATE TABLE users(
	user_id serial PRIMARY KEY,
	user_name varchar(12),
	email varchar(50),
	password varchar(8),
	role varchar(15),
	fullname varchar(20),
	phone varchar(10),
	address varchar(50),
	created_at timestamp DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories(
	category_id serial PRIMARY KEY,
	category_name varchar(20)
);

CREATE TABLE order_status(
	status_id serial PRIMARY KEY,
	status_name varchar(10)
);

CREATE TABLE products(
	product_id serial PRIMARY KEY,
	product_name varchar(20),
	description text,
	price decimal(10, 2),
	quantity int,
	category_id serial,
	manager_id serial,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    threshold int,
	FOREIGN KEY (category_id) REFERENCES categories(category_id),
	FOREIGN KEY (manager_id) REFERENCES users(user_id)
);

CREATE TABLE orders(
	order_id serial PRIMARY KEY,
	customer_id serial,
	order_date date DEFAULT CURRENT_DATE,
	total_ammount int,
	status_id serial,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (customer_id) REFERENCES users(user_id),
	FOREIGN KEY (status_id) REFERENCES order_status(status_id)
);

CREATE TABLE order_items(
	item_id serial PRIMARY KEY,
	order_id serial,
	product_id serial,
	quantity int,
	price_per_unit int,
	subtotal int,
	FOREIGN KEY (order_id) REFERENCES orders(order_id),
	FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE notifications(
	notification_id serial PRIMARY KEY,
	user_id serial,
	content text,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE reports(
	report_id serial PRIMARY KEY,
	report_name varchar(20),
	user_id serial,
	content text,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(user_id)
)