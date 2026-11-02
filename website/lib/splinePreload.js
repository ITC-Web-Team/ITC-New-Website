// In-memory cache of downloaded Spline scene files.
//
// Each .splinecode file is fetched at most once per visit and handed to the
// Spline runtime as a local blob: URL, so a scene that was preloaded in the
// background opens without waiting for the network again.

const cache = new Map(); // original url -> Promise<string> (blob url or original url)
const ready = new Map(); // original url -> blob url, once downloaded

// Synchronous lookup: the blob URL if the scene is already downloaded, else null.
export function getPreloadedScene(url) {
  return ready.get(url) || null;
}

export function preloadSplineScene(url, { priority = 'auto' } = {}) {
  if (!url || typeof window === 'undefined') return Promise.resolve(url);
  if (url.startsWith('blob:')) return Promise.resolve(url);

  let entry = cache.get(url);
  if (!entry) {
    entry = fetch(url, { priority })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      })
      // The fragment keeps the ".splinecode" suffix the runtime checks for;
      // fetch() ignores fragments, so it doesn't affect loading.
      .then((blob) => {
        const blobUrl = `${URL.createObjectURL(blob)}#scene.splinecode`;
        ready.set(url, blobUrl);
        return blobUrl;
      })
      .catch(() => {
        cache.delete(url); // allow a retry; fall back to the network URL
        return url;
      });
    cache.set(url, entry);
  }
  return entry;
}

// Preload several scenes one after another (low priority) so background
// downloads never compete with each other or with the scene on screen.
export function preloadSplineScenes(urls) {
  let chain = Promise.resolve();
  for (const url of urls) {
    if (!url) continue;
    chain = chain.then(() => preloadSplineScene(url, { priority: 'low' }));
  }
  return chain;
}
