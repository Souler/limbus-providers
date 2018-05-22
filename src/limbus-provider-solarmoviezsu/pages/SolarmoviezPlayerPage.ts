import * as HTMLParser from "fast-html-parser";

export interface IEpisodeLink {
  name: string;
  url: string;
}

export default class SolarmoviezPlayerPage {
  private document: HTMLParser.IFastHTMLElement;

  constructor(body: string) {
    this.document = HTMLParser.parse(body);
  }

  public getEpisodes(): IEpisodeLink[] {
    const eps = this.document.querySelectorAll("#list-eps a.btn-eps")
      .map((elem) => {
        return {
          name: elem.text,
          url: elem.attributes.href,
        };
      });
    if (eps.length <= 0) {
      return  [{
        name: "Movie",
        url: this.getFullPlayerUrl(),
      }];
    } else {
      return eps;
    }
  }

  private getFullPlayerUrl(): string {
    return this.document.querySelector("#player-area .ctn a").attributes.href;
  }
}
