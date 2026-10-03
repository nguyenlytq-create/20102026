import React, { useMemo } from 'react';

interface PetalOverlayProps {
  active: boolean;
}

export const PetalOverlay: React.FC<PetalOverlayProps> = ({ active }) => {
  const petals = useMemo(() => {
    return Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 4.5 + Math.random() * 5.5,
      delay: Math.random() * 5,
      size: 16 + Math.random() * 18
    }));
  }, []);

  if (!active) return null;

  return (
    <div className="petal-container pointer-events-none">
      {petals.map(p => (
        <div
          key={p.id}
          className="rose-petal"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size * 1.3}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`
          }}
        />
      ))}
    </div>
  );
};
