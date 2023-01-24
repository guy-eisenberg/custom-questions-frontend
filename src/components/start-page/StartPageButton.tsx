import { c, p } from '../../lib';

interface StartPageButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  color?: 'blue' | 'green' | 'white';
  icon: string;
}

const StartPageButton: React.FC<StartPageButtonProps> = ({
  children,
  color = 'white',
  icon,
  ...rest
}) => {
  return (
    <button
      {...rest}
      className={c(
        'flex flex-col items-center gap-4 rounded-md py-8 font-semibold transition hover:scale-105 hover:shadow-md active:scale-95 active:brightness-95',
        color === 'blue' && 'bg-theme-blue text-white',
        color === 'green' && 'bg-theme-green text-white',
        color === 'white' &&
          'border border-theme-light-gray bg-white text-theme-extra-dark-gray',
        rest.className
      )}
    >
      <img
        alt="button icon"
        src={p(`images/${icon}`)}
        className="h-6 md:h-12"
      />
      {children}
    </button>
  );
};

export default StartPageButton;
