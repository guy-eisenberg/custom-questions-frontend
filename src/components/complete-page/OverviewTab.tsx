import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useExam } from '../../hooks';
import { c } from '../../lib';
import BarGraph from './BarGraph';
import BreakdownContainer from './BreakdownContainer';
import ScorePieContainer from './ScorePieContainer';
import StanineGraph from './StanineGraph';

const OverviewTab: React.FC<{
  score: number;
  usersResults?: { average_score: number };
}> = ({ score, usersResults }) => {
  const exam = useExam();

  console.log(usersResults);

  return (
    <>
      {/* NOTE: Desktop: */}
      <div
        className={c(
          'hidden gap-12 bg-white md:flex xl:rounded-md xl:shadow-md',
          exam.id === 'custom' ? 'w-1/2' : 'md:w-full xl:w-5/6'
        )}
      >
        <ScorePieContainer score={score} className="flex-1 py-12" />
        {usersResults && (
          <div className="flex max-w-[calc(100%/3)] flex-1 flex-col items-center justify-center gap-16 border-x py-12">
            <p className="flex items-center text-theme-medium-gray">
              <b>Your Result</b>
              <b className="px-4 text-3xl text-theme-extra-dark-gray">
                <i>VS</i>
              </b>
              <b>Competitors</b>
            </p>
            <Carousel
              className="h-full w-full cursor-grab p-2"
              emulateTouch
              showStatus={false}
              showThumbs={false}
              showArrows={false}
              renderIndicator={(onClick, isSelected, index) => {
                return (
                  <button
                    className={c(
                      'mx-1 h-4 w-4 rounded-full',
                      isSelected ? 'bg-theme-dark-gray' : 'bg-[#e8e8e8]'
                    )}
                    onClick={onClick}
                    key={index}
                  />
                );
              }}
            >
              <div className="flex w-full flex-col items-start gap-16 px-4">
                <BarGraph
                  value={score}
                  label="Your Result"
                  style={{ width: `calc((${score} / 100) * 100%)` }}
                />
                <BarGraph
                  value={usersResults.average_score}
                  label="Competitor Average"
                  style={{
                    width: `calc((${usersResults.average_score} / 100) * 100%)`,
                  }}
                />
              </div>
              <StanineGraph score={score} className="w-full" />
            </Carousel>
          </div>
        )}
        <BreakdownContainer className="flex-1 py-12" />
      </div>

      {/* NOTE: Mobile: */}
      {usersResults && (
        <div className="w-full cursor-grab bg-white md:hidden">
          <Carousel
            emulateTouch
            showStatus={false}
            showThumbs={false}
            showArrows={false}
            renderIndicator={(onClick, isSelected, index) => {
              return (
                <button
                  className={c(
                    'mx-1 h-4 w-4 rounded-full',
                    isSelected ? 'bg-theme-dark-gray' : 'bg-[#e8e8e8]'
                  )}
                  onClick={onClick}
                  key={index}
                />
              );
            }}
          >
            <ScorePieContainer score={score} className="py-12" />
            <div className="flex w-full flex-col items-center justify-center gap-16 py-16">
              <p className="flex items-center text-theme-medium-gray">
                <b>Your Result</b>
                <b className="px-4 text-3xl text-theme-extra-dark-gray">
                  <i>VS</i>
                </b>
                <b>Competitors</b>
              </p>
              <div className="flex w-full flex-col items-start gap-16 px-4">
                <BarGraph
                  value={score}
                  label="Your Result"
                  style={{ width: `calc((${score} / 100) * 100%)` }}
                />
                <BarGraph
                  value={usersResults.average_score}
                  label="Competitor Average"
                  style={{
                    width: `calc((${usersResults.average_score} / 100) * 100%)`,
                  }}
                />
              </div>
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-16 py-16">
              <p className="flex items-center text-theme-medium-gray">
                <b>Your Result</b>
                <b className="px-4 text-3xl text-theme-extra-dark-gray">
                  <i>VS</i>
                </b>
                <b>Competitors</b>
              </p>
              <StanineGraph score={score} className="w-full" />
            </div>
            <BreakdownContainer className="h-full pb-16 md:pb-0" />
          </Carousel>
        </div>
      )}

      {/* NOTE: Mobile with custom exam: */}
      {exam.id === 'custom' && (
        <div className="w-full cursor-grab bg-white md:hidden">
          <Carousel
            emulateTouch
            showStatus={false}
            showThumbs={false}
            showArrows={false}
            renderIndicator={(onClick, isSelected, index) => {
              return (
                <button
                  className={c(
                    'mx-1 h-4 w-4 rounded-full',
                    isSelected ? 'bg-theme-dark-gray' : 'bg-[#e8e8e8]'
                  )}
                  onClick={onClick}
                  key={index}
                />
              );
            }}
          >
            <ScorePieContainer score={score} className="py-12" />
            <BreakdownContainer className="h-full pb-16 md:pb-0" />
          </Carousel>
        </div>
      )}
    </>
  );
};

export default OverviewTab;
