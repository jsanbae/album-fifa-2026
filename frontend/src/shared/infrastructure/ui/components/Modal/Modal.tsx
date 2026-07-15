import { useEffect, useRef, type ReactNode, type SyntheticEvent } from 'react';
import { ui } from '../../uiStrings.js';
import styles from './Modal.module.css';

interface ModalProps {
  open: boolean;
  title: string;
  titleId: string;
  onClose: () => void;
  children: ReactNode;
  variant?: 'center' | 'sheet';
}

export function Modal(props: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const variant = props.variant ?? 'center';
  const dialogClassName = variant === 'sheet' ? styles.dialogSheet : styles.dialog;
  const panelClassName = variant === 'sheet' ? styles.panelSheet : styles.panel;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (props.open && !dialog.open) {
      dialog.showModal();
      return;
    }

    if (!props.open && dialog.open) {
      dialog.close();
    }
  }, [props.open]);

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    props.onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className={dialogClassName}
      data-variant={variant}
      aria-labelledby={props.titleId}
      onCancel={handleCancel}
    >
      <div className={panelClassName}>
        <header className={styles.header}>
          <h2 id={props.titleId} className={styles.title}>
            {props.title}
          </h2>
          <button type="button" className={styles.closeButton} onClick={props.onClose}>
            {ui.close}
          </button>
        </header>
        <div className={styles.body}>{props.children}</div>
      </div>
    </dialog>
  );
}
