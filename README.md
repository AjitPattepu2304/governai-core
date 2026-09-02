# governai-core

Evidence-driven AI governance, risk assessment, control mapping, and security platform for trustworthy AI systems.

## Backend configuration

The Spring Boot backend uses separate profiles for local development and production.

### Local development

Local PostgreSQL runs in Docker and is exposed on port `5433`.

Create this file outside Git tracking:

```text
secrets/application-local.properties
```

Example contents:

```properties
DATABASE_HOST=localhost
DATABASE_PORT=5433
DATABASE_NAME=governai
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your-local-password
```

The repository ignores the entire `secrets/` directory. Never commit credentials from this directory.

Start the backend with:

```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

The local profile imports the external secrets file and uses the values as Spring datasource properties.

### Production / Render

Render should provide these database environment variables through the service environment:

```text
DATABASE_HOST
DATABASE_PORT
DATABASE_NAME
DATABASE_USERNAME
DATABASE_PASSWORD
```

Do not commit production credentials to GitHub. The production profile uses the Render database connection with `sslmode=require` and secure cross-origin session cookies.

Start the production application with:

```bash
java -jar app.jar --spring.profiles.active=prod
```

### Configuration files

```text
backend/src/main/resources/
├── application.yml                 # Common application settings
├── application-local.properties    # Local profile; imports ../secrets/application-local.properties
└── application-prod.properties     # Render/production PostgreSQL

secrets/
└── application-local.properties    # Local credentials; ignored by Git
```

The database schema remains managed by Flyway, and Hibernate uses `ddl-auto=validate` in both environments.
