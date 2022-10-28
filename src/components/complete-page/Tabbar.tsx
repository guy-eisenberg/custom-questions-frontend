import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from '../../hooks';
import { c } from '../../lib';

interface TabbarProps extends React.HTMLAttributes<HTMLDivElement> {}

const Tabbar: React.FC<TabbarProps> = ({ ...rest }) => {
  const overviewButtonRef = useRef<HTMLButtonElement>(null);
  const feedbackButtonRef = useRef<HTMLButtonElement>(null);

  const { tab } = useParams();

  const [activatedButton, setActivatedButton] = useState<
    HTMLButtonElement | undefined
  >();

  useEffect(() => {
    switch (tab) {
      case 'overview':
        setActivatedButton(overviewButtonRef.current || undefined);
        break;
      case 'feedback':
        setActivatedButton(feedbackButtonRef.current || undefined);
        break;
    }
  }, [tab]);

  return (
    <div
      {...rest}
      className={c('relative flex gap-6 bg-white px-12', rest.className)}
    >
      <Link to="overview">
        <button
          className={c(
            'h-full',
            tab === 'overview'
              ? 'text-theme-extra-dark-gray'
              : 'text-theme-light-gray'
          )}
          ref={overviewButtonRef}
        >
          Overview
        </button>
      </Link>
      <Link to="feedback">
        <button
          className={c(
            'h-full',
            tab === 'feedback'
              ? 'text-theme-extra-dark-gray'
              : 'text-theme-light-gray'
          )}
          ref={feedbackButtonRef}
        >
          Feedback
        </button>
      </Link>
      <div
        className="left:0 absolute top-full h-[3px] w-8 -translate-y-full rounded-t-md bg-theme-blue transition-all"
        style={{
          width: activatedButton?.clientWidth,
          left: activatedButton?.offsetLeft,
        }}
      ></div>
    </div>
  );
};

export default Tabbar;
