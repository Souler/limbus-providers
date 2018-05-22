import axios from "axios";
import {
  IContentProvider,
  IEpisodeInformation,
  IFeaturedShowSection,
  ISearchableShow,
  IShowInformation,
  IVideoResource,
} from "limbus-core";

import {
  IMovieSection,
  SolarmoviezHomePage,
  SolarmoviezMoveInfoPage,
  SolarmoviezPlayerPage,
  SolarmoviezSearchPage,
} from "./pages"

export default class SolarmoviezContentProvider implements IContentProvider {
  public readonly name: string = "SolarmoviezContentProvider";
  private http = axios.create();

  public async getFeatured(): Promise<IFeaturedShowSection[]> {
    const url = "https://solarmoviez.su/solarmovie.html";
    const res = await this.http.request({
      method: "GET",
      url,
    });
    const homePage = new SolarmoviezHomePage(res.data);
    return homePage.getMoviesSections().map(this.adaptHomeMoviesToFeaturedShows);
  }

  public getHightlightShow() {
    return Promise.resolve(null);
  }

  public async search(term: string): Promise<ISearchableShow[]> {
    const slug = term.toLowerCase().trim().replace(/\s/g, "+").replace(/[^a-z0-9\-]/, "");
    const res = await this.http.request({
      method: "GET",
      url: `https://solarmoviez.su/movie/search/${slug}.html`,
    });
    const searchPage = new SolarmoviezSearchPage(res.data);
    return Promise.resolve(searchPage.getResults().map(this.adaptMovieToShow));
  }

  public async getShowById(id: string): Promise<IShowInformation> {
    const moviePage = await this.getMoviePage(id);
    return {
      episodeGroups: [{ id: "all", title: "All episodes" }],
      id,
      poster: moviePage.getBanner(),
      summary: moviePage.getSummary(),
      title: moviePage.getTitle(),
      year: moviePage.getYear(),
    };
  }

  public async getShowEpisodes(showId: string, episodeGroupId: string): Promise<IEpisodeInformation[]> {
    const moviePage = await this.getMoviePage(showId);
    const req = await this.http.request({
      method: "GET",
      url: moviePage.getPlayerUrl(),
    });
    const playerPage = new SolarmoviezPlayerPage(req.data);
    return Promise.resolve(playerPage.getEpisodes().map((ep) => {
      return {
        id: ep.url,
        summary: "",
        thumbnail: moviePage.getBanner(),
        title: ep.name,
      };
    }));
  }

  public getEpisodeVideoResources(showId: string, episodeId: string): Promise<IVideoResource[]> {
    return Promise.resolve([{ url: episodeId, desc: "" }]);
  }

  private async getMoviePage(id: string) {
    const url = id;
    const res = await this.http.request({
      method: "GET",
      url,
    });
    return new SolarmoviezMoveInfoPage(res.data);
  }

  private adaptHomeMoviesToFeaturedShows = (e: IMovieSection): IFeaturedShowSection => {
    return {
      shows: e.movies.map(this.adaptMovieToShow),
      title: e.title,
    };
  }

  private adaptMovieToShow = (m): ISearchableShow => {
    return {
      id: m.url,
      poster: m.poster,
      title: m.title,
    };
  }
}
