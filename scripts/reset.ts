import "dotenv/config";

import { client, db } from "@/db/drizzle"

import * as schema from "../db/schema";



(async () => {
  try {
    console.log("Resetting the db");

    await db.delete(schema.courses);
    await db.delete(schema.userProgress);
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challengeProgress);
    await db.delete(schema.challenges);
    await db.delete(schema.units);
    await db.delete(schema.lessons);

    console.log("Resetting finished");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to Reset the database");
  }
})();