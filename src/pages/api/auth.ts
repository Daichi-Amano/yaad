import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ url }) => {
  const clientId = import.meta.env.GITHUB_CLIENT_ID;
  const redirectUri = `${url.origin}/api/callback`;

  if (!clientId) {
    return new Response("GITHUB_CLIENT_ID is not configured", { status: 500 });
  }

  // Generate state for CSRF protection
  const state = crypto.randomUUID();

  // Store state in a cookie (valid for 10 minutes)
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Max-Age=600; Path=/`,
  );

  // GitHub OAuth authorization URL
  const authUrl = new URL("https://github.com/login/oauth/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("scope", "repo");

  headers.set("Location", authUrl.toString());
  return new Response(null, {
    status: 302,
    headers,
  });
};
