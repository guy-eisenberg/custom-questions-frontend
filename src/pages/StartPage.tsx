import { useNavigate } from 'react-router-dom';
import { StartPageButton } from '../components';
import { useDispatch, useExam } from '../hooks';
import { p } from '../lib';
import { setTrainingMode } from '../redux';

const StartPage: React.FC = () => {
  const navigate = useNavigate();

  const exam = useExam();

  const dispatch = useDispatch();

  if (!exam) return null;

  console.log(exam);

  return (
    <main className="flex flex-1 flex-col items-center gap-[12vh] px-4 py-6 text-center text-theme-dark-gray md:justify-center">
      <div className="w-full max-w-7xl">
        <h1 className="text-small-title md:border-b md:border-b-theme-light-gray md:pb-[5vh] md:text-title">
          {exam.name}
        </h1>
        <div className="mt-[3vh] grid w-full grid-cols-2 gap-[2vh] md:flex md:justify-between md:gap-[1vw]">
          <StartPageButton
            icon="icon_start.svg"
            color="blue"
            className="flex-1"
            onClick={() => {
              dispatch(setTrainingMode(false));

              navigate('select-type');
            }}
          >
            Start Exam
          </StartPageButton>
          {exam.training_mode && (
            <StartPageButton
              icon="icon_mortarboard.svg"
              color="green"
              className="flex-1"
              onClick={() => {
                dispatch(setTrainingMode(true));

                navigate('select-type');
              }}
            >
              Training Mode
            </StartPageButton>
          )}
          <StartPageButton icon="icon_performance.svg" className="flex-1">
            Performance
          </StartPageButton>
          <StartPageButton icon="icon_help.svg" className="flex-1">
            User Guide
          </StartPageButton>
          <StartPageButton icon="icon_exam_builder.svg" className="flex-1">
            Exam Builder
          </StartPageButton>
        </div>
      </div>
      <img
        alt="logo"
        src={p('images/logo.svg')}
        className="bottom-4 mt-auto w-1/2 md:absolute md:bottom-[1vw] md:left-[1vw] md:w-[10%]"
      />
    </main>
  );
};

export default StartPage;
