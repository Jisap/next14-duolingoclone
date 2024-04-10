import { FC, useCallback } from "react";
import Image from "next/image";

import { useAudio, useKey } from "react-use";

import { challenges } from "@/db/schema";
import { cn } from "@/lib/utils";

interface CardProps {
  id: number;
  text: string;
  imgSrc: string | null;
  shortcut: string;
  selected?: boolean;
  onClick: () => void;
  status: "none" | "wrong" | "correct";
  audioSrc: string | null;
  disabled: boolean | undefined;
  type: (typeof challenges.$inferSelect)["type"];
}

const Card: FC<CardProps> = ({
  audioSrc,
  disabled,
  id,
  imgSrc,
  onClick,
  shortcut,
  status,
  text,
  type,
  selected,
}) => {
  return (
    <div 
      onClick={() => {}}
      className={cn(
        "h-full border-2 rounded-xl border-b-4 hover:bg-black/5 p-4 lg:p-6 cursor-pointer active:border-b-2",
        selected && "border-sky-300 bg-sky-100 hover:bg-sky-100",
        selected && status === "correct" 
          && "border-green-300 bg-green-100 hover:bg-green-100",
        selected && status === "wrong" 
          && "border-rose-300 bg-rose-100 hover:bg-rose-100",
        disabled && "pointer-events-none hover:bg-white",
        type === "ASSIST" && "lg:p-3 w-full"
      )}  
    >
      {imgSrc && (
        <div className="relative aspect-square mb-4 max-h-[80px] lg:max-h-[150px] w-full">
          <Image 
            src={imgSrc} 
            alt={text} 
            fill 
          />
        </div>
      )}
    </div>
  )
}

export default Card