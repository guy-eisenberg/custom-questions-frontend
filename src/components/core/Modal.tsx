import { useEffect } from 'react';
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
  useEffect(() => {
    document.addEventListener('click', hideModal);

    return () => document.removeEventListener('click', hideModal);
  }, [hideModal, visible]);

  return (
    <div
      {...rest}
      className={c(
        'fixed top-0 right-0 bottom-0 left-0 z-20 flex items-center justify-center bg-black/40 transition-all',
        visible ? 'visible opacity-100' : 'invisible opacity-0'
      )}
    >
      <div
        className={c(
          'max-w-lg rounded-md bg-white px-6 py-4 shadow-md',
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
