# Task 3. REST API ja Books

# RESTful API — raamatukogu infosüsteem
- Arendada RESTful API kahes etapis: mock andmetega ja PostgreSQL andmebaasiga

## 1. Tehnoloogiad
- TypeScript
- Express.js
- Zod validation
- In-memory andmehoidla
- Prisma
- PostgreSQL
- GitHub
- Thunder

## 2. Mock Data
- Raamatud - 15
- Autorid	- 6
- Kirjastused	- 4
- Arvustused - 20
- Žanrid - 6

## 3. Koodistruktuur
- src/models/ - (author.model.ts, books.model.ts, genre.model.ts, publisher.model.ts, review.model.ts)
- src/data/	- (data.ts)
- src/services/	- (books.service.ts)
- src/validators/	- (zod.ts)
- src/middleware/	- (errors.ts)
- src/express/routes/	- (book.routes.ts)
- prisma/	- (migration, seed.ts, schema.prisma)

## 4. Setup
1. Projekti kloonimine GitHubist
- git clone <repo-url>
- cd <project-folder>
2. Sõltuvuste install
- npm install
3. Environment variables
- Loo .env fail (kui seda pole) ja lisa vajalikud muutujad, näiteks:
- DATABASE_URL="your_database_url"
- PORT=3000
4. Prisma seadistamine
- npx prisma generate
- npx prisma migrate dev
- npx prisma db seed
5. Serveri käivitamine
- npm run dev
- Server töötab:
- http://localhost:3000
6. API testimine
- Kasuta Thunder Client VS codes
- GET http://localhost:3000/api/v1/books

## 5. Endpoint'id
- GET http://localhost:3000/api/v1/books
    RESPONSE
    All books
- GET http://localhost:3000/api/v1/books/74
- GET  http://localhost:3000/api/v1/books/74/reviews 
- GET http://localhost:3000/api/v1/books/74/average-rating 
- POST http://localhost:3000/api/v1/books/74/reviews
    REQUEST 
{
  "userName": "John",
  "rating": 5,
  "comment": "Great!"
}
- GET http://localhost:3000/api/v1/books?year=2020
- GET http://localhost:3000/api/v1/books?language=Portuguese
- GET http://localhost:3000/api/v1/books?sortBy=title
- GET http://localhost:3000/api/v1/books?sortBy=title&order=desc (or asc)
- GET http://localhost:3000/api/v1/books?page=3&limit=2
- POST http://localhost:3000/api/v1/books
    REQUEST
    BODY - JSON
   {
  "title": "Test Book",
  "isbn": "1234567890",
  "publishedYear": 2023,
  "pageCount": 200,
  "language": "English",
  "description": "Test",
  "authorId": 25,
  "publisherId": 17
}
    RESPONSE
{
  "id": 78,
  "title": "Test Book",
  "isbn": "1234567890",
  "publishedYear": 2023,
  "pageCount": 200,
  "language": "English",
  "description": "Test",
  "coverImage": null,
  "authorId": 25,
  "publisherId": 17,
  "createdAt": "2026-04-01T17:55:38.794Z",
  "updatedAt": "2026-04-01T17:55:38.794Z",
  "author": {
    "id": 25,
    "firstName": "Clotilde",
    "lastName": "Quigley",
    "birthYear": 1984,
    "nationality": "Samoa",
    "biography": "Contego ancilla urbanus. Comptus adversus colo communis suspendo repellendus valens. Animadverto summisse temptatio laudantium tepidus depulso.",
    "createdAt": "2026-04-01T17:16:43.565Z"
  },
  "publisher": {
    "id": 17,
    "name": "Quigley - Sipes-Effertz",
    "country": "China",
    "foundedYear": 1922,
    "website": "https://monstrous-hose.com/",
    "createdAt": "2026-04-01T17:16:43.955Z"
  },
  "genres": []
}
- PUT http://localhost:3000/api/v1/books/78
    REQUEST
{
  "title": "Updated Book"
}
    RESPONSE
{
  "id": 78,
  "title": "Updated Book",
  "isbn": "1234567890",
  "publishedYear": 2023,
  "pageCount": 200,
  "language": "English",
  "description": "Test",
  "coverImage": null,
  "authorId": 25,
  "publisherId": 17,
  "createdAt": "2026-04-01T17:55:38.794Z",
  "updatedAt": "2026-04-01T17:56:34.303Z",
  "author": {
    "id": 25,
    "firstName": "Clotilde",
    "lastName": "Quigley",
    "birthYear": 1984,
    "nationality": "Samoa",
    "biography": "Contego ancilla urbanus. Comptus adversus colo communis suspendo repellendus valens. Animadverto summisse temptatio laudantium tepidus depulso.",
    "createdAt": "2026-04-01T17:16:43.565Z"
  },
  "publisher": {
    "id": 17,
    "name": "Quigley - Sipes-Effertz",
    "country": "China",
    "foundedYear": 1922,
    "website": "https://monstrous-hose.com/",
    "createdAt": "2026-04-01T17:16:43.955Z"
  },
  "genres": []
}
- DELETE http://localhost:3000/api/v1/books/78
    RESPONSE
1
Status: 204 No Content
Size: 0 Bytes
Time: 389 ms

## Näide
- RESPONSE
{
  "id": 74,
  "title": "A Brief History of Time",
  "isbn": "978-1-191-40955-1",
  "publishedYear": 1983,
  "pageCount": 700,
  "language": "French",
  "description": "Bardus aufero adfectus demens maiores aedificium terga defessus error decet. Laborum armarium attonbitus universe vindico corroboro. Sequi cunabula acies armarium sumptus.",
  "coverImage": "https://loremflickr.com/2636/109/book?lock=1999347491535709",
  "authorId": 26,
  "publisherId": 19,
  "createdAt": "2026-04-01T17:16:47.439Z",
  "updatedAt": "2026-04-01T17:16:47.439Z",
  "author": {
    "id": 26,
    "firstName": "Bobbie",
    "lastName": "Haley",
    "birthYear": 1971,
    "nationality": "Trinidad and Tobago",
    "biography": "Cunae temeritas calco aestus. Arx vetus titulus recusandae ut. Audentia vapulus fugit timor vel cometes amo calcar curso.",
    "createdAt": "2026-04-01T17:16:43.632Z"
  },
  "publisher": {
    "id": 19,
    "name": "Paucek, Kunze and Gerlach",
    "country": "North Macedonia",
    "foundedYear": 1937,
    "website": "https://negative-contrail.org",
    "createdAt": "2026-04-01T17:16:44.082Z"
  },
  "genres": [
    {
      "id": 182,
      "bookId": 74,
      "genreId": 25,
      "genre": {
        "id": 25,
        "name": "Fantasy"
      }
    }
  ],
  "reviews": [
    {
      "id": 82,
      "bookId": 74,
      "userName": "Madisyn.Johnston51",
      "rating": 1,
      "comment": "Agnitio pax cariosus creta civitas constans super clibanus.",
      "createdAt": "2026-04-01T17:16:48.110Z"
    },
    {
      "id": 93,
      "bookId": 74,
      "userName": "Ronnie81",
      "rating": 3,
      "comment": "Cito provident vomica.",
      "createdAt": "2026-04-01T17:16:49.286Z"
    },
    {
      "id": 97,
      "bookId": 74,
      "userName": "Amelia.Stracke96",
      "rating": 5,
      "comment": "Tepidus tutamen temptatio quidem apostolus adduco verumtamen provident theca.",
      "createdAt": "2026-04-01T17:16:49.732Z"
    },
    {
      "id": 101,
      "bookId": 74,
      "userName": "John",
      "rating": 5,
      "comment": "Great!",
      "createdAt": "2026-04-01T17:32:15.412Z"
    }
  ]
}

## Täiendavad käsud:
- npm install
- npx prisma generate
- npm install -D ts-node typescript
- npx ts-node prisma/seed.ts or npx tsx prisma/seed.ts
- npx prisma studio
- npm run dev
- npx prisma db seed
- npm prisma db push
