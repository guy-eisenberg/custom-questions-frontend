import { Button, Modal, ModalProps } from '../core';

interface ExitModalProps extends ModalProps {
  exitToMenu: () => void;
}

const ExitModal: React.FC<ExitModalProps> = ({ exitToMenu, ...rest }) => {
  return (
    <Modal
      {...rest}
      className="flex flex-col items-center text-theme-dark-gray"
    >
      <img
        alt="exit icon"
        src="images/icon_exit.svg"
        className="mb-[2vh] w-10"
      />
      <b className="mb-[2vh]">Are you sure you want to exit?</b>
      <p className="mb-[4vh] text-center text-xs">
        Exiting now will end the current session and your data from this session
        will not be saved.
      </p>
      <div className="flex gap-6">
        <Button onClick={rest.hideModal}>Cancel</Button>
        <Button color="gray" onClick={exitToMenu}>
          Exit to Menu
        </Button>
      </div>
    </Modal>
  );
};

export default ExitModal;
