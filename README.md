# kuepc-backend / Kūʻē Petition directory

Index dataset of signers of the Kūʻē Petition. ✊🏽📜

There is a Hasura/PostgreSQL backend app which parsed a CSV format and loaded it into a Hasura graphql engine.
https://github.com/hawaiiansintech/kuepc-backend

Now that its available, there could be a front-end lookup tool for querying it by name, etc. and returning page/island/district data. That data could be used to point to the actual pages of the petition. We still need a page number map to available images, but at least the island/district and line numbers are clear. 

The data could also be used to create links in the genealogy interface to specific names on the Kūʻē petition.
- [Hasura](https://hasura.io/) setup w/PostgreSQL migrations
- [Node.js](https://nodejs.org/) [TypeScript](https://www.typescriptlang.org/) example graphql query lookup by name. 

# install

Requires NodeJS v16+

```
git clone git@github.com:hawaiiansintech/kuepc-backend.git
cd ./kuepc-backend
npm install
cp .env.example .env
```

Set the endpoint in .env
`HASURA_GRAPHQL_ENDPOINT=https://{hostingprovider}/v1/graphql`

try:
`npm run name 'Aalona'`

# database schema

```
CREATE TABLE public.petitioner (
    pet_id integer NOT NULL,
    family_name text NULL,
    given_name text NULL,
    prefix text NULL,
    age text NULL,
    page text NULL,
    line text NULL,
    island text NULL,
    district text NULL,
    gender text NULL,
    create_timestamp timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

# Usage

`npm run load ../kuepetition/Kue-Petition-All-Islands.csv`

# load to hasura graphql database .env file entries

```
HASURA_GRAPHQL_ENDPOINT=https://something/v1/graphql
HASURA_GRAPHQL_ADMIN_SECRET=notmysecret
```

# Hasura / graphql examples

```
query get_petitioner_all($family_name:String!) {
  petitioner(where: {family_name: {_eq: $family_name}}) {
    pet_id
    family_name
    given_name
    prefix
    gender
    age
    island
    district
    page
    line
    create_timestamp
  }
}
```

parameters:

```
{"family_name": "Kaililikeole"}
```

result:

```
{
  "data": {
    "petitioner": [
      {
        "pet_id": 14520,
        "family_name": "Kaililikeole",
        "given_name": "W. L.",
        "prefix": "",
        "gender": "Men",
        "age": "11",
        "island": "Hawaii",
        "district": "North Kohala",
        "page": "119",
        "line": "5",
        "create_timestamp": "2022-07-22T20:13:37.302+00:00"
      }
    ]
  }
}
```

## graphql simple query example - command line

This will take a single text parameter, and query the graphql endpoint, using a 
query trying to exact match by given_name or family_name. 

```
npm run name "Alo"
```

result:
```
{
  petitioner: [
    {
      age: '22',
      district: 'Lahaina',
      family_name: 'Alo',
      gender: 'Women',
      given_name: 'Maria',
      island: 'Maui',
      line: '14',
      page: '177',
      prefix: ''
    },
    {
      age: '36',
      district: 'Wailuku',
      family_name: 'Alo',
      gender: 'Women',
      given_name: 'Keopuhiwa',
      island: 'Maui',
      line: '39',
      page: '189',
      prefix: ''
    },
    {
      age: '15',
      district: 'Lahaina',
      family_name: 'Alo',
      gender: 'Women',
      given_name: 'Amoe',
      island: 'Maui',
      line: '5',
      page: '179',
      prefix: 'Miss'
    },
    {
      age: '41',
      district: 'Lahaina',
      family_name: 'Alo',
      gender: 'Women',
      given_name: 'Kapela',
      island: 'Maui',
      line: '11',
      page: '177',
      prefix: 'Mrs'
    },
    {
      age: '40',
      district: 'Makawao',
      family_name: 'Alo',
      gender: 'Women',
      given_name: 'M.',
      island: 'Maui',
      line: '5',
      page: '207',
      prefix: 'Mrs'
    },
    {
      age: '17',
      district: 'Lahaina',
      family_name: 'Alo',
      gender: 'Women',
      given_name: 'Victoria',
      island: 'Maui',
      line: '10',
      page: '177',
      prefix: 'Miss'
    },
    {
      age: '23',
      district: 'Lahaina',
      family_name: 'Alo',
      gender: 'Women',
      given_name: 'Alana',
      island: 'Maui',
      line: '6',
      page: '179',
      prefix: 'Miss'
    },
    {
      age: '17',
      district: 'Makawao',
      family_name: 'Alo',
      gender: 'Women',
      given_name: 'Amoe',
      island: 'Maui',
      line: '6',
      page: '207',
      prefix: ''
    }
  ]
}
```

## Hasura + postgresql on docker

https://hasura.io/docs/latest/graphql/core/deployment/deployment-guides/docker/

quickstart:

```
cd ./hasura-docker
{edit .env}
{edit docker-compose.yml}
docker-compose up -d
docker ps
```

Then you can connect to localhost:port for the Hasura endpoint as well as the postgresql you configured.

The .env under ./hasura-docker can look like this:

```
HASURA_GRAPHQL_METADATA_DATABASE_URL=postgres://postgres:postgrespassword@postgres:5432/postgres
PG_DATABASE_URL=postgres://postgres:postgrespassword@postgres:5432/postgres
HASURA_GRAPHQL_ADMIN_SECRET=gottokeepasecret
JWT_SECRET_KEY=sharedsecretwithyourauthenticationprovider
HASURA_GRAPHQL_JWT_SECRET='{"type":"HS256", "key": "sharedsecretwithyourauthenticationprovider"}'
```

## deploy to docker swarm

This command will deploy to your local docker swarm stack, and process the .env file to the compose yml.

```
cd ./hasura-docker
docker stack deploy -c <(docker-compose config) kuepc
docker service ls
```

## Hasura migrations and metadata

Reference: [Hasura Migrations & Metadata (CI/CD)](https://hasura.io/docs/latest/graphql/core/migrations/index/)

creating new database schema, by applying all migrations

```
cd ./hasura
hasura migrate --endpoint https://your.hasura.endpoint --admin-secret yoursecret  --database-name default status
hasura migrate --endpoint https://your.hasura.endpoint --admin-secret yoursecret  --database-name default apply
```

apply only 2 migrations

```
hasura migrate --endpoint https://your.hasura.endpoint --admin-secret yoursecret  --database-name default apply --up 2
```

rollback 2 migrations

```
hasura migrate --endpoint https://your.hasura.endpoint --admin-secret yoursecret  --database-name default apply --down 2
```

apply metadata from files to hasura instance (after viewing diff)

```
hasura metadata --endpoint https://your.hasura.endpoint --admin-secret yoursecret diff
hasura metadata --endpoint https://your.hasura.endpoint --admin-secret yoursecret apply
```

## Other

generate 64 char string, useful to make a new jwt secret

`< /dev/urandom tr -dc \_A-Z-a-z-0-9 | head -c${1:-64};echo;`

# Notes

the scanned pages are available online:
- https://libweb.hawaii.edu//digicoll/annexation/petition.php

The page numbers may not match. 

