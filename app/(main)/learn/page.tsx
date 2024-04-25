import { FeedWrapper } from "@/components/feed-wrapper"
import { StickyWrapper } from "@/components/sticky-wrapper"
import { Header } from "./header"
import { UserProgress } from "@/components/user-progress"
import { 
  getCourseProgress,
  getLessonPercentage, 
  getUnits, 
  getUserProgress, 
  getUserSubscription
} from "@/db/queries"
import { redirect } from "next/navigation"
import { Unit } from "./unit"
import { lessons, units as unitsSchema } from "@/db/schema"
import { Promo } from "@/components/Promo"
import { Quests } from "@/components/Quest"




const LearnPage = async () => {

  const userProgressData = getUserProgress()                        // userProgress de usuario logueado
  const courseProgressData = getCourseProgress()                    // activeLesson: firstUncompletedLesson,activeLessonId: firstUncompletedLesson?.id,
  const lessonPercentageData = getLessonPercentage()                // porcentaje de desafíos completados en una lección activa.
  const unitsData = getUnits()
  const userSubscriptionData = getUserSubscription()                // Se busca en bd el userSubscription correspondiente al usuario logueado

  const [
    userProgress,
    units,
    courseProgress,
    lessonPercentage,
    userSubscription
  ] = await Promise.all([                 // Resolución de la promesa de userProgress, unitsData, courseProgressData y lessonPercentageData
    userProgressData,
    unitsData,
    courseProgressData,
    lessonPercentageData,
    userSubscriptionData
  ]);

  if(!userProgress || !userProgress.activeCourse) {
    redirect("/courses")
  }

  if(!courseProgress){
    redirect("/courses")
  }

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper >
        <UserProgress 
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={!!userSubscription?.isActive}
        />
        {!userSubscription?.isActive && <Promo />}
        <Quests points={userProgress.points} />
      </StickyWrapper>
      
      <FeedWrapper>
        <Header title={userProgress.activeCourse.title} />  
        {units.map((unit) => (
          <div key={unit.id} className="mb-10">
            <Unit 
              id={unit.id}
              order={unit.order}
              description={unit.description}
              title={unit.title}
              lessons={unit.lessons}
              activeLesson={courseProgress.activeLesson as typeof lessons.$inferSelect & {
                unit: typeof unitsSchema.$inferSelect
              } | undefined }
              activeLessonPercentage={lessonPercentage}
            />
          </div>
        ))}
      </FeedWrapper>
    </div>
  )
}

export default LearnPage
