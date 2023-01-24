import { c } from '../../lib';

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  visible: boolean;
  hideModal: () => void;
}

const Modal: React.FC<ModalProps> = ({
  visible,
  hideModal,
  children,
  ...rest
}) => {
  return (
    <div
      {...rest}
      className={c(
        'fixed top-0 right-0 bottom-0 left-0 z-20 flex items-center justify-center bg-black/40 transition-all',
        visible ? 'visible opacity-100' : 'invisible opacity-0'
      )}
      onClick={(e) => {
        if (rest.onClick) rest.onClick(e);

        hideModal();
      }}
    >
      <div
        className={c(
          'max-w-[90%] rounded-md bg-white px-6 py-4 shadow-md',
          rest.className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
