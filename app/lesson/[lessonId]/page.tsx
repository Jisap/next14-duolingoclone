import { getLesson, getUserProgress } from "@/db/queries"
import { redirect } from "next/navigation";
import { Quiz } from "../quiz";

type Props = {
  params: {
    lessonId: number;
  };
};

const LessonIdPage = async({ params }: Props) => {

  const lessonData = getLesson(params.lessonId);               // lesson con los retos actualizados
  const userProgressData = getUserProgress();                  // Se busca en userProgress el userId que coincida con userId logueado

  const [
    lesson,
    userProgress
  ] = await Promise.all([
    lessonData,
    userProgressData
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
      userSubscription={null}
    />
  )
}

export default LessonIdPage