import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies }) => {
  const githubToken = cookies.get('github_token')?.value;

  if (!githubToken) {
    return new Response(
      JSON.stringify({ error: 'Not authenticated' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    // Get the installation token or return the access token
    // For simplicity, we'll return the access token
    // You might want to implement GitHub App installation flow for better security
    
    return new Response(
      JSON.stringify({
        token: githubToken,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Authorization token error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
