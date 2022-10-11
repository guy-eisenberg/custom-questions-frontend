import { useState } from 'react';
import { useSelector } from '../../hooks';
import { c } from '../../lib';
import { Question } from '../../types';
import { Button } from '../core';

interface QuestionMapProps extends React.HTMLAttributes<HTMLDivElement> {
  closeQuestionMap: () => void;
  jumpToQuestion: (question: number) => void;
  currentQuestion: number;
  questions: Question[];
}

const QuestionMap: React.FC<QuestionMapProps> = ({
  closeQuestionMap,
  jumpToQuestion,
  currentQuestion,
  questions,
  ...rest
}) => {
  const { trainingMode } = useSelector((state) => state.activity);

  const [selectedQuestion, setSelectedQuestion] = useState<
    number | undefined
  >();

  return (
    <div
      {...rest}
      className={c(
        'relative flex flex-col bg-white px-6 py-4 transition',
        rest.className
      )}
    >
      <button onClick={closeQuestionMap}>
        <img alt="exit icon" src="images/icon_x.svg" className="w-6" />
      </button>
      <div className="my-[3vh] flex flex-1 flex-col rounded-[0.2rem] border border-theme-light-gray text-theme-dark-gray">
        <p className="border-b border-theme-light-gray px-4 py-3">
          <b>Question Map</b>
        </p>
        <div className="grid max-h-[40vh] grid-cols-5 gap-[1vw] overflow-y-auto overflow-x-hidden border-b border-theme-light-gray bg-[#f4f4f4] p-6 scrollbar-thin scrollbar-thumb-theme-light-gray scrollbar-thumb-rounded-full md:grid-cols-6">
          {questions.map((_, i) => (
            <QuestionCircle
              className={c(
                (i + 1 === currentQuestion ||
                  questions[i].selectedAnswerIndex !== undefined) &&
                  (trainingMode &&
                  questions[i].selectedAnswerIndex !== undefined
                    ? questions[i].selectedAnswerIndex ===
                      questions[i].rightAnswerIndex
                      ? '!bg-theme-green text-white'
                      : '!bg-theme-red text-white'
                    : trainingMode
                    ? '!bg-theme-extra-dark-gray text-white'
                    : '!bg-[#1b8ac0] text-white'),
                trainingMode &&
                  selectedQuestion === i + 1 &&
                  '!bg-[#1b8ac0] text-white',
                i + 1 !== currentQuestion &&
                  selectedQuestion !== i + 1 &&
                  questions[i].selectedAnswerIndex !== undefined &&
                  'opacity-50'
              )}
              label={i + 1}
              onClick={() => {
                if (trainingMode && currentQuestion !== i + 1)
                  setSelectedQuestion(i + 1);
              }}
              key={i}
            />
          ))}
        </div>
        <div className="flex flex-1 flex-col px-4 py-3 text-theme-medium-gray">
          <b className="text-small">Preview:</b>
          <p className="mt-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <Button
            className="mt-auto self-end"
            onClick={() => {
              if (selectedQuestion) jumpToQuestion(selectedQuestion);

              setSelectedQuestion(undefined);
            }}
            disabled={!trainingMode}
          >
            Jump to Question
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionMap;

const QuestionCircle: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { label: number }
> = ({ label, ...rest }) => {
  return (
    <button
      {...rest}
      className={c(
        'flex h-12 w-12 items-center justify-center rounded-full bg-[#eaeaea] transition hover:scale-105 hover:shadow-md hover:brightness-105 active:scale-95 active:brightness-95',
        rest.className
      )}
    >
      {label}
    </button>
  );
};
