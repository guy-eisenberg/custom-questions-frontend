import { c } from '../../lib';

interface ExamTypePageButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  title: string;
}

const ExamTypePageButton: React.FC<ExamTypePageButtonProps> = ({
  children,
  title,
  ...rest
}) => {
  return (
    <button
      {...rest}
      className={c(
        'rounded-md border border-theme-light-gray bg-white px-6 py-4 text-left text-theme-dark-gray transition hover:scale-105 hover:border-theme-blue hover:opacity-100 hover:shadow-md active:scale-95 active:brightness-95 md:opacity-80',
        rest.className
      )}
    >
      <p className="mb-[2vh] text-theme-extra-dark-gray">
        <b>{title}</b>
      </p>
      <p>{children}</p>
    </button>
  );
};

export default ExamTypePageButton;
