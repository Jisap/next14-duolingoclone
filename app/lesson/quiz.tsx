"use client"

import { challengeOptions, challenges } from "@/db/schema";
import { Header } from "./header";
import { useState } from "react";
import { QuestionBubble } from "./question-bubble";
import { Challenge } from "./challenge";
import { Footer } from "./footer";


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

  const onSelect = (id: number) => {                                                    // Establece el estado de selectedOption con el id de la option
    if (status !== "none") return;

    setSelectedOption(id);
  };

  const onNext = () => {
    setActiveIndex ((current) => current + 1)
  } 

  const onContinue = () => { // Se llamará tanto si es correcta como si no lo es la respuesta

    if(!selectedOption) return

    if(status === "wrong") {
      setStatus("none")
      setSelectedOption(undefined)
      return
    }

    if (status === "correct") {
      onNext()
      setStatus("none")
      setSelectedOption(undefined)
      return
    }

    const correctOption = options.find((option) => option.correct);

    if(!correctOption) return

    if(correctOption && correctOption.id === selectedOption){
      console.log("Correct option")
    }else{
      console.log("Incorrect option")
    }
  }

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
                onSelect={onSelect}                 // Función que establece el state de selectedOption
                status={status}                     // Por defecto "none"
                selectedOption={selectedOption}     // Estado de selectedOption
                disabled={false}
                type={challenge.type}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer
        onCheck={onContinue}
        status={status}
        disabled={!selectedOption}
      />
    </>
  )
}

