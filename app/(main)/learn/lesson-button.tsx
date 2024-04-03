"use client"

type Props = {
  id: number;
  index: number;
  totalCount: number;
  locked?: boolean;
  current?: boolean;
  percentage: number;
};

const LessonButton = ({
  id,
  index,
  totalCount,
  locked,
  current,
  percentage
}: Props) => {

  

  return (
    <div>{id} lesson-button</div>
  )
}

export default LessonButton