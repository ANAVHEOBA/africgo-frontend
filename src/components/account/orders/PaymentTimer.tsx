"use client";

import { useState, useEffect } from "react";

interface PaymentTimerProps {
  expiryTime: number; // in seconds
  onExpire: () => void;
}

export default function PaymentTimer({ expiryTime, onExpire }: PaymentTimerProps) {
  const [timeLeft, setTimeLeft] = useState(expiryTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

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