FROM mysql:9.3.0

COPY ./database/erd.sql /docker-entrypoint-initdb.d/erd.sql

EXPOSE 3306

