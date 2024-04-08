import { lessons, units } from "@/db/schema";
import { UnitBanner } from "./UnitBanner";
import LessonButton from "./lesson-button";



type Props = {
  id: number;
  order: number;
  title: string;
  description: string;
  lessons: (typeof lessons.$inferSelect & { completed: boolean })[];
  activeLesson: typeof lessons.$inferSelect & { unit: typeof units.$inferSelect } | undefined;
  activeLessonPercentage: number;
};

export const Unit = ({
  id,
  order,
  title,
  description,
  lessons,                // units.lessons
  activeLesson,           // activeLesson: firstUncompletedLesson,activeLessonId:firstUncompletedLesson?.id
  activeLessonPercentage,
}: Props) => {
  return (
    <>
      <UnitBanner title={title} description={description} />
      <div className="flex items-center flex-col relative">
        {lessons.map((lesson, index) => {
        
          const isCurrent = lesson.id === activeLesson?.id; // unit seleccionada si lesson iterada = activeLesson
          const isLocked = !lesson.completed && !isCurrent; // unit bloqueada si lesson.completed = false  y no es la seleccionada

          return (
            <LessonButton
              key={lesson.id}
              id={lesson.id}
              index={index}
              totalCount={lessons.length - 1}
              current={isCurrent}
              locked={isLocked}
              percentage={activeLessonPercentage}
            />
          );
        })}
      </div>
    </>
  )}