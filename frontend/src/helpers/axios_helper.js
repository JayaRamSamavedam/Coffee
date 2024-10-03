import axios from 'axios';
import Cookies from 'js-cookie';

// const globalurl = 'http://localhost:8888';

const globalurl = 'https://coffee-iota-lake.vercel.app'


axios.defaults.baseURL = globalurl;
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const getAuthToken = () => {
  return Cookies.get('auth_token') || null;
};

export const isAuthTokenPresent = () => {
    return Cookies.get('auth_token') !== undefined;
};

// Function to store user details in cookies
export const setUserDetails = (details) => {
  Cookies.set('details', JSON.stringify(details), { expires: 1 / 96 }); // 15 minutes expiry
};
export const getUserDetails = () => {
  const details = Cookies.get('details');
  return details ? JSON.parse(details) : null; // Return parsed object or null if not available
};

export const setAuthHeader = (token) => {
  Cookies.set('auth_token', token, { expires: 1 / 96 });
};

export const setRefreshToken = (token) => {
  Cookies.set('jwt', token, {
    expires: 1,
    secure: true,
    sameSite: 'Lax',
    httpOnly: true
  });
};


export const flushCookies = () => {
  const cookies = Cookies.get();
  for (const cookie in cookies) {
    Cookies.remove(cookie);
    Cookies.remove(cookie, { domain: 'localhost', path: '/' });
  }
};


export const Request =  (method, url, data) => {
  let headers = {};

    if (getAuthToken()) {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    console.log(headers);
    console.log(data);
    return axios({
      method: method,
      url: globalurl.concat(url),
      headers: headers,
      data: data,
      withCredentials: true,
     
    });
};

export const RequestParams =  (method, url,params) => {
  let headers = {};
  // console.log(data)
    if (getAuthToken()) {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    return axios({
      method: method,
      url: globalurl.concat(url),
      headers: headers,
      withCredentials: true,
      params:params,
    });
};

export const  getJwtCookie=()=>{
    const cookieString = document.cookie;
    const cookies = cookieString.split('; ');
  console.log(document.cookie)
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName === 'jwt') {
        return cookieValue;
      }
    }
  
    return null;
  };