import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'SpoonsMenu - Independent Wetherspoons Menu Guide';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #071F3F 0%, #0A2E5C 40%, #1565C0 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            marginBottom: '32px',
          }}
        >
          <span
            style={{
              fontSize: '72px',
              fontWeight: 700,
              color: '#FFFFFF',
              fontFamily: 'Georgia, serif',
            }}
          >
            Spoons
          </span>
          <span
            style={{
              fontSize: '72px',
              fontWeight: 400,
              color: '#7CC7C5',
              fontFamily: 'Georgia, serif',
            }}
          >
            Menu
          </span>
        </div>
        <div
          style={{
            fontSize: '28px',
            color: '#FFFFFF',
            opacity: 0.85,
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.5,
          }}
        >
          Independent Wetherspoons menu guide with typical UK prices, calories,
          allergens, and food club details
        </div>
        <div
          style={{
            display: 'flex',
            gap: '32px',
            marginTop: '48px',
          }}
        >
          {['99 menu items', '12 categories', '20 city guides'].map((label) => (
            <div
              key={label}
              style={{
                background: 'rgba(124, 199, 197, 0.15)',
                border: '1px solid rgba(124, 199, 197, 0.25)',
                borderRadius: '12px',
                padding: '16px 28px',
                color: '#7CC7C5',
                fontSize: '20px',
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            fontSize: '16px',
            color: '#FFFFFF',
            opacity: 0.45,
          }}
        >
          spoonsmenu.co.uk
        </div>
      </div>
    ),
    { ...size }
  );
}
