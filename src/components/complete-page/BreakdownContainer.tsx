import { useMemo } from 'react';
import { useSelector } from '../../hooks';
import { c, p } from '../../lib';
import { CategoryResults } from '../../redux';
import { Question } from '../../types';

const BreakdownContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  ...rest
}) => {
  const { time, score, categoriesResults } = useSelector((state) => state.exam);

  const wrongCount = useMemo(() => {
    return Object.values(categoriesResults).reduce(
      (sum, category) => sum + getWrongCount(category),
      0
    );

    function getWrongCount(category: CategoryResults): number {
      return (
        Object.values(category.questions).reduce(
          (sum, question) => sum + (isQuestionWrong(question) ? 1 : 0),
          0
        ) +
        Object.values(category.subCategories).reduce(
          (sum, category) => sum + getWrongCount(category),
          0
        )
      );
    }

    function isQuestionWrong(
      question: Question & { selectedAnswerId?: string }
    ) {
      const rightAnswer = question.answers.find((answer) => answer.is_right)!;

      return (
        question.selectedAnswerId !== rightAnswer.id &&
        question.selectedAnswerId !== undefined
      );
    }
  }, [categoriesResults]);

  const omittedCount = useMemo(() => {
    return Object.values(categoriesResults).reduce(
      (sum, category) => sum + getOmittedCount(category),
      0
    );

    function getOmittedCount(category: CategoryResults): number {
      return (
        Object.values(category.questions).reduce(
          (sum, question) =>
            sum + (question.selectedAnswerId === undefined ? 1 : 0),
          0
        ) +
        Object.values(category.subCategories).reduce(
          (sum, category) => sum + getOmittedCount(category),
          0
        )
      );
    }
  }, [categoriesResults]);

  return (
    <div
      {...rest}
      className={c('flex flex-col items-center justify-center', rest.className)}
    >
      <div className="text-theme-medium-gray">
        <p className="mb-12 text-left leading-9">
          <b>Breakdown:</b>
        </p>
        <div className="flex gap-12">
          <div className="flex flex-col gap-6">
            <div className="flex gap-4">
              <img
                alt="duration icon"
                src={p('images/icon_duration.svg')}
                className="!h-6 !w-6"
              />
              <span>Duration:</span>
            </div>
            <div className="flex gap-4">
              <img
                alt="correct icon"
                src={p('images/icon_correct.svg')}
                className="!h-6 !w-6"
              />
              <span>Total Correct:</span>
            </div>
            <div className="flex gap-4">
              <img
                alt="incorrect icon"
                src={p('images/icon_incorrect.svg')}
                className="!h-6 !w-6"
              />
              <span>Total Incorrect:</span>
            </div>
            <div className="flex gap-4">
              <img
                alt="omitted icon"
                src={p('images/icon_omitted.svg')}
                className="!h-6 !w-6"
              />
              <span>Total Omitted:</span>
            </div>
          </div>
          <div className="flex flex-col gap-6 text-right">
            <b>
              {Math.floor(time / 60)} min {time % 60} secs
            </b>
            <b>{score}</b>
            <b>{wrongCount}</b>
            <b>{omittedCount}</b>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakdownContainer;
