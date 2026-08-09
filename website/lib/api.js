/**
 * API client utility for Next.js frontend
 * Uses same-origin /api rewrite proxy to eliminate browser CORS and SSL issues
 */

// On client side in browser, use relative /api so requests are same-origin.
// On server side during build/SSR, use full URL.
const getApiBase = () => {
  if (typeof window !== 'undefined') {
    return '/api';
  }
  const envUrl = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'https://backend.tech-iitb.org/api';
  return envUrl.replace(/\/+$/, '');
};

export async function fetchAPI(endpoint, options = {}) {
  const apiBase = getApiBase();
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${apiBase}${formattedEndpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = new Error(`API Error: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  
  return response.json();
}

/**
 * Fetch all bodies (clubs, tech teams, communities)
 * @param {number} type - Body type: 0=CLUBS, 1=TECH TEAMS, 2=COMMUNITIES
 */
export async function fetchBodies(type = null) {
  const endpoint = type !== null ? `/bodies/?type=${type}` : '/bodies/';
  return fetchAPI(endpoint);
}

/**
 * Fetch single body by ID
 */
export async function fetchBodyById(id) {
  return fetchAPI(`/bodies/${id}/`);
}

/**
 * Fetch achievements with optional body filter
 * @param {string} bodyName - Optional body name to filter achievements
 */
export async function fetchAchievements(bodyName = null) {
  const endpoint = bodyName ? `/achievements/?body=${bodyName}` : '/achievements/';
  return fetchAPI(endpoint);
}

/**
 * Fetch achievements grouped by year
 * @param {string} bodyName - Optional body name to filter achievements
 */
export async function fetchAchievementsByYear(bodyName = null) {
  const endpoint = bodyName ? `/achievements/by_year/?body=${bodyName}` : '/achievements/by_year/';
  return fetchAPI(endpoint);
}

/**
 * Fetch all bodies for filter dropdown
 */
export async function fetchBodiesForFilter() {
  return fetchAPI('/achievements/bodies/');
}

/**
 * Fetch all portals
 */
export async function fetchPortals() {
  return fetchAPI('/portals/');
}

/**
 * Fetch all cabinet members
 */
export async function fetchCabinet() {
  return fetchAPI('/cabinet/');
}

/**
 * Fetch all InterIIT years
 */
export async function fetchInterIIT() {
  return fetchAPI('/interiit/');
}

/**
 * Fetch single InterIIT by ID
 */
export async function fetchInterIITById(id) {
  return fetchAPI(`/interiit/${id}/`);
}

/**
 * Fetch all galleries
 */
export async function fetchGalleries() {
  return fetchAPI('/gallery/');
}

/**
 * Fetch all work reports
 */
export async function fetchWorkReports() {
  return fetchAPI('/workreports/');
}
