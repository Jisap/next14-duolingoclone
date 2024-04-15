"use client"

import { challengeOptions, challenges } from "@/db/schema";
import { Header } from "./header";
import { useState, useTransition } from "react";
import { QuestionBubble } from "./question-bubble";
import { Challenge } from "./challenge";
import { Footer } from "./footer";
import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { toast } from "sonner";


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
  
  const [pending, startTransition] = useTransition();
  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(initialPercentage);
  const [challenges] = useState(initialLessonChallenges);
  
  // activeIndex -> challenge -> options -> correctOption -> (si correctOption.id === selectedOption) -> upsertChallengeProgress(chalenge.id)

  const [activeIndex, setActiveIndex] = useState(() => {                                // Lazy initialization -> la función se ejecuta solo 1 vez cuando se monta el componente
    const uncompletedIndex = challenges.findIndex((challenge) => !challenge.completed)  // Se busca el índice del primer elemento que no tenga el reto completado 
    return uncompletedIndex === -1 ? 0 : uncompletedIndex                               // Si ningún reto esta incompleto devuelve -1 -> uncompletedIndex=0 
  });

  const challenge = challenges[activeIndex];                                            // Challenge contendrá el desafío actual en base a ese índice de reto no completado
  const options = challenge?.challengeOptions ?? [];                                    // options contendrá los retos del desafio actual

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

    if(correctOption && correctOption.id === selectedOption){   // Si la option correcta = a la seleccionada -> modificamos bd
      startTransition(() => {
        upsertChallengeProgress(challenge.id)   
          .then((res) => {
            if (res?.error === "hearts") {
              console.error("Missing hearts");
              return;
            }

            setStatus("correct");
            setPercentage((prev) => prev + 100 / challenges.length);

            // This is practice
            if (initialPercentage === 100) {
              setHearts((prev) => Math.min(prev + 1, 5));
            }
          })
          .catch(() => toast.error("Something went wrong, plz try again !"));
      })
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

