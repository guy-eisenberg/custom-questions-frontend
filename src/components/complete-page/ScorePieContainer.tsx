import { useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { Pie, PieChart, ResponsiveContainer } from 'recharts';
import { useExam } from '../../hooks';
import { c, p } from '../../lib';

interface ScorePieContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  score: number;
}

const ScorePieContainer: React.FC<ScorePieContainerProps> = ({
  score,
  ...rest
}) => {
  const exam = useExam();

  return (
    <div
      {...rest}
      className={c('flex flex-col items-center gap-8', rest.className)}
    >
      <p className="text-2xl text-theme-extra-dark-gray">
        <b>You scored:</b>
      </p>
      <ScorePie score={score} className="h-[300px] w-[300px]" />
      {exam.weak_pass !== undefined && exam.strong_pass !== undefined && (
        <div className="relative text-xl font-light text-theme-medium-gray">
          <span>{getScoreLabel()}</span>{' '}
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a
            id="score-tooltip"
            className="absolute -right-6 -top-2 cursor-pointer hover:brightness-90"
          >
            <img
              alt="info icon"
              className="h-5 w-5"
              src={p('images/icon_info.svg')}
            />
          </a>
          <Tooltip anchorId="score-tooltip">
            <div className="text-sm">
              <p className="mb-2 leading-5">
                Your score is considered a{' '}
                <b className="font-bold text-[#7ce027]">Strong Pass</b>.
              </p>
              <p className="mb-2 leading-5">
                This is achieved when X of the questions are answered correctly,
                <br />
                and indicates that the User exhibits strong understanding of
                <br />
                questions posed in the exam.
              </p>
              <p className="mb-2 leading-5">
                A <b className="font-bold text-[#f4da21]">Weak Pass</b> is
                achieved when X of the questions are answered
                <br />
                correctly. A user that achieves this score exhibits a weak
                <br />
                understanding of the questions posed.
              </p>
              <p className="leading-5">
                A user achieves a{' '}
                <b className="font-bold text-[#fc5656]">Fail</b> when X of the
                questions are anwered
                <br /> correctly. This score indicates lack of understanding of
                questions
                <br />
                posed.
              </p>
            </div>
          </Tooltip>
        </div>
      )}
    </div>
  );

  function getScoreLabel() {
    if (!exam.weak_pass || !exam.strong_pass) return;

    if (score >= 0 && score < exam.weak_pass) return 'Fail';
    else if (score >= exam.weak_pass && score < exam.strong_pass)
      return 'Weak Pass';
    else if (score >= exam.strong_pass && score <= 100) return 'Strong Pass';
  }
};

export default ScorePieContainer;

interface ScorePieProps extends React.HTMLAttributes<HTMLDivElement> {
  score: number;
}

const ScorePie: React.FC<ScorePieProps> = ({ score, ...rest }) => {
  const exam = useExam();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div {...rest} className={c('relative', rest.className)}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={[
              {
                value: score,
                fill: getColor(),
              },
              {
                value: 100 - score,
                fill: '#e8e8e8',
              },
            ]}
            animationDuration={1000}
            animationBegin={0}
            animationEasing="ease"
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            startAngle={90}
            endAngle={720}
            innerRadius="92.5%"
            outerRadius="100%"
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 mt-2 -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="mb-2 text-8xl font-light text-theme-dark-gray">
          {score}
        </h1>
        <span className="text-xl font-extralight text-theme-light-gray">%</span>
      </div>
      <div
        className="absolute -top-[17px] -right-[17px] -bottom-[17px] -left-[17px] flex justify-center"
        style={{
          rotate: mounted ? `-${(score / 100) * 360}deg` : '0deg',
          transition: 'ease',
          transitionDuration: '1000ms',
        }}
      >
        <img
          alt="aircraft icon"
          src={p(`images/${getAircraftIcon()}.svg`)}
          className="h-14 w-14 -rotate-90"
        />
      </div>
    </div>
  );

  function getAircraftIcon() {
    if (!exam.weak_pass || !exam.strong_pass) return 'icon_aircraft_blue';
    else {
      if (score >= 0 && score < exam.weak_pass) return 'icon_aircraft_red';
      else if (score >= exam.weak_pass && score < exam.strong_pass)
        return 'icon_aircraft_yellow';
      else if (score >= exam.strong_pass && score <= 100)
        return 'icon_aircraft_green';
    }
  }

  function getColor() {
    if (!exam.weak_pass || !exam.strong_pass) return '#3793d1';
    else {
      if (score >= 0 && score < exam.weak_pass) return '#fc5656';
      else if (score >= exam.weak_pass && score < exam.strong_pass)
        return '#f4da21';
      else if (score >= exam.strong_pass && score <= 100) return '#7ce027';
    }
  }
};
