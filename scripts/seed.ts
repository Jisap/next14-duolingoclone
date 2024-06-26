import "dotenv/config"
import { drizzle } from "drizzle-orm/postgres-js"
import { client, db } from "@/db/drizzle"
import * as schema from "../db/schema"
import { dataToInsert } from "@/constants.ts";


const main = async () => {
  try {
    console.log("Seeding database");

    await db.delete(schema.courses);
    await db.delete(schema.userProgress);
    await db.delete(schema.units);
    await db.delete(schema.lessons);
    await db.delete(schema.challenges);
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challengeProgress);
    await db.delete(schema.userSubscription);

    // await db.insert(schema.courses).values([
    //   {
    //     id: 1,
    //     title: "Spanish",
    //     imageSrc: "/es.svg",
    //   },
    //   {
    //     id: 2,
    //     title: "Italian",
    //     imageSrc: "/it.svg",
    //   },
    //   {
    //     id: 3,
    //     title: "French",
    //     imageSrc: "/fr.svg",
    //   },
    //   {
    //     id: 4,
    //     title: "Croatian",
    //     imageSrc: "/hr.svg",
    //   },
    // ]);
    await db.insert(schema.courses).values(dataToInsert.languages);
    

    // await db.insert(schema.units).values([
    //   {
    //     id: 1,
    //     courseId: 1, // Spanish
    //     title: "Unit 1",
    //     description: "Learn the basics of Spanish",
    //     order: 1,
    //   }
    // ]);
    await db.insert(schema.units).values(dataToInsert.units);

    // await db.insert(schema.lessons).values([
    //   {
    //     id: 1,
    //     unitId: 1, // Unit 1 (Learn the basics...)
    //     order: 1,
    //     title: "Nouns",
    //   },
    //   {
    //     id: 2,
    //     unitId: 1, // Unit 1 (Learn the basics...)
    //     order: 2,
    //     title: "Verbs",
    //   },
    //   {
    //     id: 3,
    //     unitId: 1, // Unit 1 (Learn the basics...)
    //     order: 3,
    //     title: "Verbs",
    //   },
    //   {
    //     id: 4,
    //     unitId: 1, // Unit 1 (Learn the basics...)
    //     order: 4,
    //     title: "Verbs",
    //   },
    //   {
    //     id: 5,
    //     unitId: 1, // Unit 1 (Learn the basics...)
    //     order: 5,
    //     title: "Verbs",
    //   },
    // ]);
    await db.insert(schema.lessons).values(dataToInsert.lessons);

    // await db.insert(schema.challenges).values([ // Retos de la lección 1
    //   {
    //     id: 1,
    //     lessonId: 1, // Nouns
    //     type: "SELECT",
    //     order: 1,
    //     question: 'Which one of these is the "the man"?', // Pregunta
    //   },
    //   {
    //     id: 2,
    //     lessonId: 1, // Nouns
    //     type: "ASSIST",
    //     order: 2,
    //     question: '"the man"',
    //   },
    //   {
    //     id: 3,
    //     lessonId: 1, // Nouns
    //     type: "SELECT",
    //     order: 3,
    //     question: 'Which one of these is the "the robot"?',
    //   },
    // ]);
    await db.insert(schema.challenges).values(dataToInsert.challenges as any);

    // await db.insert(schema.challengeOptions).values([   // opciones de resultado del reto n1 de la lección 1
    //   {
    //     challengeId: 1, // Which one of these is "the man"? 
    //     imageSrc: "/man.svg",
    //     correct: true,
    //     text: "el hombre",
    //     audioSrc: "/es_man.mp3",
    //   },
    //   {
    //     challengeId: 1,
    //     imageSrc: "/woman.svg",
    //     correct: false,
    //     text: "la mujer",
    //     audioSrc: "/es_woman.mp3",
    //   },
    //   {
    //     challengeId: 1,
    //     imageSrc: "/robot.svg",
    //     correct: false,
    //     text: "el robot",
    //     audioSrc: "/es_robot.mp3",
    //   },
    // ]);

    // await db.insert(schema.challengeOptions).values([ // opciones de resultado para el reto nº2 de la lección 1
    //   {
    //     challengeId: 2, // "the man"?
    //     correct: true,
    //     text: "el hombre",
    //     audioSrc: "/es_man.mp3",
    //   },
    //   {
    //     challengeId: 2,
    //     correct: false,
    //     text: "la mujer",
    //     audioSrc: "/es_woman.mp3",
    //   },
    //   {
    //     challengeId: 2,
    //     correct: false,
    //     text: "el robot",
    //     audioSrc: "/es_robot.mp3",
    //   },
    // ]);

    // await db.insert(schema.challengeOptions).values([ // opciones de resultado para el reto nº3 de la lección 1
    //   {
    //     challengeId: 3, // Which one of these is the "the robot"?
    //     imageSrc: "/man.svg",
    //     correct: false,
    //     text: "el hombre",
    //     audioSrc: "/es_man.mp3",
    //   },
    //   {
    //     challengeId: 3,
    //     imageSrc: "/woman.svg",
    //     correct: false,
    //     text: "la mujer",
    //     audioSrc: "/es_woman.mp3",
    //   },
    //   {
    //     challengeId: 3,
    //     imageSrc: "/robot.svg",
    //     correct: true,
    //     text: "el robot",
    //     audioSrc: "/es_robot.mp3",
    //   },
    // ]);

    // await db.insert(schema.challenges).values([ // retos para la lección 2
    //   {
    //     id: 4,
    //     lessonId: 2, // Verbs
    //     type: "SELECT",
    //     order: 1,
    //     question: 'Which one of these is the "the man"?',
    //   },
    //   {
    //     id: 5,
    //     lessonId: 2, // Verbs
    //     type: "ASSIST",
    //     order: 2,
    //     question: '"the man"',
    //   },
    //   {
    //     id: 6,
    //     lessonId: 2, // Verbs
    //     type: "SELECT",
    //     order: 3,
    //     question: 'Which one of these is the "the robot"?',
    //   },
    // ]);
    await db.insert(schema.challengeOptions).values(dataToInsert.challengeOptions);

    console.log("Seeding finished")

  } catch (error) {
      console.error(error);
      throw new Error("Failed to seed the database")
  }
};

main()