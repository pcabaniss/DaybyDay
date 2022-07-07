import { create } from "apisauce";
import cache from "../utilities/cache";
import authStorage from "../auth/storage";

const apiClient = create({
  baseURL: "http://172.20.10.3:9000/api/",
});
apiClient.addAsyncRequestTransform(async (request) => {
  const authToken = await authStorage.getToken();
  if (!authToken) return;
  request.headers["x-auth-token"] = authToken;
});

apiClient.get = async (url, params, axiosConfig) => {
  console.log("Trying to get");
  const response = await get(url, params, axiosConfig);

  if (response.ok) {
    cache.store(url, response.data);
    return response;
  }

  const data = await cache.get(url);
  return data ? { ok: true, data } : response;
};
const get = apiClient.get;

export default apiClient;
