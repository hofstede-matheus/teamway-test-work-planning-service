# teamway-test-work-planning-service

## Configure

```bash
# only when not running via docker-compose

cp .env.example .env
cp .env.test.example .env.test

# change: DATABASE_HOST=postgres
# to    : DATABASE_HOST=localhost

# change:
# MONGODB_CONNECTION_STRING=mongodb://teamway-test-work-planning-service:teamway-test-work-planning-service@mongo:27017/?authMechanism=DEFAULT

# to:
# MONGODB_CONNECTION_STRING=mongodb://teamway-test-work-planning-service:teamway-test-work-planning-service@localhost:27017/?authMechanism=DEFAULT

npm ci
```

## Run

```bash
docker-compose up --build
```

or

```bash
docker-compose up postgres mongo
npm run start:dev
```

## Tests

```bash
# all tests
$ npm run test

# unit tests
$ npm run test:unit

# integration tests
$ npm run test:integration
```

## Swagger Docs

<http:localhost:3001/docs>

## OpenAPI Spec

<http://localhost:3003/docs-json>

<br>
<br>

# Architecture

## Framework:

Nest.js Monolith
<br>
<br>

## Database

- PostgreSQL 15
- MongoDB 6

By default, the api uses a Postgres database managed by TypeORM, but via dependency injection, a MongoDB with Mongoose can be used, thus it is respecting the domain repository contract. The same behavior is ensured by integration tests.
<br>
Example in `Data (src/data)` section.

<br>

### PostgreSQL Schema

![PostgreSQL schema](https://i.imgur.com/e1FSyX4.jpg)

### MongoDB Documents

#### WorkDay

![WorkDay Schema](https://i.imgur.com/5mvkKIb.jpg)

#### Worker

![Worker Schema](https://i.imgur.com/IhShs4O.jpg)
<br>
<br>

## Infra

The app Docker image is built using Google Cloud Build and deployed to Cloud Run. Serverless was chosen because this is a simple teste project, but in a real-world project Kubernates Engine could be used.
<br>
In the dev environment, the databases are initialized using the docker-compose file.
<br>
In the prod (sample deploy), the Postgres database is hosted in [Neon Serverless Postgres](https://neon.tech/) and the MongoDB database is hosted in [MongoDB Atlas](https://www.mongodb.com/atlas/database).
<br>
<br>

## Authentication/Authorization

No Authentication/Authorization is implemented to be straight to the point. But if this was a requirement, JWT (Bearer Auth) and some internal Authorization logic was going to be implemented.

<br>
<br>

# Components

## Domain (src/domain)

The heart of the application. Defines the business logic of the app. It has no depedencies from external components.
<br>
<br>

## Presentation (src/presentation/http)

Handles HTTP logic with the built-in Nest.js HTTP Controllers
<br>

Controllers are independent from business logic and other infra choises as databases.
Implementing a gRPC \ GraphQL \ Redis input is easy as implementing a new class.
<br>
<br>

## Usecases (src/interactors/usecases)

Handles the application business rules and orchestrates the domain entities.
Depedencies from datasources (databases) are inverted by using domain repositories to fetch data.
<br>
<br>

## Data (src/data)

Implements the external dependencies, such as databases and external services.
In this project both MongoDBRepository and TypeOrmRepository implements domain interfaces, and changing the database is simple as changing:

```
{
      provide: ShiftRepository,
      useClass: MongoDBShiftsRepository,
},
```

in `shifts.module.ts``, and

```
{
      provide: WorkerRepository,
      useClass: MongoDBWorkersRepository,
},
```

in `workers.module.ts``.
<br>
<br>

# Tests

This project has two types of tests:
<br>

## Usecase tests:

Tests both happy paths vs error paths. The business logic is tested exhaustively in this layer to protect behavior. Dependencies are mocked.

<br>

## Integration tests:

Tests only the happy path, and some more critical flows. Uses a test database.
<br>
<br>

# Error handing

Domain errors are returned from usecases and handled in the presentation layer, then returned to the use with its respective HTTP code and message.
<br>
<br>

# API versioning

API versioning is handled by the controller and when a breaking change is introduced, the developer should create a new `v*` folder.
<br>
<br>
<br>

# Sample endpoint

<https://teamway-test-work-planning-service-xgegrjixaa-uc.a.run.app/>
