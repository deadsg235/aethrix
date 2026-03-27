import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg
        width="400"
        height="400"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto max-w-[400px]"
      >
        {/* Outer Ring - Tiena-Nueble Authority */}
        <circle cx="200" cy="200" r="180" stroke="#d4af37" strokeWidth="2" strokeDasharray="10 5" />
        <circle cx="200" cy="200" r="170" stroke="#d4af37" strokeWidth="1" />

        {/* Historic Battle Symbols - Crossed Spears */}
        <line x1="100" y1="100" x2="300" y2="300" stroke="#555" strokeWidth="4" />
        <line x1="300" y1="100" x2="100" y2="300" stroke="#555" strokeWidth="4" />
        
        {/* Empire Expansion Motif - Wings */}
        <path d="M50 200C50 150 100 120 150 120" stroke="#d4af37" strokeWidth="3" fill="none" />
        <path d="M350 200C350 150 300 120 250 120" stroke="#d4af37" strokeWidth="3" fill="none" />

        {/* Central Shield */}
        <path
          d="M140 150L200 130L260 150V250L200 280L140 250V150Z"
          fill="#0a0a0a"
          stroke="#d4af37"
          strokeWidth="4"
        />

        {/* Leadership Crown (Top) */}
        <path
          d="M180 110L190 100L200 110L210 100L220 110V125H180V110Z"
          fill="#d4af37"
        />

        {/* AETHRIX Name */}
        <text
          x="200"
          y="215"
          textAnchor="middle"
          fill="#d4af37"
          fontSize="32"
          fontWeight="bold"
          fontFamily="monospace"
          letterSpacing="4"
          className="terminal-text"
        >
          AETHRIX
        </text>

        {/* Subtext - Tiena-Nueble Chronicles */}
        <text
          x="200"
          y="245"
          textAnchor="middle"
          fill="#00ffff"
          fontSize="10"
          fontFamily="monospace"
          letterSpacing="1"
        >
          TIENA-NUEBLE CHRONICLES
        </text>

        {/* Decorative Gems for the 8 Stats/Races */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = 200 + 160 * Math.cos(rad);
          const y = 200 + 160 * Math.sin(rad);
          return (
            <circle key={i} cx={x} cy={y} r="5" fill={i % 2 === 0 ? "#00ffff" : "#dc2626"} />
          );
        })}
      </svg>
      
      {/* ASCII Logo for Terminal Feel */}
      <pre className="mt-8 text-[8px] leading-[8px] text-aethrix-gold hidden md:block">
{`
      ___           ___           ___           ___           ___           ___     
     /\\  \\         /\\  \\         /\\  \\         /\\  \\         /\\  \\         /\\  \\    
    /::\\  \\       /::\\  \\        \\:\\  \\       /::\\  \\       /::\\  \\        \\:\\  \\   
   /:/\\:\\  \\     /:/\\:\\  \\        \\:\\  \\     /:/\\:\\  \\     /:/\\:\\  \\        \\:\\  \\  
  /::\\~\\:\\  \\   /::\\~\\:\\  \\       /::\\  \\   /::\\~\\:\\  \\   /::\\~\\:\\  \\       /::\\  \\ 
 /:/\\:\\ \\:\\__\\ /:/\\:\\ \\:\\__\\     /:/\\:\\__\\ /:/\\:\\ \\:\\__\\ /:/\\:\\ \\:\\__\\     /:/\\:\\__\\
 \\/__\\:\\/:/  / \\:\\~\\:\\ \\/__/    /:/  \\/__/ \\/__\\:\\/:/  / \\/__\\:\\/:/  /    /:/  \\/__/
      \\::/  /   \\:\\ \\:\\__\\     /:/  /           \\::/  /       \\::/  /    /:/  /     
      /:/  /     \\:\\ \\/__/     \\/__/            /:/  /        /:/  /     \\/__/      
     /:/  /       \\:\\__\\                       /:/  /        /:/  /                 
     \\/__/         \\/__/                       \\/__/         \\/__/                  
`}
      </pre>
    </div>
  );
};

export default Logo;
