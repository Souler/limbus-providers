import * as HTMLParser from "fast-html-parser";

export default class KissanimeHomePage {
  private document: HTMLParser.IFastHTMLElement;

  constructor(body: string) {
    this.document = HTMLParser.parse(body);
  }

  public getRandom() {
    const elem = this.document.querySelector("#divRandomAnime");
    const linkElem = elem.querySelector("#aRandomAnimeResult");
    const titleElem = elem.querySelector("h2");
    const imgElem = elem.querySelector("img");
    return {
      poster: imgElem.attributes.src,
      title: titleElem.text,
      url: linkElem.attributes.href,
    };
  }

  public getTrending() {
    return this.getTabbedShowSectionById("trending");
  }

  public getRecentAdditions() {
    return this.getTabbedShowSectionById("newest");
  }

  public getMostView() {
    return this.getTabbedShowSectionById("mostview");
  }

  private getTabbedShowSectionById(id: string) {
    return this.document.querySelectorAll(`#tab-${id} .item_film_list`).map((elem) => {
      return {
        poster: elem.querySelector(".thumb").attributes.src,
        title: elem.querySelector(".title").text,
        url: elem.querySelector("a").attributes.href,
      };
    });
  }
}
