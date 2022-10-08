import { StartPageButton } from '../components';

const StartPage: React.FC = () => {
  return (
    <main className="flex flex-1 flex-col items-center gap-[12vh] px-4 py-6 text-center text-theme-dark-gray md:justify-center">
      <div className="w-full max-w-7xl">
        <h1 className="text-small-title md:border-b md:border-b-theme-light-gray md:pb-[5vh] md:text-title">
          Maths
        </h1>
        <div className="mt-[3vh] grid w-full grid-cols-2 gap-[2vh] md:flex md:justify-between md:gap-[1vw]">
          <StartPageButton
            icon="icon_start.svg"
            color="blue"
            className="flex-1"
          >
            Start Activity
          </StartPageButton>
          <StartPageButton
            icon="icon_mortarboard.svg"
            color="green"
            className="flex-1"
          >
            Training Mode
          </StartPageButton>
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
        src="images/logo.svg"
        className="bottom-4 mt-auto w-1/2 md:absolute md:bottom-[1vw] md:left-[1vw] md:w-[10%]"
      />
    </main>
  );
};

export default StartPage;
