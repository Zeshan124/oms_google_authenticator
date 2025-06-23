export function setCookie(name, value, days = 7) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  const cookieValue = encodeURIComponent(value);
  let cookieString = `${name}=${cookieValue}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;

  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    cookieString += "; Secure";
  }
  document.cookie = cookieString;
}

export function getCookie(name) {
  if (typeof document === "undefined") return null;

  const nameEQ = name + "=";
  const ca = document.cookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
}

// Remove a cookie by setting its expiration to the past
export function removeCookie(name) {
  if (typeof document === "undefined") return;

  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// Check if a cookie exists
export function hasCookie(name) {
  return getCookie(name) !== null;
}

// Clear all authentication cookies
export function clearAuthCookies() {
  removeCookie("authToken");
  removeCookie("userData");
}
