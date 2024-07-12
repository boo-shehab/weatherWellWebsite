import axios from "axios";

const axiosIns = axios.create({
  // You can add your headers here
  // ================================
  baseURL: "http://54.255.152.196:3000/api/v1/",
});

// Add request interceptor to handle the authorization header dynamically
axiosIns.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem("access_token");

    // If token is found, set the authorization header
    // if (token) {
      // Set the Authorization header using the retrieved token
      // config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    // Handle request error here
    return Promise.reject(error);
  }
);

// ℹ️ Add response interceptor to handle 401 response
axiosIns.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle error
    // if (error.response.statusCode === 401) {
      // ℹ️ Logout user and redirect to login page
      // Remove "userData" from localStorage

      // Remove "accessToken" from localStorage
      // localStorage.removeItem("accessToken");

      // If 401 response returned from api
    //   router.push("/login");
    // } else {
    //   return Promise.reject(error);
    // }
  }
);

export default axiosIns;
