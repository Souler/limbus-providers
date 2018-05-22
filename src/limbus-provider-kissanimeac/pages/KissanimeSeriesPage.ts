import * as HTMLParser from "fast-html-parser";

export interface IKissAnimeSeriesEpisodeLink {
  name: string;
  url: string;
}

export default class KissanimeSeriesPage {
  public readonly uri: string;
  private document: HTMLParser.IFastHTMLElement;

  constructor(body: string, url: string = "") {
    this.uri = url;
    this.document = HTMLParser.parse(body);
  }

  public getTitle(): string {
    return this.document.querySelector("h2 strong").text.trim();
  }

  public getPoster(): string {
    return this.document.querySelector(".cover_anime img").attributes.src;
  }

  public getSummary(): string {
    return this.document.querySelector(".summary").text.trim();
  }

  public getEpisodes(): IKissAnimeSeriesEpisodeLink[] {
    return this.document.querySelectorAll(".listing h3 a").reverse().map((elem) => {
      return {
        name: elem.text.split("-").pop().trim(),
        url: elem.attributes.href,
      };
    }).filter((e) => e.name !== "_Preview");
  }

  public getYear(): string {
    const infos = this.document.querySelectorAll(".barContent .full p");
    const dateInfo = infos.find((e) => e.text.includes("Date aired"));
    if (!dateInfo) {
      return "";
    }
    const [, year] = /([0-9]{4})/i.exec(dateInfo.text);
    return year || "";
  }
}
