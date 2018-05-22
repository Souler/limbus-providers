import * as HTMLParser from "fast-html-parser";

export default class SolarmoviezMoveInfoPage {
  private document: HTMLParser.IFastHTMLElement;

  constructor(body: string) {
    this.document = HTMLParser.parse(body);
  }

  public getPosterUrl() {
    const imgElem = this.document.querySelector(".mvic-desc .dm-thumb img");
    return imgElem.attributes.src;
  }

  public getTitle() {
    const titleElem = this.document.querySelector(".mvic-desc h1");
    return titleElem.text;
  }

  public getBanner() {
    const bannerElem = this.document.querySelector(".page-cover");
    const stylesStr = bannerElem.attributes.style;
    const bgImageRgx = /background-image: url\((.*?)\)/;
    if (!bgImageRgx.test(stylesStr)) {
      return "";
    } else {
      const [, bannerUrl] = bgImageRgx.exec(stylesStr);
      return bannerUrl;
    }
  }

  public getSummary() {
    try {
      const descElem = this.document.querySelector(".desc");
      return descElem.childNodes[0].text.replace(/\.\./g, ".");
    } catch (e) {
      return "";
    }
  }

  public getYear() {
    // TODO: Implement
    return "";
  }

  public getPlayerUrl() {
    return this.document.querySelector(".mod-btn-watch").attributes.href;
  }
}
