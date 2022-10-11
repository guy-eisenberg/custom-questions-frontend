import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getExam } from '../api';
import {
  ExitModal,
  ExplanationTab,
  LoadingScreen,
  Navbar,
  PauseIndicator,
  QuestionMap,
  TrainingModeModal,
} from '../components';
import {
  ClockEvent,
  useClock,
  useDispatch,
  useExam,
  useParams,
  useSelector,
} from '../hooks';
import { c } from '../lib';
import { increaseTime, resetActivity, setTrainingMode } from '../redux';
import { DBQuestion, Question } from '../types';

const RunPage: React.FC = () => {
  const navigate = useNavigate();
  const { examId } = useParams();

  const { exam } = useExam();

  console.log(exam);

  const { status, data, error } = useQuery(['exam'], () => getExam(examId), {
    retry: 0,
    staleTime: Infinity,
  });

  const dispatch = useDispatch();
  const activityState = useSelector((state) => state.activity);

  const clock = useClock();
  const timer = useRef<ClockEvent | undefined>();

  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [trainingModeModalOpen, setTrainingModeModalOpen] = useState(false);
  const [questionMapOpen, setQuestionMapOpen] = useState(false);
  const [explanationTabOpen, setExplanationTabOpen] = useState(false);

  const [questions, setQuestions] = useState<Question[]>(DUMMY_QUESTIONS);
  const [question, setQuestion] = useState(1);

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

  useEffect(() => {
    if (!timer.current) return;

    if (activityState.paused) timer.current.pause();
    else timer.current.resume();
  }, [activityState.paused]);

  if (status === 'loading' || !data) return <LoadingScreen />;

  if (status === 'error' || error)
    throw new Error(`Error fetching exam: ${error}`);

  const currentQuestion =
    questions.length > 0 ? questions[question - 1] : undefined;

  return (
    <main className="relative flex flex-1 flex-col bg-white">
      <Navbar
        className="h-14"
        showExitModal={() => setExitModalOpen(true)}
        showTrainingModeModal={() => setTrainingModeModalOpen(true)}
      />
      <div className="relative flex flex-1 flex-col items-center justify-evenly px-4 py-6">
        {activityState.trainingMode && activityState.paused && (
          <PauseIndicator className="absolute top-12 right-12" />
        )}
        <p className="mb-[10vh] text-center text-small-title font-semibold text-theme-dark-gray">
          {currentQuestion?.body}
        </p>
        <div className="mb-[10vh] flex w-3/4 max-w-sm flex-col gap-[2vh] md:w-full">
          {currentQuestion?.answers.map((answer, i) => (
            <AnswerButton
              className={c(
                activityState.trainingMode &&
                  currentQuestion.selectedAnswerIndex !== undefined &&
                  (i === currentQuestion.rightAnswerIndex
                    ? '!bg-theme-green !text-white'
                    : currentQuestion.selectedAnswerIndex === i &&
                      '!bg-theme-red !text-white')
              )}
              selected={i === currentQuestion.selectedAnswerIndex}
              onClick={() => {
                const newQuestions = [...questions];

                newQuestions[question - 1].selectedAnswerIndex = i;

                setQuestions(newQuestions);
              }}
              key={i}
            >
              {answer}
            </AnswerButton>
          ))}
        </div>
        <div className="flex items-center rounded-[2rem] bg-[#f2f2f2] p-3">
          <QuestionNavigationButton
            className="mr-3"
            dir="left"
            onClick={() => {
              if (question > 1) setQuestion(question - 1);
            }}
            disabled={question === 1}
          />
          <button
            className={c(
              'overflow-hidden transition-all hover:scale-105 active:scale-95 active:brightness-95',
              activityState.trainingMode ? 'mx-3 max-w-[2rem]' : 'mx-0 max-w-0'
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
          <button className="mx-3 transition hover:scale-105 active:scale-95 active:brightness-95">
            <img
              alt="flag question icon"
              src="images/icon_flag_question.svg"
              className="w-8"
            />
          </button>
          <QuestionNavigationButton
            className="ml-3"
            dir="right"
            onClick={() => {
              if (question < questions.length) setQuestion(question + 1);
            }}
            done={question === questions.length}
          />
        </div>
      </div>
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
          closeQuestionMap={() => {
            setQuestionMapOpen(false);
          }}
          jumpToQuestion={(question) => {
            setQuestion(question);

            setQuestionMapOpen(false);
          }}
          currentQuestion={question}
          questions={questions}
        />
      </div>
      {activityState.trainingMode && (
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
            question={questions[question - 1]}
            closeExplanationTab={() => setExplanationTabOpen(false)}
          />
        </div>
      )}
      <ExitModal
        visible={exitModalOpen}
        hideModal={() => setExitModalOpen(false)}
        exitToMenu={() => navigate('/activityId')}
      />
      <TrainingModeModal
        visible={trainingModeModalOpen}
        hideModal={() => setTrainingModeModalOpen(false)}
        onSubmit={() => {
          resetExam();

          setTrainingModeModalOpen(false);
        }}
      />
    </main>
  );

  function resetExam() {
    dispatch(resetActivity());
    dispatch(setTrainingMode(!activityState.trainingMode));

    setQuestions(
      questions.map((question) => ({
        ...question,
        selectedAnswerIndex: undefined,
      }))
    );
    setQuestion(1);
  }
};

export default RunPage;

const DUMMY_QUESTIONS = new Array(10).fill(null).map(
  (a, i): DBQuestion => ({
    body: `Question ${i + 1}`,
    answers: ['Amplitude', 'Wavelength', 'Frequency'],
    rightAnswerIndex: _.random(0, 2),
  })
);

const AnswerButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { selected: boolean }
> = ({ children, selected, ...rest }) => {
  return (
    <button
      {...rest}
      className={c(
        'rounded-md py-[3vh] text-small-title font-extralight transition hover:scale-105 hover:shadow-md active:scale-95 active:brightness-95',
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
        !rest.disabled &&
          (dir === 'right'
            ? 'rotate-180 group-active:translate-x-2'
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
