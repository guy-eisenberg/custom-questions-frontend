import { useNavigate } from 'react-router-dom';
import { ExamTypePageButton, LoadingScreen } from '../components';
import { useDispatch, useExam, useParams } from '../hooks';
import { ActivityMode, setMode } from '../redux';

const ExamTypePage: React.FC = () => {
  const navigate = useNavigate();

  const { examId: activityId } = useParams();

  const { status, exam, error } = useExam();

  console.log(exam);

  const dispatch = useDispatch();

  if (status === 'loading' || !exam) return <LoadingScreen />;

  if (status === 'error' || error)
    throw new Error(`Error fetching exam: ${error}`);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-[12vh] px-4 py-6">
      <div>
        <h1 className="mb-[8vh] text-center text-small-title text-theme-dark-gray">
          Select an Exam Type:
        </h1>
        <div className="flex max-w-2xl flex-col gap-[2vh]">
          <ExamTypePageButton
            title="Normal Mode"
            onClick={() => startWithMode('normal')}
          >
            In this mode, the computer uses pre-determined question quantity,
            time and question types to provide a realistic examination
            environment.
          </ExamTypePageButton>
          {exam.allow_copilot && (
            <ExamTypePageButton
              title="CoPilot Mode"
              onClick={() => startWithMode('copilot')}
            >
              In this mode, the computer changes the question types it provides
              to you based on how well you're doing.
            </ExamTypePageButton>
          )}
          {exam.customization_mode && (
            <ExamTypePageButton
              title="Customization Mode"
              onClick={() => startWithMode('customization')}
            >
              In this mode, you decide the question quantity, time and question
              types to be used in your examination.
            </ExamTypePageButton>
          )}
        </div>
      </div>
      <img
        alt="logo"
        src="images/logo.svg"
        className="bottom-4 mt-auto w-1/2 md:absolute md:bottom-[1vw] md:left-[1vw] md:w-[10%]"
      />
    </main>
  );

  function startWithMode(mode: ActivityMode) {
    dispatch(setMode(mode));

    if (mode === 'customization') {
      navigate(`/${activityId}/customize`, { replace: true });
      return;
    }

    navigate(`/${activityId}/run`, { replace: true });
  }
};

export default ExamTypePage;
