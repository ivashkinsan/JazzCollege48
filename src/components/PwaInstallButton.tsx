import { useState, useEffect } from 'react';
import styles from './PwaInstallButton.module.css';
import { InstallIcon } from './icons'; // Assuming an icon component exists or will be created

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

function PwaInstallButton() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!prompt) return;

    await prompt.prompt();
    
    const { outcome } = await prompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // The prompt can only be used once. Clear it.
    setPrompt(null);
  };

  if (!prompt) {
    return null;
  }

  return (
    <button
      className={styles.installButton}
      onClick={handleInstallClick}
      title="Установить приложение"
    >
      <InstallIcon />
      <span className={styles.buttonText}>Установить</span>
    </button>
  );
}

export default PwaInstallButton;
