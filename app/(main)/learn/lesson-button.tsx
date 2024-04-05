"use client"

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Crown, Star } from "lucide-react";
import Link from "next/link";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type Props = {
  id: number;               // El identificador único de la lección (lesson.id)
  index: number;            // Índice de la lección en la lista de lecciones de la unidad.
  totalCount: number;       // Número total de lecciones
  locked?: boolean;         // Indicador booleano que especifica si la lección está bloqueada o no
  current?: boolean;        // Indicador booleano que especifica si la lección es la lección actualmente seleccionada.
  percentage: number;       // Porcentaje de completado de la lección.
};

const LessonButton = ({     // El componente calcula dinámicamente la posición horizontal del botón de la lección 
  id,                       // en función del índice de la lección (index).
  index,
  totalCount,
  locked,
  current,
  percentage
}: Props) => {

  const cycleLength = 8;  // Se define la longitud del ciclo, que es 8. Esto determina cuántas posiciones diferentes puede tomar el botón a lo largo de un ciclo completo.
  const cycleIndex = index % cycleLength; // % devuelve el residuo de index divido entre el cicleLength -> cicleIndex siempre estará en un rango de cycleLength-1
                                          // lo que nos permite distribuir uniformemente los botones de lección a lo largo del ciclo de posiciones especificado.
  let indentationLevel;   // Cantidad de desplazamiento horizontal que tiene el botón                

  if (cycleIndex <= 2) {                // 0-1-2
    indentationLevel = cycleIndex;      // posición inicial  identationLeve = 0, 1 , 2
  } else if (cycleIndex <= 4) {         // 3 y 4
    indentationLevel = 4 - cycleIndex;  // el botón se desplaza hacia la derecha identationLevel = 4 - 3 = 1 // 4 - 4 = 0
  } else if (cycleIndex <= 6) {         // 5 y 6
    indentationLevel = 4 - cycleIndex;  // el botón se desplaza hacia la izquierda identationLevel = 4 - 5 = -1 // 4 - 6 = -2
  } else {                              // 7 y 8
    indentationLevel = cycleIndex - 8;  // el botón se desplaza hacia la derecha después de completar un ciclo completo. identationLevel = 4-7 = -3 // 4 - 0 = 4
  }

  const rightPosition = indentationLevel * 40; // Aplicando un valor + o + al estilo right determina el movimiento del boton 

  const isFirst = index === 0;                 // Establece isFirst como true si index === 0
  const isLast = index === totalCount;         // Establece isLast como true si index === número total del lecciones 
  const isCompleted = !current && !locked;     // Establece isCompleted como true si no es la lección actual y no está bloqueada.

  const Icon = isCompleted ? Check : isLast ? Crown : Star; // Icon a mostrar

  const href = isCompleted ? `/lesson/${id}` : "/lesson";

  return (
    <Link
      href={href}
      aria-disabled={locked}
      style={{ pointerEvents: locked ? "none" : "auto" }}
    >
      <div
        className="relative"
        style={{
          right: `${rightPosition}px`,
          marginTop: isFirst && !isCompleted ? 60 : 24,
        }}
      >
        {current ? (
          <div className="h-[102px] w-[102px] relative">
            {/* banner */}
            <div className="absolute -top-6 left-2.5 px-3 py-2.5 border-2 font-bold uppercase text-green-500 bg-white rounded-xl animate-bounce tracking-wide z-10">
              Start
              <div className="absolute left-1/2 -bottom-2 w-0 h-0 border-x-8 border-x-transparent border-t-8 transform -translate-x-1/2" />
            </div>
            {/* Círculo de progreso alrededor del boton */}
            <CircularProgressbarWithChildren
              value={Number.isNaN(percentage) ? 0 : percentage}
              styles={{
                path: {
                  stroke: "#4ade80",
                },
                trail: {
                  stroke: "#e5e7eb",
                },
              }}
            >
              <Button
                size="rounded"
                variant={locked ? "locked" : "secondary"}
                className="h-[70px] w-[70px] border-b-8"
              >
                <Icon
                  className={cn(
                    "h-10 w-10",
                    locked
                      ? "fill-neutral-400 text-neutral-400 stroke-neutral-400"
                      : "fill-primary-foreground text-primary-foreground",
                    isCompleted && "fill-none stroke-[4]"
                  )}
                />
              </Button>
            </CircularProgressbarWithChildren>
          </div>
        ) : (
          <Button
            size="rounded"
            variant={locked ? "locked" : "secondary"}
            className="h-[70px] w-[70px] border-b-8"
          >
            <Icon
              className={cn(
                "h-10 w-10",
                locked
                  ? "fill-neutral-400 text-neutral-400 stroke-neutral-400"
                  : "fill-primary-foreground text-primary-foreground",
                isCompleted && "fill-none stroke-[4]"
              )}
            />
          </Button>
        )}
      </div>
    </Link>
  )
}

export default LessonButton