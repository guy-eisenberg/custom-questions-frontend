import { useState } from 'react';
import { c } from '../../lib';
import { Button, Input, Modal, ModalProps } from '../core';

interface SaveModalProps extends ModalProps {
  save: (name: string) => void;
}

const SaveModal: React.FC<SaveModalProps> = ({ save, ...rest }) => {
  const [name, setName] = useState('');

  return (
    <Modal {...rest} className={c('flex flex-col', rest.className)}>
      <p className="text-small-title font-semibold text-theme-dark-gray">
        Save Customization
      </p>
      <Input
        className="my-[2vh] w-full"
        placeholder="Name for Customization"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="ml-auto flex gap-6">
        <Button color="gray" onClick={rest.hideModal}>
          Cancel
        </Button>
        <Button
          color="green"
          disabled={name.length === 0}
          onClick={() => save(name)}
        >
          Save Customization
        </Button>
      </div>
    </Modal>
  );
};

export default SaveModal;
