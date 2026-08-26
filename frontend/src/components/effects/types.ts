import React from 'react';

export interface WaterEffectProps {
  children?: React.ReactNode;
  enabled?: boolean; // Default true
  intensity?: 'subtle' | 'medium'; // Default subtle
  enableMovement?: boolean; // Default true
  enableClick?: boolean; // Default true
  className?: string;
}
