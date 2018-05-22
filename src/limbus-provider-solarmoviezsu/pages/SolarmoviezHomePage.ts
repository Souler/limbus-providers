import * as HTMLParser from "fast-html-parser";

export interface IMovieSection {
  title: string;
  movies: Array<{
  poster: string;
  title: string;
  url: string;
  }>;
}
export default class SolarmoviezHomePage {
  private document: HTMLParser.IFastHTMLElement;

  constructor(body: string) {
  this.document = HTMLParser.parse(body);
  }

  public getMoviesSections() {
  return this.document.querySelectorAll(".movies-list-wrap")
  .map(this.adaptMovieListWrap);
  }

  private adaptMovieListWrap = (elem: HTMLParser.IFastHTMLElement) => {
  const titleElem = elem.querySelector(".ml-title span.pull-left");
  const movieElems = elem.querySelectorAll(".movies-list .ml-item");
  return {
  movies: movieElems.map(this.adaptMovieListElem),
  title: titleElem.text,
  };
  }

  private adaptMovieListElem = (elem: HTMLParser.IFastHTMLElement) => {
  const linkElem = elem.querySelector("a.ml-mask");
  const titleElem = elem.querySelector(".mli-info h2");
  const imgElem = elem.querySelector(".mli-thumb");
  return {
  poster: imgElem.attributes["data-original"],
  title: titleElem.text,
  url: linkElem.attributes.href,
  };
  }
}
