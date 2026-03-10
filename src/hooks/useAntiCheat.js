import { useEffect, useState, useCallback } from 'react';

export const useAntiCheat = (isActive = true) => {
  const [isViolation, setIsViolation] = useState(false);
  const [violationType, setViolationType] = useState(null); // 'fullscreen', 'blur', 'duplicate'
  const [isBlackout, setIsBlackout] = useState(false);

  const handleDuplicate = useCallback(() => {
    setIsBlackout(true);
    setIsViolation(true);
    setViolationType('duplicate');
  }, []);

  useEffect(() => {
    if (!isActive) return;

    // 1. Duplicate Tab Detection
    const channel = new BroadcastChannel('oncampus_monitor');

    // Send check message
    channel.postMessage({ type: 'CHECK_DUPLICATE' });

    channel.onmessage = (event) => {
      if (event.data.type === 'CHECK_DUPLICATE') {
        // Someone else is trying to open
        channel.postMessage({ type: 'DUPLICATE_FOUND' });
      } else if (event.data.type === 'DUPLICATE_FOUND') {
        // I am the duplicate
        handleDuplicate();
      }
    };

    // 2. Visibility / Blur Detection
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolationType('blur');
        setIsViolation(true);
      }
    };

    const handleBlur = () => {
      setViolationType('blur');
      setIsViolation(true);
    };

    // 3. Fullscreen Monitoring
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isActive) {
        setViolationType('fullscreen');
        setIsViolation(true);
      }
    };

    const handleFocus = () => {
      // Auto-recover if it was just a focus/blur violation
      if (violationType === 'blur') {
        setIsViolation(false);
        setViolationType(null);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      channel.close();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };


  }, [isActive, handleDuplicate]);

  const requestFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
        setIsViolation(false);
        setViolationType(null);
      }
    } catch (err) {
      console.error("Error attempting to enable full-screen mode:", err);
    }
  };

  return { isViolation, violationType, isBlackout, requestFullscreen, resetViolation: () => setIsViolation(false) };
};
