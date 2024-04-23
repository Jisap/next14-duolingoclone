import { getLesson, getUserProgress, getUserSubscription } from "@/db/queries"
import { redirect } from "next/navigation";
import { Quiz } from "./quiz";
import { userSubscription } from '../../db/schema';



const LessonPage = async() => {

  const lessonData = getLesson();                     // lesson con los retos actualizados
  const userProgressData = getUserProgress();         // Se busca en userProgress el userId que coincida con userId logueado
  const userSubscriptionData = getUserSubscription(); // Se busca en bd el userSubscription correspondiente al usuario logueado
  
  const [
    lesson,
    userProgress,
    userSubscription
  ] = await Promise.all([
    lessonData,
    userProgressData,
    userSubscriptionData
  ]);

  if (!lesson || !userProgress) {
    redirect("/learn");
  }

  const initialPercentage = lesson.challenges
    .filter((challenge) => challenge.completed)
    .length / lesson.challenges.length * 100;


  return (
    <Quiz 
      initialLessonId={lesson.id}                   // lesson con los retos actualizados
      initialLessonChallenges={lesson.challenges}
      initialHearts={userProgress.hearts}
      initialPercentage={initialPercentage}
      userSubscription={userSubscription}
    />
  )
}

export default LessonPage