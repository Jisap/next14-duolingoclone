"use client"

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAudio, useMount, useWindowSize } from "react-use";
import Confetti from "react-confetti";
import { challengeOptions, challenges, userSubscription } from "@/db/schema";
import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { reduceHearts } from "@/actions/user-progress";
import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";
import { Challenge } from "./challenge";
import { Footer } from "./footer";
import { toast } from "sonner";
import ResultCard from "./ResultCard";
import { useHeartsModal } from "@/store/use-hearts-modal";
import { usePracticeModal } from "@/store/use-practice-modal";



type Props = {
  initialPercentage: number;
  initialHearts: number;
  initialLessonId: number;
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengeOptions: typeof challengeOptions.$inferSelect[];
  })[];
  userSubscription: typeof userSubscription.$inferSelect & {
    isActive: boolean
  } | null
};

export const Quiz = ({
  initialPercentage,
  initialHearts,
  initialLessonId,
  initialLessonChallenges,
  userSubscription
}: Props) => {

  const { open: openHeartsModal } = useHeartsModal();
  const { open: openPracticeModal } = usePracticeModal()

  const { width, height } = useWindowSize();

  const router = useRouter();

  useMount(() => {
    if (initialPercentage === 100) {
      openPracticeModal();
    }
  });

  const [finishAudio] = useAudio({
    src: "/finish.mp3",
    autoPlay: true,
  });
  
  const [correctAudio, _c, correctAudioControls] = useAudio({
    src: "/correct.wav",
  });

  const [incorrectAudio, _i, incorrectAudioControls] = useAudio({
    src: "/incorrect.wav",
  });


  const [lessonId] = useState(initialLessonId);                                         // lesson con los retos actualizados
  const [pending, startTransition] = useTransition();
  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(() => {
    return initialPercentage === 100
      ? 0
      : initialPercentage
  });
  const [challenges] = useState(initialLessonChallenges);
  
  // activeIndex -> challenge -> options -> correctOption -> (si correctOption.id === selectedOption) -> upsertChallengeProgress(chalenge.id)

  const [activeIndex, setActiveIndex] = useState(() => {                                // Lazy initialization -> la función se ejecuta solo 1 vez cuando se monta el componente
    const uncompletedIndex = challenges.findIndex((challenge) => !challenge.completed)  // Se busca el índice del primer elemento que no tenga el reto completado 
    return uncompletedIndex === -1 ? 0 : uncompletedIndex                               // Si ningún reto esta incompleto devuelve -1 -> uncompletedIndex=0 
  });

  const challenge = challenges[activeIndex];                                            // Challenge contendrá el desafío actual en base a ese índice de reto no completado
  const options = challenge?.challengeOptions ?? [];                                    // options contendrá las opciones de respuesta del desafio actual

  const [selectedOption, setSelectedOption] = useState<number>();
  const [status, setStatus] = useState<"none" | "wrong" | "correct">("none");

  const onSelect = (id: number) => {                                                    // Establece el estado de selectedOption con el id de la option
    if (status !== "none") return;

    setSelectedOption(id);
  };

  const onNext = () => {
    setActiveIndex ((current) => current + 1)
  } 

  const onContinue = () => {                                                            // Se llamará tanto si es correcta como si no lo es la respuesta

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

    const correctOption = options.find((option) => option.correct);                     // De las opciones del desafio actual se busca la que tiene correct:true

    if(!correctOption) return

    if(correctOption && correctOption.id === selectedOption){                           // Si la option correcta = a la seleccionada -> modificamos bd
      startTransition(() => {
        upsertChallengeProgress(challenge.id)                                           // Se modfican completed, hearts y points
          .then((res) => {
            if (res?.error === "hearts") {
              openHeartsModal()
              return;
            }

            correctAudioControls.play();

            setStatus("correct");                                                       // status:"correct"
            setPercentage((prev) => prev + 100 / challenges.length);                    // Se establece el percentage de acierto    

            // This is practice
            if (initialPercentage === 100) {
              setHearts((prev) => Math.min(prev + 1, 5));
            }
          })
          .catch(() => toast.error("Something went wrong, plz try again !"));
      })
    }else{                                                                              // si la option no es la correcta
      startTransition(() => {
        reduceHearts(challenge.id)                                                      // reducimos los corazones
          .then((res) => {
            if (res?.error === "hearts") {                                              // (Si al usuario no le quedán corazones mensaje de error)
              openHeartsModal();
              return;
            }

            incorrectAudioControls.play();

            setStatus("wrong");                                                         // Status:"wrong"

            if (!res?.error) {                                                          // Si no hay ningún error en la respuesta de reduceHearts se establece el state de hearts
              setHearts((prev) => Math.max(prev - 1, 0));                               // Si el estado anterior (prev) es mayor que 0, se resta 1 para indicar que el usuario ha perdido un corazón. 
            }                                                                           // Si prev ya es 0, el número de corazones se mantiene en 0.
          })
          .catch(() => {
            toast.error("Something went wrong. plz try again !");
          });
      })
    }
  }

  if(!challenge){
    return (
      <>
        {finishAudio}

        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          tweenDuration={10000}
        />

        <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
          <Image 
            src="/finish.svg"
            alt="Finish"
            className="hidden lg:block"
            height={100}
            width={100}
          />
          <Image
            src="/finish.svg"
            alt="Finish"
            className="block lg:hidden"
            height={50}
            width={50}
          />
          
          <h1 className="text-xl lg:text-3xl text-neutral-700 font-bold">
            Great job ! <br /> You've completed the lesson.
          </h1>

          <div className="flex items-center gap-x-4 w-full">
            <ResultCard 
              variant="points" 
              value={challenges.length * 10} 
            />
            <ResultCard
              variant="hearts"
              value={!!userSubscription?.isActive ? "active" : hearts}
            />
          </div>
        </div>

        <Footer
          lessonId={lessonId}
          status="completed"
          onCheck={() => router.push("/learn")}
        />
      </>
    )
  }

  return (
    <>
      { incorrectAudio }
      { correctAudio }
        <Header
          hearts={hearts}
          percentage={percentage}
          hasActiveSubscription={!!userSubscription?.isActive}
        />

        <div className="flex-1">
          <div className="h-full flex items-center justify-center">
            <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
              <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
                {challenge.type === "ASSIST"
                  ? "Select the correct meaning"
                  : challenge.question}
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
                  disabled={pending}
                  type={challenge.type}
                />
              </div>
            </div>
          </div>
        </div>

        <Footer
          onCheck={onContinue}
          status={status}
          disabled={pending || !selectedOption}
        />
    </>
  )
}

