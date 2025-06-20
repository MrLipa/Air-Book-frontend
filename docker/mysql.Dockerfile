FROM mysql:9.3.0

COPY ./docker/database/schema.sql /docker-entrypoint-initdb.d/schema.sql
COPY ./docker/database/seed.sql   /docker-entrypoint-initdb.d/seed.sql

EXPOSE 3306
