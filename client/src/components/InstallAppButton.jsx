import React, { useEffect, useState } from 'react';

const InstallAppButton = () => {
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  if (!installPrompt) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="bg-amber-500 text-black font-semibold px-4 py-2 rounded-lg hover:bg-amber-400 transition"
    >
      Install App
    </button>
  );
};

export default InstallAppButton;