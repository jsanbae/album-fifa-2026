import { useId } from 'react';
import { Modal } from '../../../../shared/infrastructure/ui/components/Modal/Modal.js';
import { ui } from '../../../../shared/infrastructure/ui/uiStrings.js';
import type { RegisterStickersByCodeResultDTO } from '../../adapters/CollectionApiAdapter.js';
import { RegisterByCodeForm } from './RegisterByCodeForm.js';

interface RegisterByCodeModalProps {
  open: boolean;
  onClose: () => void;
  onRegister: (codes: string) => Promise<RegisterStickersByCodeResultDTO | null>;
  loading?: boolean;
}

export function RegisterByCodeModal(props: RegisterByCodeModalProps) {
  const titleId = useId();

  return (
    <Modal
      open={props.open}
      title={ui.register.modalTitle}
      titleId={titleId}
      onClose={props.onClose}
    >
      <RegisterByCodeForm
        onRegister={props.onRegister}
        onSuccess={props.onClose}
        loading={props.loading}
      />
    </Modal>
  );
}
