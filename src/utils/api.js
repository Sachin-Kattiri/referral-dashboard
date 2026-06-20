import Cookies from 'js-cookie';

const AUTH_URL = 'https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/auth/signin';
const REFERRALS_URL = 'https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals';

export async function loginRequest(email, password) {
  try {
    const response = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

      let responseJson = {};
      try {
        responseJson = await response.json();
      } catch {
        responseJson = {};
      }

    if (response.ok && responseJson?.data?.token) {
      return { success: true, token: responseJson.data.token };
    }

    return {
      success: false,
      message: responseJson?.message || 'Invalid email or password',
    };
  } catch {
    return {
      success: false,
      message: 'Unable to reach the server. Please try again.',
    };
  }
}

export async function fetchReferrals({ search, sort, id } = {}) {
  const token = Cookies.get('jwt_token');

  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (sort) params.set('sort', sort);
  if (id !== undefined && id !== null && id !== '') params.set('id', id);

  const queryString = params.toString();
  const url = queryString ? `${REFERRALS_URL}?${queryString}` : REFERRALS_URL;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token ?? ''}`,
    },
  });

  let responseJson = null;
  try {
    responseJson = await response.json();
  } catch {
  }

  if (!response.ok) {
    const message =
      responseJson?.message || `Request failed with status ${response.status}.`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return responseJson;
}
