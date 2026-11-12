import PageContent from './PageContent';

export function generateMetadata({ params }) {
  return { title: `#${params.text}` };
}

export default function Page({ params }) {
  return <PageContent params={params} />;
}
