import "dotenv/config"

import { db } from "@/db/drizzle"
import * as schema from "../db/schema"
import { dataToInsert } from "../constants.ts";


(async () => {
  try {
    console.log("Preparing database for production");

    // Delete all existing data
    await Promise.all([
      db.delete(schema.userProgress),
      db.delete(schema.challenges),
      db.delete(schema.units),
      db.delete(schema.lessons),
      db.delete(schema.courses),
      db.delete(schema.challengeOptions),
      db.delete(schema.userSubscription),
    ]);

    // Insert courses
    const courses = await db
      .insert(schema.courses)
      .values(dataToInsert.languages)
      .returning();

    // For each course, insert units
    for (const course of courses) {
      const units = await db
        .insert(schema.units)
        .values([
          {
            courseId: course.id,
            title: "Unit 1",
            description: `Learn the basics of ${course.title}`,
            order: 1,
          },
          {
            courseId: course.id,
            title: "Unit 2",
            description: `Learn intermediate ${course.title}`,
            order: 2,
          },
        ])
        .returning();

      // For each unit, insert lessons
      for (const unit of units) {
        const lessons = await db
          .insert(schema.lessons)
          .values([
            { unitId: unit.id, title: "Nouns", order: 1 },
            { unitId: unit.id, title: "Verbs", order: 2 },
            { unitId: unit.id, title: "Adjectives", order: 3 },
            { unitId: unit.id, title: "Phrases", order: 4 },
            { unitId: unit.id, title: "Sentences", order: 5 },
          ])
          .returning();

        // For each lesson, insert challenges
        for (const lesson of lessons) {
          const challenges = await db
            .insert(schema.challenges)
            .values([
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Which one of these is "the man"?',
                order: 1,
              },
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Which one of these is "the woman"?',
                order: 2,
              },
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Which one of these is "the boy"?',
                order: 3,
              },
              {
                lessonId: lesson.id,
                type: "ASSIST",
                question: '"the man"',
                order: 4,
              },
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Which one of these is "the zombie"?',
                order: 5,
              },
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Which one of these is "the robot"?',
                order: 6,
              },
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Which one of these is "the girl"?',
                order: 7,
              },
              {
                lessonId: lesson.id,
                type: "ASSIST",
                question: '"the zombie"',
                order: 8,
              },
            ])
            .returning();

          // For each challenge, insert challenge options
          for (const challenge of challenges) {
            if (challenge.order === 1) {
              switch (course.title) {
                case "Spanish":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "el hombre",
                      imageSrc: "/man.svg",
                      audioSrc: "/es_man.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "la mujer",
                      imageSrc: "/woman.svg",
                      audioSrc: "/es_woman.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "el chico",
                      imageSrc: "/boy.svg",
                      audioSrc: "/es_boy.mp3",
                    },
                  ]);
                  break;
                case "Japanese":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "その男",
                      imageSrc: "/man.svg",
                      audioSrc: "/jp_man.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "その女",
                      imageSrc: "/woman.svg",
                      audioSrc: "/jp_woman.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "男の子",
                      imageSrc: "/boy.svg",
                      audioSrc: "/jp_boy.mp3",
                    },
                  ]);
                  break;
                case "French":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "l'homme",
                      imageSrc: "/man.svg",
                      audioSrc: "/fr_man.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "la femme",
                      imageSrc: "/woman.svg",
                      audioSrc: "/fr_woman.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "le garçon",
                      imageSrc: "/boy.svg",
                      audioSrc: "/fr_boy.mp3",
                    },
                  ]);
                  break;
                case "Croatian":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "čovjek",
                      imageSrc: "/man.svg",
                      audioSrc: "/hr_man.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "žena",
                      imageSrc: "/woman.svg",
                      audioSrc: "/hr_woman.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "dječak",
                      imageSrc: "/boy.svg",
                      audioSrc: "/hr_boy.mp3",
                    },
                  ]);
                  break;
                case "Italian":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "l'uomo",
                      imageSrc: "/man.svg",
                      audioSrc: "/it_man.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "la donna",
                      imageSrc: "/woman.svg",
                      audioSrc: "/it_woman.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "il ragazzo",
                      imageSrc: "/boy.svg",
                      audioSrc: "/it_boy.mp3",
                    },
                  ]);
                  break;
              }
            }

            if (challenge.order === 2) {
              switch (course.title) {
                case "Spanish":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "la mujer",
                      imageSrc: "/woman.svg",
                      audioSrc: "/es_woman.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "el chico",
                      imageSrc: "/boy.svg",
                      audioSrc: "/es_boy.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "el hombre",
                      imageSrc: "/man.svg",
                      audioSrc: "/es_man.mp3",
                    },
                  ]);
                  break;
                case "Japanese":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "その女",
                      imageSrc: "/woman.svg",
                      audioSrc: "/jp_woman.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "男の子",
                      imageSrc: "/boy.svg",
                      audioSrc: "/jp_boy.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "その男",
                      imageSrc: "/man.svg",
                      audioSrc: "/jp_man.mp3",
                    },
                  ]);
                  break;
                case "French":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "la femme",
                      imageSrc: "/woman.svg",
                      audioSrc: "/fr_woman.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "le garçon",
                      imageSrc: "/boy.svg",
                      audioSrc: "/fr_boy.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "l'homme",
                      imageSrc: "/man.svg",
                      audioSrc: "/fr_man.mp3",
                    },
                  ]);
                  break;
                case "Croatian":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "žena",
                      imageSrc: "/woman.svg",
                      audioSrc: "/hr_woman.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "dječak",
                      imageSrc: "/boy.svg",
                      audioSrc: "/hr_boy.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "čovjek",
                      imageSrc: "/man.svg",
                      audioSrc: "/hr_man.mp3",
                    },
                  ]);
                  break;
                case "Italian":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "la donna",
                      imageSrc: "/woman.svg",
                      audioSrc: "/it_woman.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "il ragazzo",
                      imageSrc: "/boy.svg",
                      audioSrc: "/it_boy.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "l'uomo",
                      imageSrc: "/man.svg",
                      audioSrc: "/it_man.mp3",
                    },
                  ]);
                  break;
              }
            }

            if (challenge.order === 3) {
              switch (course.title) {
                case "Spanish":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "la mujer",
                      imageSrc: "/woman.svg",
                      audioSrc: "/es_woman.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "el hombre",
                      imageSrc: "/man.svg",
                      audioSrc: "/es_man.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "el chico",
                      imageSrc: "/boy.svg",
                      audioSrc: "/es_boy.mp3",
                    },
                  ]);
                  break;
                case "Japanese":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "その女",
                      imageSrc: "/woman.svg",
                      audioSrc: "/jp_woman.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "その男",
                      imageSrc: "/man.svg",
                      audioSrc: "/jp_man.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "男の子",
                      imageSrc: "/boy.svg",
                      audioSrc: "/jp_boy.mp3",
                    },
                  ]);
                  break;
                case "French":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "la femme",
                      imageSrc: "/woman.svg",
                      audioSrc: "/fr_woman.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "l'homme",
                      imageSrc: "/man.svg",
                      audioSrc: "/fr_man.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "le garçon",
                      imageSrc: "/boy.svg",
                      audioSrc: "/fr_boy.mp3",
                    },
                  ]);
                  break;
                case "Croatian":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "žena",
                      imageSrc: "/woman.svg",
                      audioSrc: "/hr_woman.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "čovjek",
                      imageSrc: "/man.svg",
                      audioSrc: "/hr_man.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "dječak",
                      imageSrc: "/boy.svg",
                      audioSrc: "/hr_boy.mp3",
                    },
                  ]);
                  break;
                case "Italian":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "la donna",
                      imageSrc: "/woman.svg",
                      audioSrc: "/it_woman.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "l'uomo",
                      imageSrc: "/man.svg",
                      audioSrc: "/it_man.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "il ragazzo",
                      imageSrc: "/boy.svg",
                      audioSrc: "/it_boy.mp3",
                    },
                  ]);
                  break;
              }
            }

            if (challenge.order === 4) {
              switch (course.title) {
                case "Spanish":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "la mujer",
                      audioSrc: "/es_woman.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "el hombre",
                      audioSrc: "/es_man.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "el chico",
                      audioSrc: "/es_boy.mp3",
                    },
                  ]);
                  break;
                case "Japanese":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "その女",
                      audioSrc: "/jp_woman.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "その男",
                      audioSrc: "/jp_man.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "男の子",
                      audioSrc: "/jp_boy.mp3",
                    },
                  ]);
                  break;
                case "French":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "la femme",
                      audioSrc: "/fr_woman.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "l'homme",
                      audioSrc: "/fr_man.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "le garçon",
                      audioSrc: "/fr_boy.mp3",
                    },
                  ]);
                  break;
                case "Croatian":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "žena",
                      audioSrc: "/hr_woman.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "čovjek",
                      audioSrc: "/hr_man.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "dječak",
                      audioSrc: "/hr_boy.mp3",
                    },
                  ]);
                  break;
                case "Italian":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "la donna",
                      audioSrc: "/it_woman.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "l'uomo",
                      audioSrc: "/it_man.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "il ragazzo",
                      audioSrc: "/it_boy.mp3",
                    },
                  ]);
                  break;
              }
            }

            if (challenge.order === 5) {
              switch (course.title) {
                case "Spanish":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "el hombre",
                      imageSrc: "/man.svg",
                      audioSrc: "/es_man.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "la mujer",
                      imageSrc: "/woman.svg",
                      audioSrc: "/es_woman.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "el zombie",
                      imageSrc: "/zombie.svg",
                      audioSrc: "/es_zombie.mp3",
                    },
                  ]);
                  break;
                case "Japanese":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "その男",
                      imageSrc: "/man.svg",
                      audioSrc: "/jp_man.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "その女",
                      imageSrc: "/woman.svg",
                      audioSrc: "/jp_woman.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "ゾンビ",
                      imageSrc: "/zombie.svg",
                      audioSrc: "/jp_zombie.mp3",
                    },
                  ]);
                  break;
                case "French":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "l'homme",
                      imageSrc: "/man.svg",
                      audioSrc: "/fr_man.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "la femme",
                      imageSrc: "/woman.svg",
                      audioSrc: "/fr_woman.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "le zombie",
                      imageSrc: "/zombie.svg",
                      audioSrc: "/fr_zombie.mp3",
                    },
                  ]);
                  break;
                case "Croatian":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "čovjek",
                      imageSrc: "/man.svg",
                      audioSrc: "/hr_man.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "žena",
                      imageSrc: "/woman.svg",
                      audioSrc: "/hr_woman.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "zombi",
                      imageSrc: "/zombie.svg",
                      audioSrc: "/hr_zombie.mp3",
                    },
                  ]);
                  break;
                case "Italian":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "l'uomo",
                      imageSrc: "/man.svg",
                      audioSrc: "/it_man.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "la donna",
                      imageSrc: "/woman.svg",
                      audioSrc: "/it_woman.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "lo zombie",
                      imageSrc: "/zombie.svg",
                      audioSrc: "/it_zombie.mp3",
                    },
                  ]);
                  break;
              }
            }

            if (challenge.order === 6) {
              switch (course.title) {
                case "Spanish":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "el robot",
                      imageSrc: "/robot.svg",
                      audioSrc: "/es_robot.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "el zombie",
                      imageSrc: "/zombie.svg",
                      audioSrc: "/es_zombie.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "el chico",
                      imageSrc: "/boy.svg",
                      audioSrc: "/es_boy.mp3",
                    },
                  ]);
                  break;
                case "Japanese":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "ロボット",
                      imageSrc: "/robot.svg",
                      audioSrc: "/jp_robot.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "ゾンビ",
                      imageSrc: "/zombie.svg",
                      audioSrc: "/jp_zombie.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "男の子",
                      imageSrc: "/boy.svg",
                      audioSrc: "/jp_boy.mp3",
                    },
                  ]);
                  break;
                case "French":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "le robot",
                      imageSrc: "/robot.svg",
                      audioSrc: "/fr_robot.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "le zombie",
                      imageSrc: "/zombie.svg",
                      audioSrc: "/fr_zombie.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "le garçon",
                      imageSrc: "/boy.svg",
                      audioSrc: "/fr_boy.mp3",
                    },
                  ]);
                  break;
                case "Croatian":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "robot",
                      imageSrc: "/robot.svg",
                      audioSrc: "/hr_robot.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "zombi",
                      imageSrc: "/zombie.svg",
                      audioSrc: "/hr_zombie.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "dječak",
                      imageSrc: "/boy.svg",
                      audioSrc: "/hr_boy.mp3",
                    },
                  ]);
                  break;
                case "Italian":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "Il robot",
                      imageSrc: "/robot.svg",
                      audioSrc: "/it_robot.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "lo zombie",
                      imageSrc: "/zombie.svg",
                      audioSrc: "/it_zombie.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "il ragazzo",
                      imageSrc: "/boy.svg",
                      audioSrc: "/it_boy.mp3",
                    },
                  ]);
                  break;
              }
            }

            if (challenge.order === 7) {
              switch (course.title) {
                case "Spanish":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "la nina",
                      imageSrc: "/girl.svg",
                      audioSrc: "/es_girl.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "el zombie",
                      imageSrc: "/zombie.svg",
                      audioSrc: "/es_zombie.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "el hombre",
                      imageSrc: "/man.svg",
                      audioSrc: "/es_man.mp3",
                    },
                  ]);
                  break;
                case "Japanese":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "女の子",
                      imageSrc: "/girl.svg",
                      audioSrc: "/jp_girl.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "ゾンビ",
                      imageSrc: "/zombie.svg",
                      audioSrc: "/jp_zombie.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "その男",
                      imageSrc: "/man.svg",
                      audioSrc: "/jp_man.mp3",
                    },
                  ]);
                  break;
                case "French":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "la fille",
                      imageSrc: "/girl.svg",
                      audioSrc: "/fr_girl.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "le zombie",
                      imageSrc: "/zombie.svg",
                      audioSrc: "/fr_zombie.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "l'homme",
                      imageSrc: "/man.svg",
                      audioSrc: "/fr_man.mp3",
                    },
                  ]);
                  break;
                case "Croatian":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "djevojka",
                      imageSrc: "/girl.svg",
                      audioSrc: "/hr_girl.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "zombi",
                      imageSrc: "/zombie.svg",
                      audioSrc: "/hr_zombie.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "čovjek",
                      imageSrc: "/man.svg",
                      audioSrc: "/hr_man.mp3",
                    },
                  ]);
                  break;
                case "Italian":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "la ragazza",
                      imageSrc: "/girl.svg",
                      audioSrc: "/it_girl.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "lo zombie",
                      imageSrc: "/zombie.svg",
                      audioSrc: "/it_zombie.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "l'uomo",
                      imageSrc: "/man.svg",
                      audioSrc: "/it_man.mp3",
                    },
                  ]);
                  break;
              }
            }

            if (challenge.order === 8) {
              switch (course.title) {
                case "Spanish":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "la mujer",
                      audioSrc: "/es_woman.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "el zombie",
                      audioSrc: "/es_zombie.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "el chico",
                      audioSrc: "/es_boy.mp3",
                    },
                  ]);
                  break;
                case "Japanese":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "その女",
                      audioSrc: "/jp_woman.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "ゾンビ",
                      audioSrc: "/jp_zombie.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "男の子",
                      audioSrc: "/jp_boy.mp3",
                    },
                  ]);
                  break;
                case "French":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "la femme",
                      audioSrc: "/fr_woman.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "le zombie",
                      audioSrc: "/fr_zombie.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "le garçon",
                      audioSrc: "/fr_boy.mp3",
                    },
                  ]);
                  break;
                case "Croatian":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "žena",
                      audioSrc: "/hr_woman.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "zombi",
                      audioSrc: "/hr_zombie.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "dječak",
                      audioSrc: "/hr_boy.mp3",
                    },
                  ]);
                  break;
                case "Italian":
                  await db.insert(schema.challengeOptions).values([
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "la donna",
                      audioSrc: "/it_woman.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: true,
                      text: "lo zombie",
                      audioSrc: "/it_zombie.mp3",
                    },
                    {
                      challengeId: challenge.id,
                      correct: false,
                      text: "il ragazzo",
                      audioSrc: "/it_boy.mp3",
                    },
                  ]);
                  break;
              }
            }
          }
        }
      }
    }
    console.log("Database prepared successfully");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to prepare database");
  }
})();