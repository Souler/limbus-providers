import * as HTMLParser from "fast-html-parser";

export default class KissanimeSearchPage {
  private document: HTMLParser.IFastHTMLElement;

  constructor(body: string) {
    this.document = HTMLParser.parse(body);
  }

  public getSearchTerm() {
    const searchTerm = this.document.querySelector("h1 strong");
    const rgxExtract = /Result: "(.+)"/;
    const [, term ] = rgxExtract.exec(searchTerm.text);
    return term;
  }

  public getResults() {
    return this.document.querySelectorAll(".item_movies_in_cat").map((elem) => {
      const posterContainer = elem.querySelector("div");
      const titleLink = elem.querySelector(".item_movies_link");
      return {
        // This is an error of the parsing library, src shouldn't be an attibute of the div
        poster: posterContainer.attributes.src,
        title: titleLink.text,
        url: titleLink.attributes.href,
      };
    });
  }
}
