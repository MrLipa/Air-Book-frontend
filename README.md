grafana
testy performecu
test integracyjne 
testy unit
postman
dev a prod versia od zmiennej środowiskowej
doc
logowanie lepsze






Isort (Python) 
MyPy (Python) 
Black (Python) 
Pre-Commit 
plik z configuracją 
logging middleware
middlrware so sprawdzani usera
struktura fast api
apload websocketem file exel
parsery
exporter

zrobić fast api



{
  "python.analysis.extraPaths": ["./app"],
  "python.venvPath": "~/.cache/pypoetry/virtualenvs/"
}




@recommended




https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme






sudo apt update
sudo apt install curl git vim zsh -y












version: '3.1'

services:
  postgres:
    build:
      context: ./postgres
      dockerfile: Dockerfile
    image: docker_postgres/postgres:latest
    user: root
    restart: always
    container_name: postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: postgres
    volumes:
      - ./postgres/erd.sql:/docker-entrypoint-initdb.d/erd.sql
    ports:
      - "5432:5432"
    networks:
      - app-network
    privileged: true

  neo4j:
    build:
      context: ./neo4j
      dockerfile: Dockerfile
    image: docker_neo4j/neo4j:latest
    user: root
    ports:
      - "7687:7687"
      - "7474:7474"
      - "7473:7473"
    command: ["./init-db.sh"]
    networks:
      - app-network
    privileged: true

  backend:
    build:
      context: ./../backend
      dockerfile: Dockerfile
    image: docker_backend/backend:latest
    ports:
      - '3005:3000'
    depends_on:
      - neo4j
      - postgres
    networks: 
      - app-network

  api:
    build:
      context: ./../api
      dockerfile: Dockerfile
    image: docker_api/api:latest
    user: root
    ports:
      - '3000:3000'
    depends_on:
      - neo4j
      - postgres
    command: npm run start
    networks: 
      - app-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 120s
      timeout: 10s
      retries: 5

  frontend:
    build:
      context: ./../frontend
      dockerfile: Dockerfile
    image: docker_frontend/frontend:latest
    ports:
      - "5173:5173"
    environment:
      - CHOKIDAR_USEPOLLING=true
      - WATCHPACK_POLLING=true
    depends_on:
      - api
    networks: 
      - app-network

  pdadmin:
    build:
      context: ./pgadmin
      dockerfile: Dockerfile
    image: docker_pgadmin/pgadmin:latest
    user: root
    restart: always
    environment:
      PGADMIN_DEFAULT_EMAIL: example@gmail.com
      PGADMIN_DEFAULT_PASSWORD: example
      PGADMIN_SERVER_MODE: 'True'
      PGADMIN_SERVER_JSON_FILE: /pgadmin4/servers.json
    volumes:
      - ./pgadmin/servers.json:/pgadmin4/servers.json
    depends_on:
      - postgres
    links:
      - postgres
    ports:
      - "81:80"
    networks:
      - app-network
    privileged: true

  jenkins:
    build:
      context: ./jenkins
      dockerfile: Dockerfile
    image: docker_jenkins/jenkins:latest
    user: root
    command: >
      bash -c ". /var/jenkins_home/jenkins_config.sh &&
               exec java -jar /usr/share/jenkins/jenkins.war"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - jenkins_home:/var/jenkins_home
    ports:
      - 8080:8080
      - 5901:5901
    privileged: true
    networks: 
      - app-network
    depends_on:
      - api
      - frontend

  redis:
    build:
      context: ./redis
      dockerfile: Dockerfile
    image: docker_redis/redis:latest
    ports:
      - "6379:6379"

  prometheus:
    build:
      context: ./prometheus
      dockerfile: Dockerfile
    image: docker_prometheus/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
    networks:
      - app-network

  grafana:
    build:
      context: ./grafana
      dockerfile: Dockerfile
    image: docker_grafana/grafana:latest
    ports:
      - "3010:3000"
    volumes:
      - ./grafana/datasources:/etc/grafana/provisioning/datasources/
      - ./grafana/dashboards-config:/etc/grafana/provisioning/dashboards/
      - ./grafana/dashboards:/var/lib/grafana/dashboards
    networks:
      - app-network

  elasticsearch:
    build:
      context: ./elasticsearch
      dockerfile: Dockerfile
      args:
        ELK_VERSION: $ELK_VERSION
    image: docker_elasticsearch/elasticsearch:latest
    volumes:
      - ./elasticsearch/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml
    ports:
      - "9200:9200"
      - "9300:9300"
    environment:
      ES_JAVA_OPTS: "-Xmx256m -Xms256m"
      ELASTIC_PASSWORD: changeme
      discovery.type: single-node
    networks:
      - app-network

  logstash:
    build:
      context: ./logstash
      dockerfile: Dockerfile
      args:
        ELK_VERSION: $ELK_VERSION
    image: docker_logstash/logstash:latest
    volumes:
      - ./logstash/logstash.yml:/usr/share/logstash/config/logstash.yml
      - ./logstash/pipeline:/usr/share/logstash/pipeline
    ports:
      - "9600:9600"
      - "12201:12201/udp"
    environment:
      LS_JAVA_OPTS: "-Xmx256m -Xms256m"
    depends_on:
      - elasticsearch
    networks:
      - app-network

  kibana:
    build:
      context: ./kibana
      dockerfile: Dockerfile
      args:
        ELK_VERSION: $ELK_VERSION
    image: docker_kibana/kibana:latest
    volumes:
      - ./kibana/kibana.yml:/usr/share/kibana/config/kibana.yml
      - ./kibana/kibana.ndjson:/usr/share/kibana/config/kibana.ndjson
    ports:
      - "5601:5601"
    depends_on:
    - elasticsearch
    networks:
      - app-network

  kafka-zookeeper:
    build:
      context: ./kafka-zookeeper
      dockerfile: Dockerfile
    image: docker_kafka-zookeeper/zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    networks:
      - app-network

  kafka-broker:
    build:
      context: ./kafka-broker
      dockerfile: Dockerfile
    image: docker_kafka-broker/broker:latest
    depends_on:
      - kafka-zookeeper
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: 'kafka-zookeeper:2181'
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_INTERNAL:PLAINTEXT
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka-broker:9092,PLAINTEXT_INTERNAL://kafka-broker:29092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: 1
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: 1
    networks:
      - app-network

volumes:
  jenkins_home:

networks:
  app-network:
    driver: bridge



    #!/bin/bash

# sudo chmod +x cleanAndStartDocker.sh
# sudo ./cleanAndStartDocker.sh
echo "=== Removing all Docker containers ==="

# Remove all Docker containers
docker ps -aq | xargs -r docker rm -f

# Remove all Docker images
docker images -q | xargs -r docker rmi -f

# Remove all Docker volumes
docker volume ls -q | xargs -r docker volume rm

# Rebuild and start using Docker Compose
docker-compose build
docker-compose up




FROM neo4j:latest

COPY ./init-db.cypher init-db.cypher
COPY ./init-db.sh init-db.sh

RUN chmod +x init-db.sh

EXPOSE 7474 7473 7687




#!/bin/bash

echo "Setting initial password..."
neo4j-admin dbms set-initial-password Admin123

/var/lib/neo4j/bin/neo4j start

sleep 10

bin/cypher-shell -u neo4j -p Admin123 < init-db.cypher

tail -f /var/lib/neo4j/logs/neo4j.log
































# Air-Book-backend

## Getting started

To make it easy for you to get started with GitLab, here's a list of recommended next steps.

Already a pro? Just edit this README.md and make it your own. Want to make it easy? [Use the template at the bottom](#editing-this-readme)!

## Add your files

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://docs.gitlab.com/topics/git/add_files/#add-files-to-a-git-repository) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://gitlab.com/personal3063150/air-book-backend.git
git branch -M main
git push -uf origin main
```

## Integrate with your tools

- [ ] [Set up project integrations](https://gitlab.com/personal3063150/air-book-backend/-/settings/integrations)

## Collaborate with your team

- [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
- [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
- [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
- [ ] [Set auto-merge](https://docs.gitlab.com/user/project/merge_requests/auto_merge/)

## Test and Deploy

Use the built-in continuous integration in GitLab.

- [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/)
- [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing (SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
- [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
- [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
- [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

---

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thanks to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README

Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name

Choose a self-explaining name for your project.

## Description

Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges

On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals

Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation

Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage

Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support

Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap

If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing

State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment

Show your appreciation to those who have contributed to the project.

## License

For open source projects, say how it is licensed.

## Project status

If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
