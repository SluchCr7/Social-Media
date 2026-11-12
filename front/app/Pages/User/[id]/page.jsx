import PageContent from './PageContent';

export function generateMetadata({ params }) {
  return { title: `Profile ${params.id}` };
}

export default function Page({ params }) {
  return <PageContent params={params} />;
}
