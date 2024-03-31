"use server"

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs"
import { db } from "@/db/drizzle";
import { getCourseById, getUserProgress } from "@/db/queries";
import { userProgress } from "@/db/schema";


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
    await db.update(userProgress).set({                 // actualizamos el activeCourse con el id del curso que viene por argumento
      activeCourseId: courseId,
      userName: user.firstName || "User",
      userImageSrc: user.imageUrl || "/mascot.svg"
    });

    revalidatePath("/courses"); // Actualización de la cache
    revalidatePath("/learn");
    redirect("/learn")
  }

  await db.insert(userProgress).values({                // Si no existe el user en userProgress creamos un un nuevo registro
    userId,
    activeCourseId: courseId,
    userName: user.firstName || "User",
    userImageSrc: user.imageUrl || "/mascot.svg"
  });

  revalidatePath("/courses"); // Actualización de la cache
  revalidatePath("/learn");
  redirect("/learn")
}