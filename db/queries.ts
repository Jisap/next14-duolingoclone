import { cache } from "react";
import { db } from "./drizzle";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { courses, userProgress } from "./schema";


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

  return data;
});