import { c } from '../../lib';
import { Question } from '../../types';

interface ExplanationTabProps extends React.HTMLAttributes<HTMLDivElement> {
  question: Question;
  closeExplanationTab: () => void;
}

const ExplanationTab: React.FC<ExplanationTabProps> = ({
  question,
  closeExplanationTab,
  ...rest
}) => {
  return (
    <div
      {...rest}
      className={c(
        'flex flex-col bg-white px-6 py-4 transition',
        rest.className
      )}
    >
      <button className="ml-auto" onClick={closeExplanationTab}>
        <img alt="exit icon" src="images/icon_x.svg" className="w-6" />
      </button>
      <div className="mb-[5vh]">
        <p className="mb-[2vh] text-theme-light-gray">Question</p>
        <p className="text-small-title font-extralight">{question.body}</p>
      </div>
      <div className="mb-[5vh]">
        <p className="mb-[2vh] text-theme-light-gray">Answer</p>
        <p className="text-small-title font-semibold text-theme-green">
          {question.answers[question.rightAnswerIndex]}
        </p>
      </div>
      <div className="flex flex-1 flex-col rounded-[0.2rem] border border-theme-light-gray text-theme-dark-gray">
        <b className="border-b border-theme-light-gray px-4 py-3">
          <p>Explanation</p>
        </b>
        <div className="max-h-[30vh] overflow-y-auto border-b border-theme-light-gray bg-[#f4f4f4] p-4 scrollbar-thin scrollbar-thumb-theme-light-gray scrollbar-thumb-rounded-full">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <br />
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <br />
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
        <div className="flex flex-1 flex-col px-6 py-4">
          <p className="mb-[1vh]">
            <b>Additional Information:</b>
          </p>
          <div className="flex flex-1 flex-col justify-around">
            <div className="flex items-center gap-2">
              <img
                alt="document icon"
                src="images/icon_document.svg"
                className="h-6"
              />
              <span>Waveform Document (PDF)</span>
            </div>
            <div className="flex items-center gap-2">
              <img alt="icon" src="images/icon_image.svg" className="h-6" />
              <span>Image of Waveform</span>
            </div>
            <div className="flex items-center gap-2">
              <img
                alt="hyper link icon"
                src="images/icon_hyperlink.svg"
                className="h-6"
              />
              <span>Further Information on Period and Wavelength</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplanationTab;
