import { c } from '../../lib';

interface LabeledBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
}

const LabeledBox: React.FC<LabeledBoxProps> = ({
  label,
  children,
  ...rest
}) => {
  return (
    <div
      {...rest}
      className={c(
        'flex flex-col rounded-[5px] border border-[#dddddd] text-small text-theme-medium-gray',
        rest.className
      )}
    >
      <p className="border-b border-b-[#dddddd] px-[2vh] py-[1vh] font-semibold text-theme-dark-gray">
        {label}
      </p>
      <div className="flex-1 p-[2vh]">{children}</div>
    </div>
  );
};

export default LabeledBox;
