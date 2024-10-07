import { useState, useEffect } from 'react';

const PWAInstallPrompt = () => {
  const [isIos, setIsIos] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const isIosDevice = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const standaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    
    setIsIos(isIosDevice);
    setIsInstalled(standaloneMode);
  }, []);

  if (isIos && !isInstalled) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4">
        <div className="flex items-center justify-between">
          <p>To install this app, tap the Share button and then "Add to Home Screen".</p>
          <button onClick={() => setIsInstalled(true)} className="ml-4 text-sm underline">
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default PWAInstallPrompt;
