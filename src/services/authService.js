// src/services/authService.js

import axios from "axios";

const BASE_URL = "https://sso.ssv.uz";

const client_id = "94f83670-f841-4ec5-a593-72d2873f054b";
const client_secret = "IAIkBdrmSVPWPH5vtvihY4vOfLW3V19oDEC9wHIs";
const redirect_uri = "your_redirect_uri";

function generateRandomString(length) {
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, (dec) => ("0" + dec.toString(16)).substr(-2)).join(
    ""
  );
}

async function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
}

function base64urlencode(str) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function pkceChallengeFromVerifier(verifier) {
  const hashed = await sha256(verifier);
  return base64urlencode(hashed);
}

export async function redirectToSSO() {
  const state = generateRandomString(16);
  localStorage.setItem("pkce_state", state);

  const codeVerifier = generateRandomString(128);
  localStorage.setItem("pkce_code_verifier", codeVerifier);

  const codeChallenge = await pkceChallengeFromVerifier(codeVerifier);

  const url = `${BASE_URL}/authorize?response_type=code&client_id=${encodeURIComponent(
    client_id
  )}&redirect_uri=${encodeURIComponent(
    redirect_uri
  )}&state=${encodeURIComponent(state)}&code_challenge=${encodeURIComponent(
    codeChallenge
  )}&code_challenge_method=S256`;

  window.location = url;
}

export async function getToken(authorizationCode) {
  const response = await axios.post(
    `${BASE_URL}/oauth/token`,
    new URLSearchParams({
      grant_type: "authorization_code",
      code: authorizationCode,
      redirect_uri: redirect_uri,
      client_id: client_id,
      code_verifier: localStorage.getItem("pkce_code_verifier"),
    })
  );

  const data = response.data;
  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("refresh_token", data.refresh_token);
  return data;
}

export function isAuthenticated() {
  const accessToken = localStorage.getItem("access_token");
  return !!accessToken;
}

export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refresh_token");
  const response = await axios.post(
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

export async function getUserInfo() {
  const accessToken = localStorage.getItem("access_token");
  const response = await axios.get(`${BASE_URL}/api/user`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
}
