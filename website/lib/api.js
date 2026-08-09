/**
 * API client utility for Next.js frontend
 * Uses same-origin /api rewrite proxy to eliminate browser CORS and SSL issues
 * Includes client-side fallbacks to ensure pages never crash on missing API endpoints
 */

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
  try {
    const endpoint = type !== null ? `/bodies/?type=${type}` : '/bodies/';
    return await fetchAPI(endpoint);
  } catch (err) {
    console.warn(`fetchBodies failed for type=${type}:`, err);
    return [];
  }
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
  try {
    const endpoint = bodyName ? `/achievements/?body=${encodeURIComponent(bodyName)}` : '/achievements/';
    return await fetchAPI(endpoint);
  } catch (err) {
    console.warn(`fetchAchievements failed:`, err);
    return [];
  }
}

/**
 * Fetch achievements grouped by year with fallback
 * @param {string} bodyName - Optional body name to filter achievements
 */
export async function fetchAchievementsByYear(bodyName = null) {
  try {
    const endpoint = bodyName ? `/achievements/by_year/?body=${encodeURIComponent(bodyName)}` : '/achievements/by_year/';
    return await fetchAPI(endpoint);
  } catch (err) {
    console.warn(`fetchAchievementsByYear action endpoint returned error, falling back to manual grouping:`, err);
    const achievementsData = await fetchAchievements(bodyName);
    const list = Array.isArray(achievementsData) ? achievementsData : achievementsData.results || [];
    
    // Group achievements by year manually
    const grouped = {};
    for (const item of list) {
      if (item.date) {
        const year = new Date(item.date).getFullYear();
        if (!grouped[year]) grouped[year] = [];
        grouped[year].push(item);
      }
    }
    return grouped;
  }
}

/**
 * Fetch all bodies for filter dropdown with fallback
 */
export async function fetchBodiesForFilter() {
  try {
    return await fetchAPI('/achievements/bodies/');
  } catch (err) {
    console.warn(`fetchBodiesForFilter action endpoint failed, falling back to fetchBodies():`, err);
    return await fetchBodies();
  }
}

/**
 * Fetch all portals
 */
export async function fetchPortals() {
  try {
    return await fetchAPI('/portals/');
  } catch (err) {
    console.warn(`fetchPortals failed:`, err);
    return [];
  }
}

/**
 * Fetch all cabinet members
 */
export async function fetchCabinet() {
  try {
    return await fetchAPI('/cabinet/');
  } catch (err) {
    console.warn(`fetchCabinet failed:`, err);
    return [];
  }
}

/**
 * Fetch all InterIIT years
 */
export async function fetchInterIIT() {
  try {
    return await fetchAPI('/interiit/');
  } catch (err) {
    console.warn(`fetchInterIIT failed:`, err);
    return [];
  }
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
  try {
    return await fetchAPI('/gallery/');
  } catch (err) {
    console.warn(`fetchGalleries failed:`, err);
    return [];
  }
}

/**
 * Fetch all work reports
 */
export async function fetchWorkReports() {
  try {
    return await fetchAPI('/workreports/');
  } catch (err) {
    console.warn(`fetchWorkReports failed:`, err);
    return [];
  }
}
