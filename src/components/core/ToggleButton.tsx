import { c } from '../../lib';

interface ToggleButtonProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const ToggleButton: React.FC<ToggleButtonProps> = ({ checked, ...rest }) => {
  return (
    <label
      htmlFor="checked-toggle"
      className="relative inline-flex cursor-pointer items-center"
    >
      <input
        {...rest}
        type="checkbox"
        value=""
        id="checked-toggle"
        className="peer sr-only"
        checked={checked}
      />
      <div className="peer relative h-7 w-[60px] rounded-full bg-white after:absolute after:top-0.5 after:left-[2px] after:h-6 after:w-7 after:rounded-full after:border after:bg-[#1b8ac0] after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white">
        <span
          className={c(
            'absolute top-1/2 -translate-y-1/2 select-none text-xs text-[#1b8ac0] transition-all',
            checked ? 'left-2' : 'left-[calc(100%-8px)] -translate-x-full'
          )}
        >
          {checked ? 'On' : 'Off'}
        </span>
      </div>
    </label>
  );
};

export default ToggleButton;
