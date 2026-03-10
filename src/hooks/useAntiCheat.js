import { useEffect, useState, useCallback, useRef } from 'react';

export const useAntiCheat = (isActive = true) => {
  const [isViolation, setIsViolation] = useState(false);
  const [violationType, setViolationType] = useState(null);
  const [isBlackout, setIsBlackout] = useState(false);
  const violationTypeRef = useRef(null);

  const updateViolation = (type, val) => {
    setIsViolation(val);
    setViolationType(type);
    violationTypeRef.current = type;
  };

  const handleDuplicate = useCallback(() => {
    setIsBlackout(true);
    updateViolation('duplicate', true);
  }, []);

  const requestFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
        updateViolation(null, false);
      }
    } catch (err) {
      console.error("Error attempting to enable full-screen mode:", err);
    }
  };

  useEffect(() => {
    if (!isActive) return;

    const channel = new BroadcastChannel('oncampus_monitor');
    channel.postMessage({ type: 'CHECK_DUPLICATE' });

    channel.onmessage = (event) => {
      if (event.data.type === 'CHECK_DUPLICATE') {
        channel.postMessage({ type: 'DUPLICATE_FOUND' });
      } else if (event.data.type === 'DUPLICATE_FOUND') {
        handleDuplicate();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        updateViolation('blur', true);
      }
    };

    const handleBlur = () => {
      updateViolation('blur', true);
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isActive) {
        updateViolation('fullscreen', true);
      }
    };

    const handleFocus = () => {
      // Auto-recover if it was just a focus/blur violation
      if (violationTypeRef.current === 'blur') {
        updateViolation(null, false);
      }
    };

    const handleKeyDown = (e) => {
      // Allow Enter or Space to recovery if in violation
      if (violationTypeRef.current && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        requestFullscreen();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      channel.close();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isActive, handleDuplicate]);

  return {
    isViolation,
    violationType,
    isBlackout,
    requestFullscreen,
    resetViolation: () => updateViolation(null, false)
  };
};

