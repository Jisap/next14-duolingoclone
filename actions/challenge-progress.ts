"use server";

import { db } from "@/db/drizzle";
import { getUserProgress } from "@/db/queries";
import { challengeProgress, challenges, userProgress } from "@/db/schema";
import { auth } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const upsertChallengeProgress = async (challengeId: number) => {

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const currentUserProgress = await getUserProgress(); // Se busca en userProgress el userId que coincida con userId logueado

  if (!currentUserProgress) {
    throw new Error("User not found");
  }

  const challenge = await db.query.challenges.findFirst({ // Buscamos el primer reto que coincida con el del id pasado por argumento
    where: eq(challenges.id, challengeId),
  });

  if (!challenge) {
    throw new Error("Challenge not found");
  }

  const lessonId = challenge.lessonId;  // Del reto que se analiza se obtiene la lessonId

  const existingChallengeProgress = await db.query.challengeProgress.findFirst({ // De la tabla de challengeProgress se obtiene la primera coincidencia
    where: and(                                                                  // donde (and combina multiples filtros)
      eq(challengeProgress.userId, userId),                                      // el challengeProgres.userId coincida con el usuario logueado 
      eq(challengeProgress.challengeId, challengeId)                             // el challengeProgress.challengeId coincida con challenge del argumento
    ),
  });

  const isPractice = !!existingChallengeProgress; // Si existe challengeProgress isPractice = true -> el usuario ya ha completado previamente el desafío (es una práctica)

  if (
    currentUserProgress.hearts === 0 && !isPractice 
  ) {
    return { error: "hearts" };
  }

  // Aquí el usuario ya ha completado previamente el desafío (es una práctica)

  if (isPractice) {                                                         // Si existe isPractice (challengeProgress)
    await db                                                                
      .update(challengeProgress)                                            // actualizamos en bd challengeProgress
      .set({                                                                // y establece completed = true
        completed: true,
      })                                                                    // teniendo en cuenta
      .where(eq(challengeProgress.id, existingChallengeProgress.id));       // si la tabla challengeProgress.id = existingChallengeProgress.id

    await db                                                                // También se actualiza en bd userProgress
      .update(userProgress)
      .set({                                                                // estableciendo 
        hearts: Math.min(currentUserProgress.hearts + 1, 5),                // los corazones    
        points: currentUserProgress.points + 10,                            // y los puntos  
      })
      .where(eq(userProgress.userId, userId));                              // si el userProgress.userId = al id del usuario logueado  

    revalidatePath("/learn");
    revalidatePath("/lesson");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
    revalidatePath(`/lesson/${lessonId}`);

    return;
  }

  //  Aquí el usuario está realizando un desafío por primera vez (no es una práctica). 

  await db.insert(challengeProgress).values({ // Insertamos un nuevo registro con el challenge completado
    challengeId,
    userId,
    completed: true,
  });

  await db
    .update(userProgress)                             // Y actualizamos en userProgress
    .set({
      points: currentUserProgress.points + 10,        // los puntos de usuario
    })
    .where(eq(userProgress.userId, userId));

  revalidatePath("/learn");
  revalidatePath("/lesson");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
  revalidatePath(`/lesson/${lessonId}`);
}