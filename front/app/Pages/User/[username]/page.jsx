import PageContent from './PageContent';

export function generateMetadata({ params }) {
  return { title: `Profile ${params.username}` };
}

export default function Page({ params }) {
  return <PageContent params={params} />;
}
