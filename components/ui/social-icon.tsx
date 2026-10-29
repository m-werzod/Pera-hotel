/**
 * Brand marks, drawn to each platform's own geometry and palette.
 *
 * lucide-react deliberately ships no brand icons, so these are hand-built:
 *   - Instagram: the full-bleed squircle carrying the official corner-to-corner
 *     gradient (warm yellow at the lower-left through red and magenta to blue
 *     at the upper-right), with the white camera body, lens and flash on top.
 *   - Telegram: the blue vertical gradient disc with the white paper plane,
 *     including the folded wing that gives the mark its silhouette.
 *
 * `instanceId` keeps each gradient's `id` unique. Both marks render in the
 * contact section and again in the footer, and duplicate SVG ids make the
 * second instance pick up the first one's fill.
 */

type SocialIconProps = {
  id: string;
  instanceId: string;
  className?: string;
};

function InstagramIcon({ instanceId, className }: { instanceId: string; className?: string }) {
  const gradientId = `ig-${instanceId}`;

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <defs>
        {/* Anchored below the lower-left corner, which is what tilts the
            warm end of the ramp into that corner the way the real mark does. */}
        <radialGradient id={gradientId} cx="0.3" cy="1.07" r="1.3">
          <stop offset="0%" stopColor="#FDF497" />
          <stop offset="5%" stopColor="#FDF497" />
          <stop offset="45%" stopColor="#FD5949" />
          <stop offset="60%" stopColor="#D6249F" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>

      <rect width="24" height="24" rx="5.5" fill={`url(#${gradientId})`} />
      {/* Camera body */}
      <rect
        x="5.15"
        y="5.15"
        width="13.7"
        height="13.7"
        rx="4"
        fill="none"
        stroke="#fff"
        strokeWidth="1.85"
      />
      {/* Lens */}
      <circle cx="12" cy="12" r="3.5" fill="none" stroke="#fff" strokeWidth="1.85" />
      {/* Flash. Sits on the corner diagonal with ~0.4 units of clearance from
          both the body's corner arc and the lens — any closer and the stroke
          and the dot merge into a blob at small sizes. */}
      <circle cx="16.1" cy="7.9" r="0.9" fill="#fff" />
    </svg>
  );
}

function TelegramIcon({ instanceId, className }: { instanceId: string; className?: string }) {
  const gradientId = `tg-${instanceId}`;

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient
          id={gradientId}
          x1="12"
          y1="0"
          x2="12"
          y2="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#2AABEE" />
          <stop offset="100%" stopColor="#229ED9" />
        </linearGradient>
      </defs>

      <circle cx="12" cy="12" r="12" fill={`url(#${gradientId})`} />
      {/* Paper plane. The dip before the tail is the folded wing. */}
      <path
        fill="#fff"
        d="M5.49 11.78c3.79-1.65 6.32-2.74 7.58-3.27 3.61-1.5 4.36-1.76 4.85-1.77.11 0 .35.02.5.15.13.1.17.25.19.35.02.1.04.33.02.51-.2 2.17-1.09 7.43-1.54 9.86-.19 1.03-.56 1.37-.92 1.41-.78.07-1.38-.52-2.14-1.01-1.19-.78-1.86-1.27-3.01-2.03-1.33-.88-.47-1.37.29-2.16.2-.21 3.63-3.33 3.7-3.61.01-.04.02-.17-.06-.24-.08-.07-.2-.05-.29-.03-.12.03-2.11 1.34-5.95 3.94-.56.39-1.07.58-1.53.57-.5-.01-1.47-.29-2.19-.52-.88-.29-1.58-.44-1.52-.93.03-.26.38-.52 1.05-.79z"
      />
    </svg>
  );
}

/** Falls back to nothing for an unknown platform rather than a wrong mark. */
export function SocialIcon({ id, instanceId, className = "size-5" }: SocialIconProps) {
  switch (id) {
    case "instagram":
      return <InstagramIcon instanceId={instanceId} className={className} />;
    case "telegram":
      return <TelegramIcon instanceId={instanceId} className={className} />;
    default:
      return null;
  }
}

export function hasSocialIcon(id: string): boolean {
  return id === "instagram" || id === "telegram";
}
