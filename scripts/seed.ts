import { client, db } from "@/db/drizzle"
import "dotenv/config"
import { drizzle } from "drizzle-orm/postgres-js"
import * as schema from "../db/schema"


const main = async () => {
  try {
    console.log("Seeding database");

    await db.delete(schema.courses);
    await db.delete(schema.userProgress);

    await db.insert(schema.courses).values([
      {
        id: 1,
        title: "Spanish",
        imageSrc: "/es.svg",
      },
      {
        id: 2,
        title: "Italian",
        imageSrc: "/it.svg",
      },
      {
        id: 3,
        title: "French",
        imageSrc: "/fr.svg",
      },
      {
        id: 4,
        title: "Croatian",
        imageSrc: "/hr.svg",
      },
    ]);

    console.log("Seeding finished")

  } catch (error) {
      console.error(error);
      throw new Error("Failed to seed the database")
  }
};

main()