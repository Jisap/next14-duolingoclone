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
    <div>Card</div>
  )
}

export default Card