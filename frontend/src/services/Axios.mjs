import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

const BASE_URL = "https://zn23g4uvg2.execute-api.eu-west-2.amazonaws.com/prod";

const instance = axios.create({
  baseURL: BASE_URL,
});

instance.interceptors.request.use(
  async (config) => {
    try {
      const session = await fetchAuthSession()

      const accessToken = session.tokens?.idToken;

      if (accessToken) {
        const expirationTime = (accessToken.payload.exp ?? 0) * 1000;
        const currentTime = Date.now();
        const timeUntilExpiry = expirationTime - currentTime;

        if (timeUntilExpiry < 5 * 60 * 1000) {
          console.log("token expiring soon, refreshing");
          const refreshedSession = await fetchAuthSession({
            forceRefresh: true,
          });
          const refreshedToken = refreshedSession.tokens?.idToken?.toString();

          if (refreshedToken) {
            config.headers.Authorization = `Bearer ${refreshedToken}`;
          }
        } else {
          config.headers.Authorization = `Bearer ${accessToken.toString()}`;
        }
      }
    } catch (error) {
      console.error("Failed to get auth session:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
