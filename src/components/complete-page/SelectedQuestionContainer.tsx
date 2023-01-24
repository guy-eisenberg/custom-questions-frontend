import { useMemo, useState } from 'react';
import { useExam, useFlaggedQuestions } from '../../hooks';
import { c, getInformationIcon, p } from '../../lib';
import { Category, Question } from '../../types';
import { ImageModal } from '../common';

type AnsweredQuestion = Question & {
  selectedAnswerId?: string;
};

interface SelectedQuestionContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  selectedQuestion: AnsweredQuestion | undefined;
  setSelectedQuestion: (question: AnsweredQuestion | undefined) => void;
}

const SelectedQuestionContainer: React.FC<SelectedQuestionContainerProps> = ({
  selectedQuestion,
  setSelectedQuestion,
  ...rest
}) => {
  const exam = useExam();
  const { flaggedQuestionsIds, mutateFlaggedQuestions } = useFlaggedQuestions();

  const [showImageModal, setShowImageModal] = useState(false);

  const allCategories = useMemo(() => {
    return exam.categories.reduce(
      (arr, category) => [...arr, ...flatCategory(category)],
      [] as Category[]
    );

    function flatCategory(category: Category): Category[] {
      return [
        category,
        ...category.sub_categories.reduce(
          (arr, category) => [...arr, ...flatCategory(category)],
          [] as Category[]
        ),
      ];
    }
  }, [exam.categories]);

  return (
    <>
      <div {...rest} className={c('flex flex-col md:flex-row', rest.className)}>
        <div className="flex justify-center bg-white py-4 md:flex-1 md:py-8 md:px-12">
          {selectedQuestion &&
            (() => {
              const correctAnswer = selectedQuestion.answers.find(
                (answer) => answer.is_right
              )!;

              const parentCategory = allCategories.find(
                (category) => category.id === selectedQuestion.category_id
              )!;

              const rootCategory = allCategories.find(
                (category) => category.id === parentCategory.parent_category_id
              );

              const flagged = flaggedQuestionsIds?.includes(
                selectedQuestion.id
              );

              return (
                <div className="flex w-full flex-col">
                  <div className="flex items-center justify-between border-b border-b-theme-light-gray px-4 pb-4 text-theme-medium-gray md:px-0 md:pb-6">
                    <p className="hidden md:block">
                      <b>Question</b> in{' '}
                      {rootCategory ? rootCategory.name : parentCategory.name}
                      {rootCategory && `, ${parentCategory.name}`}
                    </p>
                    <button
                      className="md:hidden"
                      onClick={() => setSelectedQuestion(undefined)}
                    >
                      <img
                        alt="arrow icon"
                        src={p('images/icon_arrow.svg')}
                        className="h-6 w-6 opacity-50"
                      />
                    </button>
                    <button
                      className="flex flex-row-reverse items-center gap-1 rounded-full py-1 px-3 text-sm transition hover:scale-105 active:scale-95 active:brightness-95 md:flex-row md:border md:border-theme-light-gray md:shadow-md"
                      onClick={() =>
                        mutateFlaggedQuestions({
                          questionId: selectedQuestion.id,
                          flag: !flagged,
                        })
                      }
                    >
                      <img
                        alt="flag icon"
                        src={p(
                          `images/icon_flag_question${
                            flagged ? '_red' : ''
                          }.svg`
                        )}
                        className="h-6 w-6"
                      />
                      <span
                        className={c(
                          'font-semibold',
                          flagged && 'text-[#db214e]'
                        )}
                      >
                        {flagged ? 'Flagged' : 'Not Flagged'}
                      </span>
                    </button>
                  </div>
                  <div className="flex flex-1 flex-col px-4 md:px-0">
                    <h1 className="mt-6 text-2xl font-semibold text-theme-extra-dark-gray md:mt-8 md:text-4xl">
                      {selectedQuestion.body}
                    </h1>
                    <h2 className="mt-10 text-xl font-semibold text-theme-green md:text-2xl">
                      {correctAnswer.body}
                    </h2>
                    <div className="mt-16 flex flex-col text-sm md:mt-auto">
                      <p className="mb-4 font-semibold text-theme-medium-gray">
                        You selected:
                      </p>
                      <ul className="flex flex-col gap-1">
                        {selectedQuestion.answers.map((answer) => (
                          <li
                            className={c(
                              'flex items-center gap-2 rounded-md bg-[#f0f0f0] px-6 py-4 text-theme-dark-gray',
                              selectedQuestion.selectedAnswerId === answer.id &&
                                'shadow-md'
                            )}
                            style={{
                              backgroundColor:
                                selectedQuestion.selectedAnswerId === answer.id
                                  ? answer.id === correctAnswer.id
                                    ? '#94e262'
                                    : '#fd8989'
                                  : undefined,
                              color:
                                selectedQuestion.selectedAnswerId === answer.id
                                  ? 'white'
                                  : undefined,
                            }}
                            key={answer.id}
                          >
                            {selectedQuestion.selectedAnswerId ===
                              answer.id && (
                              <img
                                alt="right/wrong icon"
                                className="h-5 w-5"
                                src={p(
                                  `images/icon_${
                                    answer.id === correctAnswer.id
                                      ? 'correct'
                                      : 'incorrect'
                                  }_white.svg`
                                )}
                              />
                            )}
                            <span>{answer.body}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })()}
        </div>
        <div className="bg-[#f4f4f4] md:w-1/3 md:border-l md:border-l-[#dfdfdf] md:bg-[#f7f7f7]">
          {selectedQuestion &&
            (() => (
              <div className="flex h-full flex-col p-4 md:p-8">
                <p className="w-full border-b border-b-theme-light-gray pb-4 font-semibold leading-[34px] text-theme-medium-gray md:pb-6">
                  Explanation
                </p>
                <div className="mt-4 flex flex-1 flex-col items-start md:mt-8">
                  {selectedQuestion.featured_image && (
                    <button
                      className="h-36 transition hover:scale-105 hover:brightness-90"
                      onClick={() => setShowImageModal(true)}
                    >
                      <img
                        alt="featured"
                        className="h-full"
                        src={selectedQuestion.featured_image}
                      />
                    </button>
                  )}
                  <p className="mt-4 text-sm font-light text-theme-medium-gray md:text-base">
                    {selectedQuestion.explanation}
                  </p>
                  {selectedQuestion.informations.length > 0 && (
                    <div className="mt-4 flex flex-1 flex-col text-theme-medium-gray">
                      <p className="mb-[2vh]">
                        <b>Additional Information:</b>
                      </p>
                      <div className="flex flex-1 flex-col justify-between">
                        {selectedQuestion.informations.map((information) => (
                          <a
                            className="flex items-center gap-2 hover:underline"
                            href={information.hyperlink}
                            key={information.id}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              alt="information icon"
                              src={p(getInformationIcon(information.type))}
                              className="h-5 w-5"
                            />
                            <span>{information.name}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))()}
        </div>
      </div>

      {selectedQuestion && selectedQuestion.featured_image && (
        <ImageModal
          image={selectedQuestion.featured_image}
          visible={showImageModal}
          hideModal={() => setShowImageModal(false)}
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </>
  );
};

export default SelectedQuestionContainer;
