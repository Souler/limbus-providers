import * as HTMLParser from "fast-html-parser";
import * as URL from "url";

const RGX_CHALLENGE_HASH = /var s,t,o,p,b,r,e,a,k,i,n,g,f, (.+?)={"([a-z]+)":([+\-*\/()[\]!]+)};/i;

export default class KissanimeCloudflareDdosPage {
  public readonly url: string;
  private readonly parsedUrl: URL.UrlWithStringQuery;
  private document: HTMLParser.IFastHTMLElement;

  constructor(body: string, url: string) {
    this.url = url;
    this.parsedUrl = URL.parse(url);
    this.document = HTMLParser.parse(body, { script: true });
  }

  public getChallengeDelay() {
    // TODO: Should we retrieve this value from the page? Is it worth it?
    return 4000;
  }

  public getChallengeSolutionUrl(): string {
    const formActionUrl = this.getChallengeFormUrl();
    const formFields = this.getChallengeFormFields();
    const jsChallengeAnswer = this.getChallengeSolution();
    formFields.jschl_answer = `${jsChallengeAnswer}`;
    const solutionUrl = URL.parse(URL.resolve(this.url, formActionUrl), true);
    solutionUrl.query = formFields;
    return URL.format(solutionUrl);
  }

  private getChallengeForm(): HTMLParser.IFastHTMLElement {
    const form = this.document.querySelector("#challenge-form");
    if (!form) {
      throw new Error("Coulnd't find challenge challenge-form");
    }
    return form;
  }

  private getChallengeFormUrl(): string {
    const form = this.getChallengeForm();
    return form.attributes.action;
  }

  private getChallengeFormFields(): { [field: string]: string } {
    const form = this.getChallengeForm();
    return form.querySelectorAll("input").reduce((fields, i) =>
      Object.assign(fields, { [i.attributes.name]: i.attributes.value || "" }), {});
  }

  private getChallengeSolution(): string {
    const script = this.document.querySelector("script");
    if (!script) {
      throw new Error("Couldn't find js challenge script tag");
    }
    const scriptMatch = RGX_CHALLENGE_HASH.exec(script.text);
    if (!scriptMatch) {
      throw new Error("Couldn't find js challenge hash solution initialization code");
    }
    const [, hashName, hashKey, hashValue] = scriptMatch;
    const rgxHashAlterations = new RegExp(`${hashName}\.${hashKey}[+\\/\\-*]{0,1}=[+\\-*\\/()[\\]!]+?;`, "g");
    const hashAlterations = script.text.match(rgxHashAlterations);
    if (!hashAlterations) {
      throw new Error("Couldn't find js challenge hash alterations code");
    }
    const codeToEval = [
      `var  ${hashName}={${hashKey}:${hashValue}}`,
      hashAlterations.join("\n"),
      `${hashName}.${hashKey}`,
    ].join(";\n");
    // tslint:disable-next-line:no-eval
    const hashNumericValue: string = (() => eval(codeToEval))();
    const numericResult = (parseFloat(hashNumericValue) + this.parsedUrl.hostname.length).toFixed(10);
    return numericResult;
  }
}
