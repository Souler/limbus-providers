import * as HTMLParser from "fast-html-parser";

export default class SolarmoviezSearchPage {
  private document: HTMLParser.IFastHTMLElement;

  constructor(body: string) {
    this.document = HTMLParser.parse(body);
  }

  public getResults() {
    return this.document.querySelectorAll(".movies-list-wrap .movies-list .ml-item")
      .map(this.adaptMovieListElem);
  }

  private adaptMovieListElem = (elem: HTMLParser.IFastHTMLElement) => {
    const linkElem = elem.querySelector("a");
    const titleElem = elem.querySelector(".mli-info h2");
    const imgElem = elem.querySelector(".mli-thumb");
    return {
      poster: imgElem.attributes["data-original"],
      title: titleElem.text,
      url: linkElem.attributes.href,
    };
  }
}
