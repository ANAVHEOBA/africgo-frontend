"use client";

import { useState, useEffect, useCallback } from "react";

interface PaymentTimerProps {
  expiryTime: number; // in seconds
  onExpire: () => void;
  orderId: string;
}

export default function PaymentTimer({ expiryTime, onExpire, orderId }: PaymentTimerProps) {
  const [timeLeft, setTimeLeft] = useState(expiryTime);

  // Memoize the timer logic
  const setupTimer = useCallback(() => {
    // Get stored expiry time or set new one
    const storedExpiry = localStorage.getItem(`payment_expiry_${orderId}`);
    const expiryTimestamp = storedExpiry 
      ? parseInt(storedExpiry) 
      : Date.now() + expiryTime * 1000;

    if (!storedExpiry) {
      localStorage.setItem(`payment_expiry_${orderId}`, expiryTimestamp.toString());
    }

    const remaining = Math.max(0, Math.floor((expiryTimestamp - Date.now()) / 1000));
    setTimeLeft(remaining);

    if (remaining <= 0) {
      onExpire();
      return null;
    }

    return setInterval(() => {
      const newRemaining = Math.max(0, Math.floor((expiryTimestamp - Date.now()) / 1000));
      setTimeLeft(newRemaining);
      
      if (newRemaining <= 0) {
        onExpire();
      }
    }, 1000);
  }, [expiryTime, onExpire, orderId]);

  useEffect(() => {
    const timer = setupTimer();
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [setupTimer]); // Only depend on the memoized setup function

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="text-center">
      <p className="text-lg text-white mb-2">Time remaining to complete payment:</p>
      <p className="text-4xl font-bold text-gold-primary">
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </p>
    </div>
  );
} 