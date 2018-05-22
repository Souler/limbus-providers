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
    const sources = await this.request(
      `https://solarmoviez.su/ajax/v2_get_sources?id=${id}&retry=${retry}`,
      url,
    );
    const videoDataUrl = URL.resolve(url, sources.value);
    const videoData = await this.request(videoDataUrl, url);
    const videoUrl = videoData.playlist[0].file;
    const req = await fetch(videoUrl);
    console.warn(retry, req.status);
    if (req.status >= 400) {
      return this.getVideoUrl(url, retry + 1);
    }
    return videoData.playlist[0].file;
  }

  private request(url: string, playerUrl: string) {
    return fetch(`${url}&_=${Date.now()}`, {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        origin: "https://solarmoviez.su",
        referer: url,
      },
    }).then((res) => res.json());
  }
}
