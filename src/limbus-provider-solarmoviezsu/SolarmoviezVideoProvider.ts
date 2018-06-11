import axios from "axios";
import { IVideoProvider } from "limbus-core";
import * as querystring from "querystring";
import * as URL from "url";

export default class SolarmoviezVideoProvider implements IVideoProvider {
  public canHandleUrl(url: string): boolean {
    const parsedUrl = URL.parse(url);
    return parsedUrl.hostname === "solarmoviez.su";
  }

  public async getVideoUrl(url: string, retry: number = 0): Promise<string> {
    const { episode_id: id } = querystring.parse(URL.parse(url).query);
    const resSources = await axios.request({
      headers: { referer: url },
      method: "GET",
      params: {
        id,
        retry: retry > 0 ? retry : undefined,
      },
      url: "https://solarmoviez.su/ajax/v2_get_sources",
    });
    const videoDataUrl = URL.resolve(url, resSources.data.value);
    const videoDataReq = await axios.request({
      headers: { referer: url },
      url: videoDataUrl
    });
    const videoUrl = videoDataReq.data.playlist[0].file;
    const req = await axios.request({
      method: "HEAD",
      validateStatus: () => true,
      url: videoUrl,
    });
    if (req.status >= 400) {
      return this.getVideoUrl(url, retry + 1);
    }
    return videoUrl;
  }
}
