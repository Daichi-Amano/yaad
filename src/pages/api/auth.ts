import type { APIRoute } from "astro";

const buildRedirectUri = (origin: string) => `${origin}/api/callback`;

export const GET: APIRoute = async ({ url }) => {
  const clientId = import.meta.env.GITHUB_CLIENT_ID;
  const redirectUri = buildRedirectUri(url.origin);

  if (!clientId) {
    return new Response("GITHUB_CLIENT_ID is not configured", { status: 500 });
  }

  const state = crypto.randomUUID();
  const secureAttr = url.protocol === "https:" ? "Secure; " : "";

  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    `oauth_state=${state}; ${secureAttr}HttpOnly; SameSite=Lax; Max-Age=600; Path=/`,
  );

  const scope = url.searchParams.get("scope") ?? "repo";
  const authUrl = new URL("https://github.com/login/oauth/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("scope", scope);
  authUrl.searchParams.set("allow_signup", "false");

  headers.set("Location", authUrl.toString());
  return new Response(null, { status: 302, headers });
};
