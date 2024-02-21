const getCookieValue = (cookieName) => {
    // Check if running on the client side
    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(cookieName + '=')) {
          return cookie.substring(cookieName.length + 1);
        }
      }
    }
    return null;
  };
  
  
const storage = {
    getAccessToken() {
      return getCookieValue('accessToken');
    },
    setAccessToken(accessToken) {
      document.cookie = `accessToken=${accessToken};`;
    },
    getRefreshToken() {
      return getCookieValue('refreshToken');
    },
    setRefreshToken(refreshToken) {
      document.cookie = `refreshToken=${refreshToken};`;
    },
    getIsAuth() {
      // Check if running on the client side
      if (typeof window !== 'undefined') {
        return JSON.parse(localStorage.getItem('isAuth')) || null;
      }
      return null;
    },
    setIsAuth(isAuth) {
      // Check if running on the client side
      if (typeof window !== 'undefined') {
        localStorage.setItem('isAuth', JSON.stringify(isAuth));
      }
    },
    getAuth() {
      // Check if running on the client side
      if (typeof window !== 'undefined') {
        return JSON.parse(localStorage.getItem('auth')) || null;
      }
      return null;
    },
    setAuth(auth) {
      // Check if running on the client side
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth', JSON.stringify(auth));
      }
    },
    removeAuth() {
      // Check if running on the client side
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth');
      }
    },
    removeIsAuth() {
      // Check if running on the client side
      if (typeof window !== 'undefined') {
        localStorage.removeItem('isAuth');
      }
    },
};
  
  export default storage;
  