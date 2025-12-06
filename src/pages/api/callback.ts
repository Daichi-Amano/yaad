import type { APIRoute } from "astro";

const renderResultPage = (data: { token?: string; error?: string }) => {
  const payload = JSON.stringify(data);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>GitHub OAuth</title>
  </head>
  <body>
    <script>
      (function() {
        const payload = ${payload};
        if (window.opener) {
          window.opener.postMessage(payload, "*");
          window.close();
        } else {
          document.body.innerText = payload.error || "Authenticated";
        }
      })();
    </script>
  </body>
</html>`;
};

const errorResponse = (message: string, status = 400) =>
  new Response(renderResultPage({ error: message }), {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });

export const GET: APIRoute = async ({ cookies, url }) => {
  const githubError = url.searchParams.get("error");
  if (githubError) {
    return errorResponse(`GitHub OAuth error: ${githubError}`);
  }

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies.get("oauth_state")?.value;

  if (!state || state !== storedState) {
    return errorResponse("Invalid state parameter");
  }

  cookies.set("oauth_state", "", { path: "/", maxAge: 0 });

  if (!code) {
    return errorResponse("Missing authorization code");
  }

  const clientId = import.meta.env.GITHUB_CLIENT_ID;
  const clientSecret = import.meta.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return errorResponse("GitHub OAuth credentials not configured", 500);
  }

  try {
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
      return errorResponse("Failed to exchange code for token", 500);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return errorResponse("No access token received from GitHub", 500);
    }

    return new Response(renderResultPage({ token: accessToken }), {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("OAuth callback error:", error);
    return errorResponse("Internal server error", 500);
  }
};
