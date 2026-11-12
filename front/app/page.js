import PageContent from './PageContent';

const appName = process.env.NEXT_PUBLIC_WEBSITE_NAME || 'ThreadsV2';

export const metadata = {
  title: `Home | ${appName}`,
};

export default function HomePage() {
  return <PageContent />;
}
