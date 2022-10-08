import { ExamTypePageButton } from '../components';

const ExamTypePage: React.FC = () => {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-[12vh] px-4 py-6">
      <div>
        <h1 className="mb-[8vh] text-center text-small-title text-theme-dark-gray">
          Select an Exam Type:
        </h1>
        <div className="flex max-w-2xl flex-col gap-6">
          <ExamTypePageButton title="Normal Mode">
            In this mode, the computer uses pre-determined question quantity,
            time and question types to provide a realistic examination
            environment.
          </ExamTypePageButton>
          <ExamTypePageButton title="CoPilot Mode">
            In this mode, the computer changes the question types it provides to
            you based on how well you're doing.
          </ExamTypePageButton>
          <ExamTypePageButton title="Customization Mode">
            In this mode, you decide the question quantity, time and question
            types to be used in your examination.
          </ExamTypePageButton>
        </div>
      </div>
      <img
        alt="logo"
        src="images/logo.svg"
        className="bottom-4 mt-auto w-1/2 md:absolute md:bottom-[1vw] md:left-[1vw] md:w-[10%]"
      />
    </main>
  );
};

export default ExamTypePage;
