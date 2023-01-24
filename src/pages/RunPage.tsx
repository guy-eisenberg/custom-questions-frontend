import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getExam } from '../api';
import {
  ExitModal,
  ExplanationTab,
  LoadingScreen,
  Navbar,
  PauseIndicator,
  PieTimer,
  PreSumbitModal,
  QuestionMap,
  TabsContent,
  TrainingModeModal,
} from '../components';
import {
  ClockEvent,
  useClock,
  useDispatch,
  useExam,
  useFlaggedQuestions,
  useRefState,
  useSelector,
} from '../hooks';
import { c, p } from '../lib';
import {
  calculateScore,
  CategoryResults,
  editCategoriesResults,
  increaseTime,
  resetExam as _resetExam,
  setTrainingMode,
} from '../redux';
import { Category, Question } from '../types';

interface CategoryWeakMap {
  parentCategoryId?: string;
  points: number;
}

const RunPage: React.FC = () => {
  const navigate = useNavigate();

  const exam = useExam();
  const { flaggedQuestionsIds, mutateFlaggedQuestions } = useFlaggedQuestions();

  const { status, data, error } = useQuery(['exam'], () => getExam(exam.id), {
    retry: 0,
    staleTime: Infinity,
  });

  const dispatch = useDispatch();
  const examState = useSelector((state) => state.exam);

  const clock = useClock();
  const timer = useRef<ClockEvent | undefined>();

  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [trainingModeModalOpen, setTrainingModeModalOpen] = useState(false);
  const [preSubmitModalOpen, setPreSubmitModalOpen] = useState(false);
  const [questionMapOpen, setQuestionMapOpen] = useState(false);
  const [explanationTabOpen, setExplanationTabOpen] = useState(false);

  const [questions, setQuestions, questionsRef] = useRefState<
    (Question & { selectedAnswerId?: string })[]
  >([]);

  const [, setCategory, categoryRef] = useRefState<Category | undefined>(
    undefined
  );

  const [currentQuestion, setCurrentQuestion, currentQuestionRef] = useRefState<
    (Question & { index: number }) | undefined
  >(undefined);

  const showControls =
    exam.allow_user_navigation ||
    exam.flag_questions ||
    exam.question_map ||
    examState.trainingMode;

  const questionsQuantity =
    examState.mode === 'customization'
      ? examState.customization!.question_quantity
      : exam.question_quantity;

  const onCoPilot =
    examState.mode === 'copilot' ||
    (examState.mode === 'customization' &&
      examState.customization?.copilot_activated);

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

  const allQuestions = useMemo(() => {
    return allCategories.reduce(
      (arr, category) => [
        ...arr,
        ...category.questions.map(shuffleQuestionAnswers),
      ],
      [] as Question[]
    );

    function shuffleQuestionAnswers(question: Question): Question {
      return {
        ...question,
        answers: _.shuffle(question.answers),
      };
    }
  }, [allCategories]);

  const customContent = useMemo(() => {
    if (exam.custom_content) {
      switch (exam.custom_content.type) {
        case 'image':
          return (
            <img
              alt=""
              className="max-h-96"
              src={exam.custom_content.content}
            />
          );
        case 'text':
          return <p className="text-sm">{exam.custom_content.content}</p>;
        case 'tabs':
          return <TabsContent tabs={exam.custom_content.content} />;
      }
    }
  }, [exam.custom_content]);

  const changeQuestion = useCallback(
    (question: Question & { index: number }) => {
      const newQuestions = [...questionsRef.current];
      newQuestions[question.index] = {
        ...newQuestions[question.index],
        ...question,
      };

      const newCategory = allCategories.find(
        (category) => category.id === question.category_id
      );

      setQuestions(newQuestions);
      setCategory(newCategory);
      setCurrentQuestion(question);

      dispatch(calculateScore());
    },
    [
      dispatch,
      questionsRef,
      setCurrentQuestion,
      setQuestions,
      setCategory,
      allCategories,
    ]
  );

  const submitAnswer = useCallback(
    (selectedAnswerId?: string) => {
      const newQuestions = [...questionsRef.current];

      var newSelectedAnswerId: string | undefined =
        newQuestions[currentQuestionRef.current!.index].selectedAnswerId;

      if (selectedAnswerId !== undefined)
        newSelectedAnswerId = selectedAnswerId;

      newQuestions[currentQuestionRef.current!.index].selectedAnswerId =
        newSelectedAnswerId;

      dispatch(
        editCategoriesResults({
          category: categoryRef.current!,
          question: currentQuestionRef.current!,
          selectedAnswerId: newSelectedAnswerId,
        })
      );

      setQuestions(newQuestions);
    },
    [categoryRef, currentQuestionRef, dispatch, questionsRef, setQuestions]
  );

  const submitExam = useCallback(() => {
    if (exam.show_results) navigate(`/${exam.id}/complete/overview`);
    else navigate(`/${exam.id}`);
  }, [navigate, exam.id, exam.show_results]);

  useEffect(function setupBackgroundClickHandler() {
    document.addEventListener('click', onBackgroundClick);

    return () => document.removeEventListener('click', onBackgroundClick);

    function onBackgroundClick() {
      setQuestionMapOpen(false);
      setExplanationTabOpen(false);
    }
  }, []);

  useEffect(
    function trackTime() {
      timer.current = clock.addInterval(() => {
        dispatch(increaseTime());
      }, 1000);

      return () => timer.current!.cancel();
    },
    [dispatch, clock]
  );

  useEffect(
    function handlePauseResume() {
      if (!timer.current) return;

      if (examState.paused) timer.current.pause();
      else timer.current.resume();
    },
    [examState.paused]
  );

  useEffect(() => {
    if (!currentQuestionRef.current) return;

    if (
      !exam.allow_user_navigation &&
      examState.time > 0 &&
      examState.time % exam.question_duration === 0
    ) {
      submitAnswer(undefined);

      if (currentQuestionRef.current.index + 1 < questionsQuantity) {
        changeQuestion({
          ...questionsRef.current[currentQuestionRef.current.index + 1],
          index: currentQuestionRef.current.index + 1,
        });
      } else submitExam();
    }
  }, [
    navigate,
    submitExam,
    changeQuestion,
    submitAnswer,
    currentQuestionRef,
    exam,
    examState.mode,
    examState.customization,
    examState.time,
    questionsRef,
    questionsQuantity,
  ]);

  useEffect(
    function finishAfterTime() {
      const timeRemaining = exam.duration - examState.time;

      if (timeRemaining <= 0) submitExam();
    },
    [navigate, submitExam, exam.id, exam.duration, examState.time]
  );

  //  Generate questions:
  useEffect(
    function pickQuestions() {
      const selectedQuestions = _.sampleSize(
        allQuestions,
        exam.question_quantity
      );

      if (
        examState.mode === 'copilot' ||
        (examState.mode === 'customization' &&
          examState.customization?.copilot_activated)
      )
        setQuestions([selectedQuestions[0]]);
      else setQuestions(selectedQuestions);

      setCurrentQuestion({ ...selectedQuestions[0], index: 0 });
      setCategory(
        allCategories.find(
          (category) => category.id === selectedQuestions[0].category_id
        )
      );
    },
    [
      setCurrentQuestion,
      setQuestions,
      setCategory,
      exam,
      examState.mode,
      examState.customization,
      allCategories,
      allQuestions,
    ]
  );

  useEffect(
    function generateCategoriesWeakMap() {
      if (!currentQuestionRef.current) return;

      const categoriesWeakMap: { [id: string]: CategoryWeakMap } = {};

      Object.entries(examState.categoriesResults).forEach((categoryResult) =>
        setCategoryWeakPoints(categoryResult)
      );

      if (
        examState.mode === 'copilot' ||
        (examState.mode === 'customization' &&
          examState.customization?.copilot_activated)
      ) {
        const sortedCategoriesByWeakness = Object.entries(categoriesWeakMap)
          .filter(([, c]) => c.points > 0)
          .sort(([, c1], [, c2]) => c2.points - c1.points)
          .map(([id]) => id);

        var pickedQuestion: Question | undefined;
        var weakestCategoryIndex = 0;

        do {
          const weakestCategoryId =
            sortedCategoriesByWeakness[weakestCategoryIndex];

          pickedQuestion = _.sample(
            allQuestions.filter(
              (question) =>
                question.category_id === weakestCategoryId &&
                !questionsRef.current
                  .map((question) => question.id)
                  .includes(question.id)
            )
          );

          if (!pickedQuestion) {
            const parentCategory = allCategories.find((category) =>
              category.sub_categories
                .map((category) => category.id)
                .includes(weakestCategoryId)
            );

            if (parentCategory) {
              const siblingCategories = parentCategory.sub_categories;

              const relatedCategoriesIds = [
                parentCategory.id,
                ...siblingCategories.map((category) => category.id),
              ];

              pickedQuestion = _.sample(
                allQuestions.filter(
                  (question) =>
                    relatedCategoriesIds.includes(question.category_id) &&
                    !questionsRef.current
                      .map((question) => question.id)
                      .includes(question.id)
                )
              );
            }
          }

          weakestCategoryIndex += 1;

          if (
            !pickedQuestion &&
            weakestCategoryIndex > sortedCategoriesByWeakness.length - 1
          )
            pickedQuestion = _.sample(
              allQuestions.filter(
                (question) =>
                  !questionsRef.current
                    .map((question) => question.id)
                    .includes(question.id)
              )
            )!;
        } while (!pickedQuestion);

        const newQuestion = {
          ...pickedQuestion,
          index: currentQuestionRef.current!.index + 1,
        };

        setQuestions((questions) => {
          if (!questions[newQuestion.index]) {
            const newQuestions = [...questions];

            newQuestions[newQuestion.index] = {
              ...newQuestions[newQuestion.index],
              ...newQuestion,
            };

            return newQuestions;
          }

          return questions;
        });
      }

      function setCategoryWeakPoints(
        categoryResult: [string, CategoryResults],
        parentCategoryId?: string
      ) {
        const [id, category] = categoryResult;

        if (categoriesWeakMap[id] === undefined)
          categoriesWeakMap[id] = {
            parentCategoryId,
            points: 0,
          };

        categoriesWeakMap[id].points = getCategoryWeakPoints(category);

        Object.entries(category.subCategories).forEach((subCategoryResult) =>
          setCategoryWeakPoints(subCategoryResult, id)
        );
      }

      function getCategoryWeakPoints(category: CategoryResults): number {
        return Object.values(category.questions).reduce((sum, question) => {
          const rightAnswerId = question.answers.find(
            (answer) => answer.is_right
          )!.id;

          return sum + (question.selectedAnswerId === rightAnswerId ? -1 : 1);
        }, 0);
      }
    },
    [
      setQuestions,
      changeQuestion,
      currentQuestionRef,
      questionsRef,
      allCategories,
      allQuestions,
      exam.allow_user_navigation,
      examState.mode,
      examState.customization,
      examState.categoriesResults,
    ]
  );

  if (status === 'loading' || !data) return <LoadingScreen />;

  if (status === 'error' || error)
    throw new Error(`Error fetching exam: ${error}`);

  return (
    <main className="relative flex flex-1 flex-col bg-white">
      <Navbar
        className="h-14"
        showExitModal={() => setExitModalOpen(true)}
        showTrainingModeModal={() => setTrainingModeModalOpen(true)}
      />
      <div className="fixed top-14 h-1 w-full">
        <div
          className="h-full bg-theme-extra-dark-gray transition-all"
          style={{
            width: `calc(${
              ((currentQuestion?.index || 0) + 1) / questionsQuantity
            } * 100%)`,
          }}
        ></div>
      </div>
      {!exam.allow_user_navigation && (
        <PieTimer
          time={exam.question_duration * 1000}
          className="fixed top-20 right-8"
          key={currentQuestion?.index}
        />
      )}
      <div className="relative flex flex-1 flex-col items-center justify-evenly gap-6 px-4 py-6">
        {examState.trainingMode && examState.paused && (
          <PauseIndicator className="absolute top-12 right-12" />
        )}
        <div className="mt-6 flex w-[90%] justify-center whitespace-pre-wrap md:mt-0 md:w-4/5">
          {customContent}
        </div>
        <p className="text-center text-lg font-semibold text-theme-dark-gray md:text-small-title">
          {currentQuestion?.body}
        </p>
        <div className="flex w-3/4 max-w-lg flex-col gap-[2vh] md:w-full">
          {currentQuestion?.answers.map((answer, i) => (
            <AnswerButton
              className={c(
                examState.trainingMode &&
                  questions[currentQuestion.index].selectedAnswerId !==
                    undefined &&
                  (i ===
                  currentQuestion.answers.findIndex((answer) => answer.is_right)
                    ? '!bg-theme-green !text-white'
                    : questions[currentQuestion.index].selectedAnswerId ===
                        answer.id && '!bg-theme-red !text-white')
              )}
              selected={
                answer.id === questions[currentQuestion.index].selectedAnswerId
              }
              disabled={examState.paused}
              onClick={() => {
                if (
                  questions[currentQuestion.index].selectedAnswerId ===
                    undefined ||
                  examState.trainingMode
                )
                  submitAnswer(answer.id);
              }}
              key={i}
            >
              {answer.body}
            </AnswerButton>
          ))}
        </div>
        {showControls && currentQuestion && (
          <div className="flex items-center rounded-[2rem] bg-[#f2f2f2] p-3">
            {exam.allow_user_navigation && (
              <QuestionNavigationButton
                className="mr-3"
                dir="left"
                onClick={() => {
                  if (currentQuestion.index > 0)
                    changeQuestion({
                      ...questions[currentQuestion.index - 1],
                      index: currentQuestion.index - 1,
                    });
                }}
                disabled={examState.paused || currentQuestion.index === 0}
              />
            )}
            <button
              className={c(
                'overflow-hidden transition-all hover:scale-105 active:scale-95 active:brightness-95',
                examState.trainingMode ? 'mx-3 max-w-[2rem]' : 'mx-0 max-w-0'
              )}
              onClick={(e) => {
                e.stopPropagation();

                setExplanationTabOpen(true);
              }}
            >
              <img
                alt="explanation icon"
                src={p('images/icon_explanation.svg')}
                className="w-8"
              />
            </button>
            {exam.question_map && (
              <button
                className="mx-3 transition hover:scale-105 active:scale-95 active:brightness-95"
                onClick={(e) => {
                  e.stopPropagation();

                  setQuestionMapOpen(true);
                }}
              >
                <img
                  alt="question map icon"
                  src={p('images/icon_question_map.svg')}
                  className="w-8"
                />
              </button>
            )}
            {exam.flag_questions && (
              <button
                className="mx-3 transition hover:scale-105 active:scale-95 active:brightness-95"
                onClick={() => {
                  mutateFlaggedQuestions({
                    questionId: currentQuestion.id,
                    flag: !flaggedQuestionsIds?.includes(currentQuestion.id),
                  });
                }}
              >
                <img
                  alt="flag question icon"
                  src={p(
                    `images/icon_flag_question${
                      flaggedQuestionsIds?.includes(currentQuestion.id)
                        ? '_red'
                        : ''
                    }.svg`
                  )}
                  className="w-8"
                />
              </button>
            )}
            {exam.allow_user_navigation && (
              <QuestionNavigationButton
                className="ml-3"
                dir="right"
                disabled={
                  examState.paused ||
                  (onCoPilot
                    ? currentQuestion.index >= questions.length - 1
                    : currentQuestion.index > questions.length - 1)
                }
                onClick={() => {
                  if (currentQuestion.index < questionsQuantity - 1)
                    changeQuestion({
                      ...questions[currentQuestion.index + 1],
                      index: currentQuestion.index + 1,
                    });
                  else setPreSubmitModalOpen(true);
                }}
                done={currentQuestion.index === questionsQuantity - 1}
              />
            )}
          </div>
        )}
      </div>
      {currentQuestion && (
        <div
          className={c(
            'fixed top-14 left-0 right-0 h-[calc(100%-3rem)] bg-black/40 transition-all',
            questionMapOpen ? 'visible opacity-100' : 'invisible opacity-0'
          )}
        >
          <QuestionMap
            className={c(
              'absolute left-full h-full w-full lg:max-w-lg',
              questionMapOpen && '-translate-x-full'
            )}
            onClick={(e) => e.stopPropagation()}
            allowNavigation={exam.allow_user_navigation}
            closeQuestionMap={() => {
              setQuestionMapOpen(false);
            }}
            jumpToQuestion={(questionNumber) => {
              changeQuestion({
                ...questions[questionNumber - 1],
                index: questionNumber - 1,
              });

              setQuestionMapOpen(false);
            }}
            currentQuestion={currentQuestion.index + 1}
            questions={questions}
          />
        </div>
      )}
      {examState.trainingMode && currentQuestion && (
        <div
          className={c(
            'fixed top-14 left-0 right-0 h-[calc(100%-3rem)] bg-black/40 transition-all',
            explanationTabOpen ? 'visible opacity-100' : 'invisible opacity-0'
          )}
        >
          <ExplanationTab
            className={c(
              'absolute right-full h-full w-full  transition lg:max-w-2xl',
              explanationTabOpen && 'translate-x-full'
            )}
            onClick={(e) => e.stopPropagation()}
            question={currentQuestion}
            closeExplanationTab={() => setExplanationTabOpen(false)}
          />
        </div>
      )}
      <ExitModal
        visible={exitModalOpen}
        hideModal={() => setExitModalOpen(false)}
        exitToMenu={() => navigate(`/${exam.id}`)}
      />
      <TrainingModeModal
        visible={trainingModeModalOpen}
        hideModal={() => setTrainingModeModalOpen(false)}
        onSubmit={() => {
          resetExam();

          setTrainingModeModalOpen(false);
        }}
      />
      <PreSumbitModal
        visible={preSubmitModalOpen}
        hideModal={() => setPreSubmitModalOpen(false)}
        onSubmit={submitExam}
      />
    </main>
  );

  function resetExam() {
    dispatch(_resetExam());
    dispatch(setTrainingMode(!examState.trainingMode));

    setQuestions(
      questions.map((question) => ({
        ...question,
        selectedAnswerId: undefined,
      }))
    );
    changeQuestion({ ...questions[0], index: 0 });
  }
};

export default RunPage;

const AnswerButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { selected: boolean }
> = ({ children, selected, ...rest }) => {
  return (
    <button
      {...rest}
      className={c(
        'rounded-md py-[2vh] px-[1vw] text-lg font-extralight transition md:text-small-title',
        selected
          ? 'bg-theme-blue text-white'
          : 'border border-theme-light-gray bg-white text-theme-medium-gray',
        rest.disabled
          ? 'brightness-90'
          : 'hover:scale-105 hover:shadow-md active:scale-95 active:brightness-95',
        rest.className
      )}
    >
      {children}
    </button>
  );
};

const QuestionNavigationButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    dir: 'left' | 'right';
    done?: boolean;
  }
> = ({ children, dir, done = false, ...rest }) => (
  <button
    {...rest}
    className={c(
      'group relative rounded-3xl bg-white px-6 py-2 transition',
      rest.disabled
        ? 'opacity-50'
        : 'shadow-md hover:scale-105 active:scale-95 active:brightness-95',
      rest.className
    )}
  >
    <img
      alt="left arrow icon"
      src={p(`images/icon_arrow.svg`)}
      className={c(
        'w-10 transition ease-in',
        dir === 'right' && 'rotate-180',
        !rest.disabled &&
          (dir === 'right'
            ? 'group-active:translate-x-2'
            : 'group-active:-translate-x-2'),
        done ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
      )}
    />
    <img
      alt="end test icon"
      src={p(`images/icon_end_test.svg`)}
      className={c(
        'absolute top-1/2 w-10 -translate-y-1/2 transition ease-out',
        done ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      )}
    />
  </button>
);
