import { useState, type FormEvent } from 'react';
import type { RegisterStickersByCodeResultDTO } from '../../adapters/CollectionApiAdapter.js';
import styles from './RegisterByCodeForm.module.css';

interface RegisterByCodeFormProps {
  onRegister: (codes: string) => Promise<RegisterStickersByCodeResultDTO | null>;
  onSuccess?: () => void;
  loading?: boolean;
}

export function RegisterByCodeForm(props: RegisterByCodeFormProps) {
  const [codes, setCodes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const isBusy = props.loading || submitting;
  const canSubmit = codes.trim().length > 0 && !isBusy;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    const result = await props.onRegister(codes);

    setSubmitting(false);

    if (!result) {
      return;
    }

    if (result.updated.length > 0) {
      setCodes('');
    }

    if (result.unknownCodes.length > 0) {
      setFeedback(`Unrecognized codes: ${result.unknownCodes.join(', ')}`);
      return;
    }

    if (result.updated.length > 0) {
      const count = result.updated.length;
      setFeedback(`Registered ${count} sticker${count === 1 ? '' : 's'}.`);
      props.onSuccess?.();
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label} htmlFor="register-by-code">
        Register by code
      </label>
      <div className={styles.controls}>
        <input
          id="register-by-code"
          className={styles.input}
          type="text"
          value={codes}
          onChange={(event) => setCodes(event.target.value)}
          placeholder="e.g. MEX1, FWC3, CC1"
          disabled={isBusy}
          autoComplete="off"
        />
        <button type="submit" className={styles.button} disabled={!canSubmit}>
          Register
        </button>
      </div>
      {feedback && (
        <p className={styles.feedback} role="status">
          {feedback}
        </p>
      )}
    </form>
  );
}
