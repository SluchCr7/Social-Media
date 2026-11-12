import PageContent from './PageContent';

export function generateMetadata({ params }) {
  return { title: `Post ${params.id}` };
}

export default function Page({ params }) {
  return <PageContent params={params} />;
}
