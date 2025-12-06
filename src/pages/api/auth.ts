export const prerender = false;
import type { APIRoute } from "astro";

const clientId = import.meta.env.GITHUB_CLIENT_ID;
const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo,user`;

export const GET: APIRoute = ({ redirect }) => {
  return redirect(authUrl);
};
