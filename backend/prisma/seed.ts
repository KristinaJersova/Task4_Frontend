import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { authors, books, genres, publishers, reviews } from "../src/data/mock/data";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
    adapter: new PrismaPg({
        connectionString: process.env.DATABASE_URL as string,
    }),
});

async function main() {
  console.log("Seeding...");

  await prisma.review.deleteMany();
  await prisma.bookGenre.deleteMany();
  await prisma.book.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.author.deleteMany();
  await prisma.publisher.deleteMany();

  const authorMap = new Map<number, number>();
  const publisherMap = new Map<number, number>();
  const genreMap = new Map<number, number>();
  const bookMap = new Map<number, number>();

  // Создаем авторов
  for (const a of authors) {
    const created = await prisma.author.create({
      data: {
        firstName: a.firstName,
        lastName: a.lastName,
        birthYear: a.birthYear,
        nationality: a.nationality,
        biography: a.biography || "",
      },
    });

    authorMap.set(a.id, created.id);
  }

  for (const p of publishers) {
    const created = await prisma.publisher.create({
      data: {
        name: p.name,
        country: p.country,
        foundedYear: p.foundedYear,
        website: p.website,
      },
    });

    publisherMap.set(p.id, created.id);
  }

  for (const g of genres) {
    const created = await prisma.genre.create({
      data: { name: g.name },
    });

    genreMap.set(g.id, created.id);
  }

  for (const b of books) {
    const created = await prisma.book.create({
      data: {
        title: b.title,
        isbn: b.isbn,
        publishedYear: b.publishedYear,
        pageCount: b.pageCount,
        language: b.language,
        description: b.description,
        coverImage: b.coverImage,
        authorId: authorMap.get(b.authorId)!,  // Связываем с автором
        publisherId: publisherMap.get(b.publisherId)!,
      },
    });

    bookMap.set(b.id, created.id);

    await prisma.bookGenre.createMany({
      data: b.genres.map((gid) => ({
        bookId: created.id,
        genreId: genreMap.get(gid)!,
      })),
    });
  }

  for (const r of reviews) {
    await prisma.review.create({
      data: {
        userName: r.userName,
        rating: r.rating,
        comment: r.comment,
        bookId: bookMap.get(r.bookId)!,
      },
    });
  }

  console.log("Done seeding.");
}

main()
  .catch((error) => {
    console.error("Error during seeding:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });