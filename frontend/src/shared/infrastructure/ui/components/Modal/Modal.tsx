import { useEffect, useRef, type ReactNode, type SyntheticEvent } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  open: boolean;
  title: string;
  titleId: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal(props: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

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
      className={styles.dialog}
      aria-labelledby={props.titleId}
      onCancel={handleCancel}
    >
      <div className={styles.panel}>
        <header className={styles.header}>
          <h2 id={props.titleId} className={styles.title}>
            {props.title}
          </h2>
          <button type="button" className={styles.closeButton} onClick={props.onClose}>
            Close
          </button>
        </header>
        <div className={styles.body}>{props.children}</div>
      </div>
    </dialog>
  );
}
