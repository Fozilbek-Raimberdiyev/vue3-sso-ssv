import axios, { AxiosResponse } from "axios";

const BASE_URL = "https://sso.ssv.uz";

const client_id = "94f83670-f841-4ec5-a593-72d2873f054b";
const client_secret = "IAIkBdrmSVPWPH5vtvihY4vOfLW3V19oDEC9wHIs";
const redirect_uri = "https://vue3-sso-ssv.netlify.app/auth/callback";

function generateRandomString(length: number): string {
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, (dec) => ("0" + dec.toString(16)).substr(-2)).join(
    ""
  );
}

async function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
}

function base64urlencode(str: ArrayBuffer): string {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(str) as any))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function pkceChallengeFromVerifier(verifier: string): Promise<string> {
  const hashed = await sha256(verifier);
  return base64urlencode(hashed);
}

export async function redirectToSSO(): Promise<void> {
  const state = generateRandomString(16);
  localStorage.setItem("pkce_state", state);

  const codeVerifier = generateRandomString(128);
  localStorage.setItem("pkce_code_verifier", codeVerifier);

  const codeChallenge = await pkceChallengeFromVerifier(codeVerifier);

  const url = `${BASE_URL}/oauth/authorize?response_type=code&client_id=${encodeURIComponent(
    client_id
  )}&redirect_uri=${encodeURIComponent(
    redirect_uri
  )}&state=${encodeURIComponent(state)}&code_challenge=${encodeURIComponent(
    codeChallenge
  )}&code_challenge_method=S256`;

  window.location.href = url;
}

export async function getToken(authorizationCode: string): Promise<any> {
  const response: AxiosResponse<any> = await axios.post(
    `${BASE_URL}/oauth/token`,
    new URLSearchParams({
      grant_type: "authorization_code",
      code: authorizationCode,
      redirect_uri: redirect_uri,
      client_id: client_id,
      code_verifier: localStorage.getItem("pkce_code_verifier") || "",
    })
  );

  const data = response.data;
  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("refresh_token", data.refresh_token);
  return data;
}

export function isAuthenticated(): boolean {
  const accessToken = localStorage.getItem("access_token");
  return !!accessToken;
}

export async function refreshAccessToken(): Promise<any> {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response: AxiosResponse<any> = await axios.post(
    `${BASE_URL}/oauth/token`,
    new URLSearchParams({
      grant_type: "refresh_token",
      client_id: client_id,
      client_secret: client_secret,
      refresh_token: refreshToken,
    })
  );

  const data = response.data;
  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("refresh_token", data.refresh_token);
  return data;
}

export async function getUserInfo(): Promise<any> {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) {
    throw new Error("No access token available");
  }

  const response: AxiosResponse<any> = await axios.get(`${BASE_URL}/api/user`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
}
