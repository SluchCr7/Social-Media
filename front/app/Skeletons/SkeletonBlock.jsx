export default function SkeletonBlock({ className = '', tone = 'default', style }) {
  const toneClass = tone === 'dark' ? 'skeleton-block-dark' : '';

  return <div aria-hidden="true" className={`skeleton-block ${toneClass} ${className}`} style={style} />;
}
