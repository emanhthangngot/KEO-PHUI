import { Player } from './types';

export function generatePlayerAvatar(p: Partial<Player>): string {
  const skin = p.skin || '#dca078';
  const hair = p.hair || '#222531';
  const jersey = p.jersey || '#32b4b2';
  const style = p.style ?? 0;

  const hairPaths = [
    '<path d="M17 29 Q17 12 36 13 Q53 14 55 32 L49 27 Q40 20 27 25 L20 33 Z" />',
    '<path d="M15 33 Q12 18 22 14 Q34 5 48 17 Q57 21 55 32 L49 27 L44 20 L32 24 L21 27 Z" />',
    '<path d="M16 31 Q13 16 30 14 L47 14 Q56 19 55 32 L47 25 L25 24 Z" />',
    '<path d="M16 31 Q15 14 32 13 Q54 13 55 32 L50 27 L23 27 Z" />',
  ];

  const hairD = hairPaths[style % hairPaths.length];

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 72 72">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#142338" />
      <stop offset="100%" stop-color="#0a1220" />
    </linearGradient>
  </defs>
  <rect width="72" height="72" rx="16" fill="url(#bgGrad)"/>
  <circle cx="64" cy="14" r="28" fill="#ffffff" opacity="0.04"/>
  
  <!-- Jersey & shoulders -->
  <path d="M7 76 Q9 53 31 50 L41 50 Q63 53 65 76" fill="${jersey}"/>
  <path d="M25 50 L36 60 L47 50" fill="#ffffff" opacity="0.18"/>
  
  <!-- Neck -->
  <path d="M28 44 L28 55 Q36 62 44 55 L44 44" fill="${skin}"/>
  
  <!-- Head -->
  <ellipse cx="36" cy="33" rx="16.5" ry="20" fill="${skin}"/>
  
  <!-- Hair -->
  <g fill="${hair}">
    ${hairD}
  </g>
  
  <!-- Eyes -->
  <circle cx="30" cy="34" r="1.8" fill="#1e2229" />
  <circle cx="42" cy="34" r="1.8" fill="#1e2229" />
  
  <!-- Eyebrows -->
  <path d="M27 30 L33 30" stroke="#1e2229" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M39 30 L45 30" stroke="#1e2229" stroke-width="1.8" stroke-linecap="round"/>
  
  <!-- Smile -->
  <path d="M32 43 Q36 46 40 43" fill="none" stroke="#7e4338" stroke-width="1.6" stroke-linecap="round"/>
  
  <!-- Collar stripe -->
  <path d="M20 54 Q36 66 52 54" stroke="#ffffff" stroke-opacity="0.25" stroke-width="2" fill="none"/>
</svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function getTeamInitials(name: string): string {
  if (!name) return 'FC';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
