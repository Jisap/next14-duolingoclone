import { cache } from "react";
import { db } from "./drizzle";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { userProgress } from "./schema";


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