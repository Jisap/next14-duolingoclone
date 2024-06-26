import { FC } from "react";
import { challengeOptions, challenges } from "@/db/schema";
import { cn } from "@/lib/utils";
import Card from "./card";
//import Card from "./Card";

interface ChallengeProps {
  options: (typeof challengeOptions.$inferSelect)[];
  onSelect: (id: number) => void;
  status: "correct" | "wrong" | "none";
  selectedOption?: number;
  disabled?: boolean;
  type: (typeof challenges.$inferSelect)["type"];
}

export const Challenge: FC<ChallengeProps> = ({
  onSelect,
  options,
  status,
  type,
  disabled,
  selectedOption,
}) => {
  return (
    <div
      className={cn(
        "grid gap-2",
        type === "ASSIST" && "grid-cols-1",
        type === "SELECT" && "grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]"
      )}
    >
      {options.map((option, i) => (
        <Card
          key={option.id}
          id={option.id}
          text={option.text}
          imgSrc={option.imageSrc}
          shortcut={`${i + 1}`}
          onClick={() => onSelect(option.id)}       // Establece el estado de selectedOption según id de la option -> selected
          selected={selectedOption === option.id}   // selected = true si se pulso la option.id = estado de selectedOption
          status={status}
          audioSrc={option.audioSrc}
          disabled={disabled}
          type={type}
        />
      ))}
    </div>
  );
}