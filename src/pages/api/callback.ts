import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, cookies, url }) => {
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies.get("oauth_state")?.value;

  // Verify state
  if (!state || state !== storedState) {
    return new Response("Invalid state parameter", { status: 400 });
  }

  // Clear the state cookie
  cookies.delete("oauth_state", { path: "/" });

  if (!code) {
    return new Response("Missing authorization code", { status: 400 });
  }

  const clientId = import.meta.env.GITHUB_CLIENT_ID;
  const clientSecret = import.meta.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response("GitHub OAuth credentials not configured", {
      status: 500,
    });
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      },
    );

    if (!tokenResponse.ok) {
      return new Response("Failed to exchange code for token", { status: 500 });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return new Response("No access token received", { status: 500 });
    }

    // Store token in a secure cookie
    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      `github_token=${accessToken}; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000; Path=/`,
    );

    // Redirect to content manager
    headers.set("Location", "/content-manager");
    return new Response(null, {
      status: 302,
      headers,
    });
  } catch (error) {
    console.error("OAuth callback error:", error);
    return new Response("Internal server error", { status: 500 });
  }
};
