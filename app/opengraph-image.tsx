import { ImageResponse } from 'next/og';
import { SITE_NAME } from '@/lib/site';

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0f172a',
          color: '#ffffff',
          padding: 72,
        }}
      >
        <div style={{ display: 'flex', fontSize: 30, color: '#fde68a' }}>
          Inhambane Stake
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 88, fontWeight: 700, lineHeight: 1.1 }}>
            Sacrament Meeting Planner
          </div>
          <div style={{ display: 'flex', fontSize: 36, color: '#cbd5e1', marginTop: 24 }}>
            Maxixe Ward: weekly agendas, hymns, speakers and ward business
          </div>
        </div>

        <div style={{ display: 'flex', height: 12, width: '100%', background: '#1e40af' }} />
      </div>
    ),
    { ...size }
  );
}
