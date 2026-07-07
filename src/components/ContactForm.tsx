import { useState } from 'react';
import styles from './ContactForm.module.css';

interface ContactFormProps {
  formspreeEndpoint: string;
}

function ContactForm({ formspreeEndpoint }: ContactFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className={styles.wrapper}>
      <button className={styles.toggleBtn} onClick={() => setIsOpen(!isOpen)}>
        <span>Написать сообщение</span>
        <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <input type="text" name="name" placeholder="Ваше имя" required className={styles.input} />
          <input type="tel" name="phone" placeholder="Контактный номер" required className={styles.input} />
          <input type="email" name="email" placeholder="Ваш Email" required className={styles.input} />
          <textarea name="message" placeholder="Текст сообщения" required className={styles.textarea} />
          
          {/* Honeypot для защиты от спама */}
          <input type="text" name="_gotcha" style={{ display: 'none' }} />

          <button type="submit" disabled={status === 'submitting'} className={styles.submitBtn}>
            {status === 'submitting' ? 'Отправка...' : 'Отправить'}
          </button>

          {status === 'success' && <p className={styles.success}>Сообщение успешно отправлено!</p>}
          {status === 'error' && <p className={styles.error}>Ошибка при отправке. Попробуйте еще раз.</p>}
        </form>
      )}
    </div>
  );
}

export default ContactForm;
