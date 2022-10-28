import { useState } from 'react';
import { c } from '../../lib';
import { Question } from '../../types';
import ImageModal from './ImageModal';

interface ExplanationTabProps extends React.HTMLAttributes<HTMLDivElement> {
  question: Question;
  closeExplanationTab: () => void;
}

const ExplanationTab: React.FC<ExplanationTabProps> = ({
  question,
  closeExplanationTab,
  ...rest
}) => {
  const rightAnswer = question.answers.find((answer) => answer.is_right)!;

  const [showImageModal, setShowImageModal] = useState(false);

  return (
    <>
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
          <p className="text-small-title font-extralight">{question?.body}</p>
        </div>
        <div className="mb-[5vh]">
          <p className="mb-[2vh] text-theme-light-gray">Answer</p>
          <p className="text-small-title font-semibold text-theme-green">
            {rightAnswer.body}
          </p>
        </div>
        <div className="flex flex-1 flex-col rounded-[0.2rem] border border-theme-light-gray text-theme-dark-gray">
          <b className="border-b border-theme-light-gray px-4 py-3">
            <p>Explanation</p>
          </b>
          <div className="h-[30vh] overflow-y-auto border-b border-theme-light-gray bg-[#f4f4f4] p-4 scrollbar-thin scrollbar-thumb-theme-light-gray scrollbar-thumb-rounded-full">
            {/* <p>{question.explanation}</p> */}
            {question.featured_image && (
              <button
                className="top-0 float-right mb-4 ml-4 mt-2 mr-2 h-36 transition hover:scale-105 hover:brightness-90"
                onClick={() => setShowImageModal(true)}
              >
                <img
                  alt="featured"
                  src={question.featured_image}
                  className="h-full"
                />
              </button>
            )}
            <p className="text-justify">{question.explanation}</p>
          </div>
          <div className="flex flex-1 flex-col px-6 py-4">
            <p className="mb-[3vh]">
              <b>Additional Information:</b>
            </p>
            <div className="flex flex-1 flex-col justify-between">
              {question.informations.map((information) => (
                <a
                  className="flex items-center gap-2 hover:underline"
                  href={information.hyperlink}
                  key={information.id}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    alt="information icon"
                    src={getInformationIcon(information.type)}
                    className="h-5 w-5"
                  />
                  <span>{information.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      {question.featured_image && (
        <ImageModal
          image={question.featured_image}
          visible={showImageModal}
          hideModal={() => setShowImageModal(false)}
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </>
  );

  function getInformationIcon(type: 'hyperlink' | 'image' | 'pdf') {
    switch (type) {
      case 'hyperlink':
        return 'images/icon_hyperlink.svg';
      case 'image':
        return 'images/icon_image.svg';
      case 'pdf':
        return 'images/icon_document.svg';
    }
  }
};

export default ExplanationTab;
