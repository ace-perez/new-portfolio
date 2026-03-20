import React from 'react';

export default function CRTBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Base dark green gradient */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at center, hsl(140,40%,8%) 0%, hsl(160,30%,4%) 50%, hsl(0,0%,1%) 100%)'
      }} />

      {/* Scanlines */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)',
        backgroundSize: '100% 4px',
      }} />

      {/* Moving scanline */}
      <div className="absolute inset-0 overflow-hidden">
        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(transparent, rgba(0,255,80,0.06), transparent)',
          animation: 'scanline-move 6s linear infinite',
        }} />
      </div>

      {/* Flicker overlay */}
      <div className="absolute inset-0" style={{
        animation: 'crt-flicker 0.15s infinite',
        background: 'rgba(0,255,80,0.015)',
      }} />

      {/* Vignette */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.75) 100%)',
      }} />

      <style>{`
        @keyframes scanline-move {
          0%   { top: -5%; }
          100% { top: 105%; }
        }
        @keyframes crt-flicker {
          0%   { opacity: 1; }
          92%  { opacity: 1; }
          93%  { opacity: 0.85; }
          94%  { opacity: 1; }
          96%  { opacity: 0.92; }
          97%  { opacity: 1; }
          99%  { opacity: 0.88; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}