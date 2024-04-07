import { cache } from "react";
import { db } from "./drizzle";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { challengeProgress, courses, lessons, units, userProgress } from "./schema";


export const getUserProgress = cache(async() => {
  const {userId} = await auth()
  if(!userId){
    return null;
  }

  const data = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId), // Se busca en userProgress el userId que coincida con userId logueado
    with: {
      activeCourse: true // Aquí, se solicita que la relación activeCourse también se cargue y esté disponible en el objeto data resultante.
    },
  });

  return data;
})

export const getCourses = cache(async () => {
  const data = await db.query.courses.findMany();

  return data
})

export const getCourseById = cache(async (courseId: number) => {
  const data = await db.query.courses.findFirst({ // Se busca dentro de courses el primer resultado
    where: eq(courses.id, courseId),              // donde el id coincida con el pasado en el argumento
    // with: {
    //   units: {                                            // Se devolverán las unidades asociadas a la tabla units
    //     orderBy: (units, { asc }) => [asc(units.order)],  // ordenadas ascendentemente
    //     with: {
    //       lessons: {                                            // Se devolverán las lessons asociadas a la tabla lesson
    //         orderBy: (lessons, { asc }) => [asc(lessons.order)],// ordenadas ascedentemente
    //       },
    //     },
    //   },
    // },
  });

  return data
})

  export const getUnits = cache(async () => {
    const { userId } = await auth();
    const userProgress = await getUserProgress();

    if (!userId || !userProgress?.activeCourseId) {
      return [];
    }

    const data = await db.query.units.findMany({
      orderBy: (units, { asc }) => [asc(units.order)],
      where: eq(units.courseId, userProgress.activeCourseId),  // Se buscan las units que satisfagan units.courseId con userProgress.activeCourseId -> courseId
      with: {
        lessons: {
          orderBy: (lessons, { asc }) => [asc(lessons.order)], // populate lessons
          with: {
            challenges: {                                      // populate challenges            
              orderBy: (challenges, { asc }) => [asc(challenges.order)],
              with: {
                challengeProgress: {                           // populate challengesProgress  
                  where: eq(
                    challengeProgress.userId,
                    userId,
                  ),
                },
              },
            },
          },
        },
      },
    });

    const normalizedData = data.map((unit) => {                             // Iteramos sobre las units -> unit

      const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {     // Iteramos sobre las lessons de cada unit
        if (
          lesson.challenges.length === 0                                    // Si la lección no tiene desafios 
        ) {
          return { ...lesson, completed: false };                           // se considerará como no completada
        }

        const allCompletedChallenges = lesson.challenges.every((challenge) => { // Si si tiene desafios iteramos los desafios -> challenge
          return challenge.challengeProgress                                        // debe existir algún progreso registrado 
            && challenge.challengeProgress.length > 0                               // y tener almenos un registro  
            && challenge.challengeProgress.every((progress) => progress.completed); // ademas de tener la prop completed=true
        });                                                                     // every devolverá true si cada challenge tiene prog registrado y con la prop completed

        return { ...lesson, completed: allCompletedChallenges }; // Actualización de la estructura de lesson
      });

      return { ...unit, lessons: lessonsWithCompletedStatus }; // Actualización de la estructura de unit
    });

    return normalizedData;

  });

export const getCourseProgress = cache(async () => {

  const { userId } = await auth();
  const userProgress = await getUserProgress();

  if (!userId || !userProgress?.activeCourseId) {
    return null;
  }

  const unitsInActiveCourse = await db.query.units.findMany({
    orderBy: (units, { asc }) => [asc(units.order)],
    where: eq(units.courseId, userProgress.activeCourseId),   // Se buscán la units que satisfagan las relaciónes establecidas en el schema
    with: {                                                   // osea las units pertenecientes a un curso marcado como activo por un user
      lessons: {                                              // Incluyendo las lessons
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
          unit: true,
          challenges: {                                       // Incluyendo los chanllenges de cada lesson
            with: {
              challengeProgress: {                            // y su progreso
                where: eq(challengeProgress.userId, userId),  // donde el "propietario" del reto = usuario logueado
              },
            },
          },
        },
      },
    },
  });

  const firstUncompletedLesson = unitsInActiveCourse          // Obtenemos la primera lesson incompleta de las units del curso activo
    .flatMap((unit) => unit.lessons)                          // Se ponen las units en un solo array.
    .find((lesson) => {                                       // Sobre ese array se busca una lesson
      return lesson.challenges.some((challenge) => {          // se busca una lección donde al menos uno de los desafíos asociados  
        return !challenge.challengeProgress                   // no esté completado.
          || challenge.challengeProgress.length === 0
          || challenge.challengeProgress.some((progress) => progress.completed === false)
      });
    });

  return {
    activeLesson: firstUncompletedLesson,                      // Se devuelve la primera lesson incompleta y su id 
    activeLessonId: firstUncompletedLesson?.id,
  };
})

export const getLesson = cache(async (id?: number) => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const courseProgress = await getCourseProgress();             // activeLesson: firstUncompletedLesson,activeLessonId: firstUncompletedLesson?.id,

  const lessonId = id || courseProgress?.activeLessonId;

  if (!lessonId) {
    return null;
  }

  const data = await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),                            // Se busca la lesson cuyo id = al pasado por parámetro o a activeLesson
    with: {
      challenges: {
        orderBy: (challenges, { asc }) => [asc(challenges.order)],
        with: {
          challengeOptions: true,
          challengeProgress: {
            where: eq(challengeProgress.userId, userId),        // incluyendo los retos cuyo userId = user logueado
          },
        },
      },
    },
  });

  if (!data || !data.challenges) {
    return null;
  }

  const normalizedChallenges = data.challenges.map((challenge) => {
    const completed = challenge.challengeProgress
      && challenge.challengeProgress.length > 0
      && challenge.challengeProgress.every((progress) => progress.completed)

    return { ...challenge, completed };
  });

  return { ...data, challenges: normalizedChallenges }
})