import { IVideoProvider } from "limbus-core";
import * as qs from "querystring";
import * as URL from "url";

import { httpClient } from "./utils";

export default class KissanimeVideoProvider implements IVideoProvider {
  public canHandleUrl(url: string): boolean {
    const parsedUrl = URL.parse(url);
    return parsedUrl.hostname === "kissanime.ac";
  }

  public getVideoUrl(url: string, retry: number = 0): Promise<string> {
    const parsedUrl = URL.parse(url);
    const { id } = qs.parse(parsedUrl.query);
    return httpClient.request<{ value: string }>({
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
      data: qs.stringify({ episode_id: id }),
      url: "https://kissanime.ac/ajax/anime/load_episodes",
    })
    .then((body) => {
      const playlistUrl = body.value;
      return httpClient.request<any>({
        method: "GET",
        headers: { "referer": url },
        params: { _: Date.now() },
        url: playlistUrl,
      });
    })
    .then((body) => {
      return body.playlist && body.playlist[0]
        ? body.playlist[0].file
        : this.getVideoUrl(url, retry + 1);
    });
  }
}
