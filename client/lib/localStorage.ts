// store token in local storage to keep user logged in between page refreshes
export function saveToken(token: string, rememberMe: boolean = true) {
  if (rememberMe) {
    localStorage.setItem("token", token);
  } else {
    sessionStorage.setItem("token", token);
  }
}

// remove token from local storage
export function removeToken() {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
}

// get token from local storage or session storage
export function getToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}
