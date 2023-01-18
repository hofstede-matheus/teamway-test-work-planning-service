# teamway-test-work-planning-service

## How to configure

```bash
# only need when not running via docker-compose

cp .env.example .env
cp .env.test.example .env.test
npm ci
```

## Run

```bash
docker-compose up --build
```

ou

```bash
docker-compose up db
npm run start:dev
```

## Documentação swagger

<http:localhost:3001/docs>

## Teste

```bash
# all tests
$ npm run test

# unit tests
$ npm run test:unit

# integration tests
$ npm run test:integration

# test coverage
$ npm run test:cov
```
