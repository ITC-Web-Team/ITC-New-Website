'use client';

/**
 * Embeds a Spline viewer link (https://my.spline.design/...) in an iframe.
 * Used when a scene is only available as a viewer link instead of a
 * prod.spline.design/.../scene.splinecode export.
 */
export default function SplineViewerFrame({ url, title = '3D scene', onLoad, style }) {
  return (
    <iframe
      src={url}
      title={title}
      onLoad={onLoad}
      loading="eager"
      allow="autoplay; fullscreen; xr-spatial-tracking"
      style={{ border: 0, display: 'block', width: '100%', height: '100%', ...style }}
    />
  );
}
