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
  PreSumbitModal,
  QuestionMap,
  TrainingModeModal,
} from '../components';
import {
  ClockEvent,
  useClock,
  useDispatch,
  useExam,
  useRefState,
  useSelector,
} from '../hooks';
import { c } from '../lib';
import {
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
    (Question & { selectedAnswerIndex?: number })[]
  >([]);

  const [category, setCategory, categoryRef] = useRefState<
    Category | undefined
  >(undefined);

  const [currentQuestion, setCurrentQuestion, currentQuestionRef] = useRefState<
    (Question & { index: number }) | undefined
  >(undefined);

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

  const allQuestions = useMemo(
    () =>
      allCategories.reduce(
        (arr, category) => [...arr, ...category.questions],
        [] as Question[]
      ),
    [allCategories]
  );

  console.log(questions);
  console.log(currentQuestion?.index);

  const changeQuestion = useCallback(
    (question: Question & { index: number }) => {
      dispatch(
        editCategoriesResults({
          category: categoryRef.current!,
          question: currentQuestionRef.current!,
          selectedAnswerIndex:
            questionsRef.current[currentQuestionRef.current!.index]
              .selectedAnswerIndex,
        })
      );

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
    },
    [
      dispatch,
      questionsRef,
      categoryRef,
      currentQuestionRef,
      setCurrentQuestion,
      setQuestions,
      setCategory,
      allCategories,
    ]
  );

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

  useEffect(
    function finishAfterTime() {
      const timeRemaining = exam.duration - examState.time;

      if (timeRemaining <= 0) navigate(`/${exam.id}/complete/overview`);
    },
    [navigate, exam.id, exam.duration, examState.time]
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
          if (
            !questions[newQuestion.index] ||
            questions[newQuestion.index].selectedAnswerIndex === undefined
          ) {
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
        return Object.values(category.questions).reduce(
          (sum, right) => sum + (right ? -1 : 1),
          0
        );
      }
    },
    [
      setQuestions,
      currentQuestionRef,
      questionsRef,
      allCategories,
      changeQuestion,
      examState.categoriesResults,
      examState.mode,
      examState.customization,
      allQuestions,
    ]
  );

  if (status === 'loading' || !data) return <LoadingScreen />;

  if (status === 'error' || error)
    throw new Error(`Error fetching exam: ${error}`);

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

  return (
    <main className="relative flex flex-1 flex-col bg-white">
      <Navbar
        className="h-14"
        showExitModal={() => setExitModalOpen(true)}
        showTrainingModeModal={() => setTrainingModeModalOpen(true)}
      />
      <div className="relative flex flex-1 flex-col items-center justify-evenly px-4 py-6">
        {examState.trainingMode && examState.paused && (
          <PauseIndicator className="absolute top-12 right-12" />
        )}
        <p className="mb-[10vh] text-center text-small-title font-semibold text-theme-dark-gray">
          {currentQuestion?.body}
        </p>
        <div className="mb-[10vh] flex w-3/4 max-w-lg flex-col gap-[2vh] md:w-full">
          {currentQuestion?.answers.map((answer, i) => (
            <AnswerButton
              className={c(
                examState.trainingMode &&
                  questions[currentQuestion.index].selectedAnswerIndex !==
                    undefined &&
                  (i ===
                  currentQuestion.answers.findIndex((answer) => answer.is_right)
                    ? '!bg-theme-green !text-white'
                    : questions[currentQuestion.index].selectedAnswerIndex ===
                        i && '!bg-theme-red !text-white')
              )}
              selected={
                i === questions[currentQuestion.index].selectedAnswerIndex
              }
              onClick={() => submitAnswer(i)}
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
                disabled={currentQuestion.index === 0}
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
                src="images/icon_explanation.svg"
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
                  src="images/icon_question_map.svg"
                  className="w-8"
                />
              </button>
            )}
            {exam.flag_questions && (
              <button className="mx-3 transition hover:scale-105 active:scale-95 active:brightness-95">
                <img
                  alt="flag question icon"
                  src="images/icon_flag_question.svg"
                  className="w-8"
                />
              </button>
            )}
            {exam.allow_user_navigation && (
              <QuestionNavigationButton
                className="ml-3"
                dir="right"
                disabled={
                  onCoPilot
                    ? currentQuestion.index >= questions.length - 1
                    : currentQuestion.index > questions.length - 1
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
        onSubmit={() => navigate(`/${exam.id}/complete/overview`)}
      />
    </main>
  );

  function submitAnswer(selectedAnswerIndex: number) {
    const newQuestions = [...questions];

    newQuestions[currentQuestion!.index].selectedAnswerIndex =
      selectedAnswerIndex;

    dispatch(
      editCategoriesResults({
        category: category!,
        question: currentQuestion!,
        selectedAnswerIndex,
      })
    );

    setQuestions(newQuestions);
  }

  function resetExam() {
    dispatch(_resetExam());
    dispatch(setTrainingMode(!examState.trainingMode));

    setQuestions(
      questions.map((question) => ({
        ...question,
        selectedAnswerIndex: undefined,
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
        'rounded-md py-[3vh] px-[1vw] text-small-title font-extralight transition hover:scale-105 hover:shadow-md active:scale-95 active:brightness-95',
        selected
          ? 'bg-theme-blue text-white'
          : 'border border-theme-light-gray bg-white text-theme-medium-gray',
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
      src={`images/icon_arrow.svg`}
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
      src={`images/icon_end_test.svg`}
      className={c(
        'absolute top-1/2 w-10 -translate-y-1/2 transition ease-out',
        done ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      )}
    />
  </button>
);
