import { StartPageButton } from '../components';

const StartPage: React.FC = () => {
  return (
    <main className="flex h-full flex-col items-center justify-around text-center text-theme-dark-gray">
      <div className="w-[calc(100%-4rem)] max-w-7xl">
        <h1 className="text-small-title md:border-b md:border-b-theme-light-gray md:pb-[5vh] md:text-title">
          Maths
        </h1>
        <div className="mt-[3vh] grid w-full grid-cols-2 gap-4 md:flex md:justify-between md:gap-[1vw]">
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
        className="bottom-4 w-1/2 md:absolute md:bottom-[1vw] md:left-[1vw] md:w-2/12"
      />
    </main>
  );
};

export default StartPage;
