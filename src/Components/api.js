export async function fetchWithRefresh(url, options = {}, token, setAuthData) {
  const isFormData = options.body instanceof FormData;

  // attach token to headers
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    // only set JSON content type if not FormData
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
  };

  let res = await fetch(url, options);

  if (res.status === 401) {
    const refreshRes = await fetch("/auth/refresh", {
      method: "GET",
      credentials: "include",
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();

      setAuthData(prev => ({ ...prev, token: data.token }));

      options.headers.Authorization = `Bearer ${data.token}`;
      return fetch(url, options);
    } else {
      localStorage.removeItem("authData");
      window.location.href = "/";
    }
  }

  return res;
}
