# governai-core

Evidence-driven AI governance, risk assessment, control mapping, and security platform for trustworthy AI systems.

## Backend configuration

The Spring Boot backend uses separate profiles for local development and production.

### Local development

Local PostgreSQL runs in Docker and is exposed on port `5433`.

Use the `local` profile:

```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

The local profile uses:

- Host: `localhost`
- Port: `5433`
- Database: `governai`
- Username: `postgres`
- Password: `postgres`

These settings are stored in `backend/src/main/resources/application-local.properties`.

### Production / Render

Use the `prod` profile in Render:

```bash
java -jar app.jar --spring.profiles.active=prod
```

The production profile reads database connection values from environment variables:

```text
DATABASE_HOST
DATABASE_PORT
DATABASE_NAME
DATABASE_USERNAME
DATABASE_PASSWORD
```

Set these values in the Render service environment. **Do not commit production credentials to GitHub.** The production connection uses `sslmode=require`.

### Configuration files

```text
backend/src/main/resources/
├── application.yml                 # Common application settings
├── application-local.properties    # Local Docker PostgreSQL
└── application-prod.properties     # Render/production PostgreSQL
```

The database schema remains managed by Flyway, and Hibernate uses `ddl-auto=validate` in both environments.
