/**
 * Backend API Proxy Route
 * Catches all /api/* requests and forwards them to the Django backend.
 * This is more reliable than next.config.mjs rewrites in Docker/standalone builds.
 */

const BACKEND_API = (
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://backend.tech-iitb.org/api'
).replace(/\/+$/, '');

async function proxyRequest(request, context) {
  const { slug } = await context.params;
  const path = Array.isArray(slug) ? slug.join('/') : (slug || '');

  // Preserve query string
  const { searchParams } = new URL(request.url);
  const qs = searchParams.toString();
  const targetUrl = `${BACKEND_API}/${path}/${qs ? `?${qs}` : ''}`;

  console.log(`[API Proxy] ${request.method} ${targetUrl}`);

  try {
    const fetchOptions = {
      method: request.method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    };

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      fetchOptions.body = await request.text();
    }

    const backendRes = await fetch(targetUrl, fetchOptions);
    const text = await backendRes.text();

    // Return same status and body as backend
    return new Response(text, {
      status: backendRes.status,
      headers: {
        'Content-Type': backendRes.headers.get('Content-Type') || 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error(`[API Proxy] Error proxying to ${targetUrl}:`, err.message);
    return new Response(
      JSON.stringify({ error: 'Backend unreachable', detail: err.message }),
      {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export const GET    = proxyRequest;
export const POST   = proxyRequest;
export const PUT    = proxyRequest;
export const PATCH  = proxyRequest;
export const DELETE = proxyRequest;
