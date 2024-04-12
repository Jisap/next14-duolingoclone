"use client"

import { challengeOptions, challenges } from "@/db/schema";
import { Header } from "./header";
import { useState } from "react";
import { QuestionBubble } from "./question-bubble";
import { Challenge } from "./challenge";

type Props = {
  initialPercentage: number;
  initialHearts: number;
  initialLessonId: number;
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengeOptions: typeof challengeOptions.$inferSelect[];
  })[];
  userSubscription: any
};

export const Quiz = ({
  initialPercentage,
  initialHearts,
  initialLessonId,
  initialLessonChallenges,
  userSubscription
}: Props) => {
  
  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(initialPercentage);
  const [challenges] = useState(initialLessonChallenges);
  
  const [activeIndex, setActiveIndex] = useState(() => {                                // Lazy initialization -> la función se ejecuta solo 1 vez cuando se monta el componente
    const uncompletedIndex = challenges.findIndex((challenge) => !challenge.completed)  // Se busca el índice del primer elemento que no tenga el reto completado 
    return uncompletedIndex === -1 ? 0 : uncompletedIndex                               // Si ningún reto esta incompleto devuelve -1 -> uncompletedIndex=0 
  });

  const challenge = challenges[activeIndex];                                            // Challenge contendrá el desafío actual
  const options = challenge?.challengeOptions ?? [];

  const title = challenge.type == "ASSIST" 
    ? "Select the correct meaning"
    : challenge.question 

  const [selectedOption, setSelectedOption] = useState<number>();
  const [status, setStatus] = useState<"none" | "wrong" | "correct">("none");

  const onSelect = (id: number) => {                                                    // Establece el estado de selectedOption
    if (status !== "none") return;

    setSelectedOption(id);
  };

  return (
  
    <>
      <Header
        hearts={hearts}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
      />
      <div className="flex-1">
        <div className="h-full flex items-center justify-center">
          <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
            <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
              {title}
            </h1>
            <div>
              {challenge.type === "ASSIST" && (
                <QuestionBubble  question={challenge.question} />
              )}
              <Challenge 
                options={options}
                onSelect={onSelect}
                status={status}
                selectedOption={selectedOption}
                disabled={false}
                type={challenge.type}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

