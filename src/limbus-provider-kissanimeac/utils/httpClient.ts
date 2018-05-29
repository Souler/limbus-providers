import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { KissanimeCloudflareDdosPage } from "../pages";
import delay from "./delay";

class KissanimeHttpClient {
  private http = axios.create({ withCredentials: true });

  public async request<T = any>(req: AxiosRequestConfig, timesChallenged: number = 0): Promise<T> {
    return this.http.request<T>(req)
    .then((res) => res.data)
    .catch((e: AxiosError) => {
      if (
        e.response.status === 503 &&
        e.response.data.includes("cf-content") &&
        timesChallenged < 5
      ) {
        const page = new KissanimeCloudflareDdosPage(e.response.data, req.url);
        return delay(page.getChallengeDelay())
          .then(() => this.request({ url: page.getChallengeSolutionUrl() }, timesChallenged + 1))
          .then(() => this.request(req, timesChallenged));
      } else if (timesChallenged >= 5) {
        const err = new Error("Cloudflare challenge was not properly resolved after 5 attempts.");
        return Promise.reject(err);
      } else {
        return Promise.reject(e);
      }
    });
  }
}

export default new KissanimeHttpClient();