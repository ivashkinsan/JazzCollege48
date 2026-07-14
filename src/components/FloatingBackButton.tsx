import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FloatingBackButton.module.css';

function FloatingBackButton() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <button
      className={`${styles.backButton} ${visible ? styles.visible : ''}`}
      onClick={goBack}
      aria-label="Назад"
    >
      ←
    </button>
  );
}

export default FloatingBackButton;
