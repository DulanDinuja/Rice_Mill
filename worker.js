const BACKEND = 'https://sameerarice.cloud';
const ALLOWED_ORIGIN = 'https://sameerarice.cloud';

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const backendUrl = BACKEND + url.pathname + url.search;

    const response = await fetch(new Request(backendUrl, {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
    }));

    return new Response(response.body, {
      status: response.status,
      headers: { ...Object.fromEntries(response.headers), ...corsHeaders },
    });
  }
};
