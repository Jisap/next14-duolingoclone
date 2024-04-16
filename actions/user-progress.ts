"use server"

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs"
import { db } from "@/db/drizzle";
import { getCourseById, getUserProgress } from "@/db/queries";
import { challengeProgress, challenges, userProgress } from "@/db/schema";
import { and, eq } from "drizzle-orm";


export const upsertUserProgress = async (courseId: number) => {
  
  const { userId } = auth();
  const user = await currentUser();
  if(!userId || !user) throw new Error("Unauthorized");

  const course = await getCourseById(courseId);
  if(!course) throw new Error('Course not found');

  // if (!course.units.length || !course.units[0].lessons.length) {
  //   throw new Error("Course is empty");
  // }

  const existingUserProgress = await getUserProgress(); // Se busca un user cuyo id coincida con el user logueado
  if(existingUserProgress){                             // Si existe
    await db.update(userProgress).set({                 // actualizamos en userProgress el activeCourse con el id del curso que viene por argumento
      activeCourseId: courseId,
      userName: user.firstName || "User",
      userImageSrc: user.imageUrl || "/mascot.svg"
    });

    revalidatePath("/courses");                         // Actualización de la cache
    revalidatePath("/learn");
    redirect("/learn")
  }

  await db.insert(userProgress).values({                // Si no existe el user en userProgress creamos un un nuevo registro
    userId,
    activeCourseId: courseId,
    userName: user.firstName || "User",
    userImageSrc: user.imageUrl || "/mascot.svg"
  });

  revalidatePath("/courses");                           // Actualización de la cache
  revalidatePath("/learn");
  redirect("/learn")
}

export const reduceHearts = async (challengeId: number) => {

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const currentUserProgress = await getUserProgress();       // Se busca en userProgress el userId que coincida con userId logueado

  const challenge = await db.query.challenges.findFirst({    // Se busca un desafío específico en la base de datos utilizando el ID del desafío proporcionado.
    where: eq(challenges.id, challengeId),
  });

  if (!challenge) {
    throw new Error("Challenge not found !");
  }

  const lessonId = challenge.lessonId;

  const existingChallengeProgress = await db.query.challengeProgress.findFirst({  // Se busca el progreso del desafío actual para el usuario en la base de datos.
    where: and(
      eq(challengeProgress.userId, userId),                                       // challengesProgres.userId = usuario logeado
      eq(challengeProgress.challengeId, challengeId)                              // relación: challengeProgres.challengeId = challengeId del argumento
    ),
  });

  const isPractice = !!existingChallengeProgress;       // Si existe algún progreso para el usuario en el desafío, se considera que el desafío ya ha sido
                                                        // practicado previamente, y se devuelve un objeto indicando que es una práctica.
  
  if (isPractice) {                                     // Si es una práctica la funcíon devuelve un error con el mensaje "practice"      
    return { error: "practice" };
  }

  if (!currentUserProgress) {                           // Si no se encontró el userProgress la función devuelve un mensaje de error
    throw new Error("User progress not found");
  }

  if (currentUserProgress.hearts === 0) {               // Este bloque verifica si al usuario le quedan corazones disponibles para realizar el desafío
    return { error: "hearts" };
  }

  await db                                              // En este bloque se actualiza el número de corazones del usuario en la base de datos.
    .update(userProgress)
    .set({
      hearts: Math.max(currentUserProgress.hearts - 1, 0),  // Se reduce en uno el número de corazones del usuario y se asegura de que el valor mínimo sea 0 
    })
    .where(eq(userProgress.userId, userId));

  revalidatePath("/shop");                              // Se revalidan varias rutas. Lo que desencadena una actualización en la interfaz de usuario para reflejar los cambios realizados
  revalidatePath("/learn");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
  revalidatePath(`/lesson/${lessonId}`);
}


export const refillHearts = async () => {
  const currentUserProgress = await getUserProgress();            // Se busca en userProgress el userId que coincida con userId logueado

  if (!currentUserProgress) {
    throw new Error("User progress not found !");                 // Si no se encontró el userProgress la función devuelve un mensaje de error
  }

  if (currentUserProgress.hearts === 5) {                         // Se verifica si el número de corazones del usuario ya está en su capacidad máxima(5 corazones). 
    throw new Error("Hearts are already full !");
  }

  if (currentUserProgress.points < 50) {                          // Se verifica si el usuario tiene al menos 50 puntos para rellenar los corazones.
    throw new Error("Not enough points !");
  }

  await db
    .update(userProgress)                                         // Actualización del userProgress si no hay errores
    .set({
      hearts: 5,                                                  // Se establece el número de corazones del usuario en 5
      points: currentUserProgress.points - 50,                    // Se resta 50 puntos de los puntos actuales del usuario.
    })
    .where(eq(userProgress.userId, currentUserProgress.userId));

  revalidatePath("/shop");
  revalidatePath("/learn");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
};