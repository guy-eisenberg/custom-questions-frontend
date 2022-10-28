import { useState } from 'react';

const OverviewTab: React.FC = () => {
  const [score] = useState(50);
  const [graphPage, setGraphPage] = useState<'bars' | 'stanine'>('stanine');

  return (
    <div className="flex gap-12 rounded-md bg-white px-24 py-12 shadow-md">
      <div className="flex flex-col items-center gap-12">
        <p className="text-2xl text-theme-extra-dark-gray">
          <b>You scored:</b>
        </p>
        <p className="text-theme-medium-gray">Strong Pass</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-12">
        <p className="flex items-center text-theme-medium-gray">
          <b>Your Result</b>
          <b className="px-4 text-3xl text-theme-extra-dark-gray">
            <i>VS</i>
          </b>
          <b>Competitors</b>
        </p>
        {graphPage === 'bars' ? null : null}
      </div>
      <div className="flex flex-col justify-center gap-12 text-theme-medium-gray">
        <p className="leading-9">
          <b>Breakdown:</b>
        </p>
        <div className="flex gap-12">
          <div className="flex flex-col gap-6">
            <div className="flex gap-4">
              <img
                alt="duration icon"
                src="images/icon_duration.svg"
                className="h-6 w-6"
              />
              <span>Duration:</span>
            </div>
            <div className="flex gap-4">
              <img
                alt="correct icon"
                src="images/icon_correct.svg"
                className="h-6 w-6"
              />
              <span>Total Correct:</span>
            </div>
            <div className="flex gap-4">
              <img
                alt="incorrect icon"
                src="images/icon_incorrect.svg"
                className="h-6 w-6"
              />
              <span>Total Incorrect:</span>
            </div>
            <div className="flex gap-4">
              <img
                alt="omitted icon"
                src="images/icon_omitted.svg"
                className="h-6 w-6"
              />
              <span>Total Omitted:</span>
            </div>
          </div>
          <div className="flex flex-col gap-6 text-right">
            <b>4 min 30 secs</b>
            <b>10</b>
            <b>2</b>
            <b>0</b>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;

const data = [
  {
    name: '0',
    uv: 600,
  },
  {
    uv: 1000,
  },
  {
    uv: 2000,
  },
  {
    uv: 1000,
  },
  {
    name: '100',
    uv: 600,
  },
];
