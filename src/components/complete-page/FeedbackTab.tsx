import React, { useCallback, useState } from 'react';
import type { Question } from '../../types';
import CategoriesResultsList from './CategoriesResultsList';
import SelectedQuestionContainer from './SelectedQuestionContainer';

export type AnsweredQuestion = Question & {
  selectedAnswerId?: string;
};

const FeedbackTab: React.FC = () => {
  const [selectedQuestion, _setSelectedQuestion] = useState<
    AnsweredQuestion | undefined
  >(undefined);

  const setSelectedQuestion = useCallback(
    (question: AnsweredQuestion | undefined) => {
      window.scrollTo({ top: 0 });

      _setSelectedQuestion(question);
    },
    []
  );

  return (
    <>
      {/* NOTE: Desktop */}

      <div className="hidden min-h-0 w-full flex-1 basis-0 md:flex">
        <CategoriesResultsList
          className="w-1/4 md:border-r md:border-r-[#dfdfdf]"
          selectedQuestion={selectedQuestion}
          setSelectedQuestion={setSelectedQuestion}
        />
        <SelectedQuestionContainer
          className="flex-1"
          selectedQuestion={selectedQuestion}
          setSelectedQuestion={setSelectedQuestion}
        />
      </div>

      {/* NOTE: Mobile */}
      <div className="md:hidden">
        {selectedQuestion ? (
          <SelectedQuestionContainer
            className="absolute top-0 bottom-0 z-10"
            selectedQuestion={selectedQuestion}
            setSelectedQuestion={setSelectedQuestion}
          />
        ) : (
          <CategoriesResultsList
            selectedQuestion={selectedQuestion}
            setSelectedQuestion={setSelectedQuestion}
          />
        )}
      </div>
    </>
  );
};

export default FeedbackTab;
