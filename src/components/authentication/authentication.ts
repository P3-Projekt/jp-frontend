export function getToken() {
    const token = localStorage.getItem('authToken');
    if(!token) {
        window.location.href = '/login';
    } else {
      return token;
    }
}

// Define a helper function to make API calls with Bearer token
export function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    // Set the default headers with Bearer token
    const headers = {
      'Authorization': `Bearer ${getToken()}`,  // Bearer token
      ...options.headers,  // Merge any additional headers passed in options
    };
  
    // Perform the fetch call with the provided URL and options
    return fetch(url, {
      ...options,  // Spread the passed options (method, body, etc.)
      headers,     // Override headers with our Bearer token
    });
}
  