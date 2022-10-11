import { useState } from 'react';
import { c } from '../../lib';
import { Customization } from '../../types';
import { Button, Modal, ModalProps } from '../core';

interface LoadModalProps extends ModalProps {
  customizations: Customization[];
  load: (index: number) => void;
}

const LoadModal: React.FC<LoadModalProps> = ({
  customizations,
  load,
  ...rest
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();

  return (
    <Modal {...rest} className={c('flex flex-col', rest.className)}>
      <p className="text-small-title font-semibold text-theme-dark-gray">
        Load Customization
      </p>
      <ul className="my-[2vh] border border-theme-light-gray bg-[#f9f9f9]">
        {customizations.map((customization, i) => (
          <li
            className={c(i < 4 && 'border-b border-b-theme-light-gray')}
            key={customization.id}
          >
            <button
              className={c(
                'group flex w-full justify-between bg-[#f9f9f9] px-3 py-2 transition hover:bg-theme-blue/75',
                i === selectedIndex && '!bg-theme-blue'
              )}
              onClick={() => setSelectedIndex(i)}
            >
              <span
                className={c(
                  'text-theme-dark-gray group-hover:text-white',
                  i === selectedIndex && '!text-white'
                )}
              >
                {customization.name}
              </span>
              <span
                className={c(
                  'text-theme-light-gray group-hover:text-white',
                  i === selectedIndex && '!text-white'
                )}
              >
                {customization.date}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="ml-auto flex gap-6">
        <Button color="gray" onClick={rest.hideModal}>
          Cancel
        </Button>
        <Button
          disabled={selectedIndex === undefined}
          onClick={() => {
            if (selectedIndex) load(selectedIndex);
          }}
        >
          Load Customization
        </Button>
      </div>
    </Modal>
  );
};

export default LoadModal;
