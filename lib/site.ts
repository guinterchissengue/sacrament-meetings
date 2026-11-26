/** Site-wide constants shared by the metadata of the root layout and the pages. */
export const SITE_NAME = 'Maxixe Ward Sacrament Planner';
export const SITE_DESCRIPTION =
  'Plan, review, and print weekly Sacrament Meeting agendas, hymns, speakers, and ward business.';

export const OG_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: SITE_NAME,
};

/** Absolute base URL used by Next.js to build og:image and other absolute URLs. */
export function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;

  if (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // preview deployments

  return 'http://localhost:3000';
}
