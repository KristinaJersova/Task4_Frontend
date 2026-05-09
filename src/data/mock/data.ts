import { faker } from "@faker-js/faker";
import { Book } from "../../models/books.model";
import { Author } from "../../models/author.model";
import { Publisher } from "../../models/publisher.model";
import { Review } from "../../models/review.model";
import { Genre } from "../../models/genre.model";

function generateGenre(id: number): Genre {
  return {
    id,
    name: faker.book.genre()
  };
}

function generatePublisher(id: number): Publisher {
  return {
    id,
    name: faker.company.name(),
    country: faker.location.country(),
    foundedYear: faker.number.int({ min: 1900, max: 2020 }),
    website: faker.internet.url(),
    createdAt: faker.date.past()
  };
}

function generateAuthor(id: number): Author {
  return {
    id,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    birthYear: faker.number.int({ min: 1940, max: 2000 }),
    nationality: faker.location.country(),
    biography: faker.lorem.paragraph(),
    createdAt: faker.date.past()
  };
}

function generateBook(id: number,authors: Author[],publishers: Publisher[],genres: Genre[]): Book {
  return {
    id,
    title: faker.book.title(),
    isbn: faker.commerce.isbn(),
    publishedYear: faker.number.int({ min: 1980, max: 2024 }),
    pageCount: faker.number.int({ min: 100, max: 900 }),
    language: faker.location.language().name,
    description: faker.lorem.paragraph(),
    coverImage: faker.image.urlLoremFlickr({ category: "book" }),
    authorId: faker.helpers.arrayElement(authors).id,
    publisherId: faker.helpers.arrayElement(publishers).id,

    genres: faker.helpers.arrayElements(
      genres.map(g => g.id),
      { min: 1, max: 3 }
    ),

    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  };
}

function generateReview(id: number, books: Book[]): Review {
  return {
    id,
    bookId: faker.helpers.arrayElement(books).id,
    userName: faker.internet.username(),
    rating: faker.number.int({ min: 1, max: 5 }),
    comment: faker.lorem.sentence(),
    createdAt: faker.date.recent()
  };
}

function generateArray<T>(count: number,factory: (index: number) => T): T[] {
  return Array.from({ length: count }, (_, i) => factory(i + 1));
}

function generateSeededData(seed = 42) {
  faker.seed(seed);

  const genres = generateArray(6, generateGenre);
  const publishers = generateArray(4, generatePublisher);
  const authors = generateArray(6, generateAuthor);

  const books = generateArray(15, (i) =>
    generateBook(i, authors, publishers, genres)
  );

  const reviews = generateArray(20, (i) =>
    generateReview(i, books)
  );

  faker.seed();

  return { genres, publishers, authors, books, reviews };
}

const data = generateSeededData();

export const genres: Genre[] = data.genres;
export const publishers: Publisher[] = data.publishers;
export const authors: Author[] = data.authors;
export const books: Book[] = data.books;
export const reviews: Review[] = data.reviews;