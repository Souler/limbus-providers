import * as URL from "url";
import {
  IContentProvider,
  IEpisodeGroup,
  IEpisodeInformation,
  IFeaturedShowSection,
  ISearchableShow,
  IShowInformation,
  IVideoResource,
} from "limbus-core";

import {
  IKissAnimeSeriesEpisodeLink,
  KissanimeHomePage,
  KissanimeSearchPage,
  KissanimeSeriesPage,
} from "./pages";
import { chunk, httpClient } from "./utils";

const KISSANIME_HOME_URL = "https://kissanime.ac/kissanime.html";
const KISSANIME_SEARCH_URL = "https://kissanime.ac/AdvanceSearch";

export default class KissanimeContentProvider implements IContentProvider {
  public readonly name = "KissanimeacContentProvider";
  private homePage: Promise<KissanimeHomePage> = null;

  public async getFeatured(): Promise<IFeaturedShowSection[]> {
    const page = await this.getHomePage();
    const replaceUrlWithId = (s): ISearchableShow => Object.assign(s, { id: s.url });
    const trendingShows = page.getTrending().map(replaceUrlWithId);
    const popularShows = page.getMostView().map(replaceUrlWithId);
    const recentShows = page.getRecentAdditions().map(replaceUrlWithId);
    return Promise.resolve([
      {
        shows: trendingShows,
        title: "Trending",
      },
      {
        shows: popularShows,
        title: "Most popular",
      },
      {
        shows: recentShows,
        title: "Recent Adittions",
      },
    ]);
  }

  public async getHightlightShow(): Promise<ISearchableShow> {
    const page = await this.getHomePage();
    const show = page.getRandom();
    return Object.assign({}, show, { id: show.url });
  }

  public async getShowById(id: string): Promise<IShowInformation> {
    const page = await this.getSeriesPage(id);
    return Promise.resolve({
      episodeGroups: this.generateEpisodeGroups(page),
      id: page.uri,
      poster: page.getPoster(),
      summary: page.getSummary(),
      title: page.getTitle(),
      year: page.getYear(),
    });
  }

  public async getShowEpisodes(showId: string, episodeGroupId: string): Promise<IEpisodeInformation[]> {
    const page = await this.getSeriesPage(showId);
    const episodesGroups = this.generateEpisodeGroups(page);
    const episodesGroup = episodesGroups.find((g) => g.id === episodeGroupId);
    return Promise.resolve(episodesGroup.episodes.map((ep) => {
      return {
        id: ep.url,
        summary: "",
        thumbnail: page.getPoster(),
        title: ep.name,
      };
    }));
  }

  public async search(term: string): Promise<ISearchableShow[]> {
    const page = await this.getSearchPage(term);
    return page.getResults().map((result) => {
      return {
        id: result.url,
        poster: result.poster,
        title: result.title,
      };
    });
  }

  public async getEpisodeVideoResources(showId: string, episodeId: string): Promise<IVideoResource[]> {
    return Promise.resolve([{ url: episodeId, desc: "" }]);
  }

  private getHomePage(): Promise<KissanimeHomePage> {
    if (!this.homePage) {
      this.homePage = httpClient.request({ url: KISSANIME_HOME_URL })
        .then((content) => new KissanimeHomePage(content));
    }
    return this.homePage;
  }

  private async getSeriesPage(id: string) {
    const content = await httpClient.request({ url: id });
    return new KissanimeSeriesPage(content, id);
  }

  private async getSearchPage(term: string) {
    const url = URL.parse(KISSANIME_SEARCH_URL, true);
    url.query = { genre: "", name: term, status: "" };
    const reqUrl = URL.format(url);
    const content = await httpClient.request({ url: reqUrl });
    return new KissanimeSearchPage(content);
  }

  private generateEpisodeGroups(page: KissanimeSeriesPage):
    Array<(IEpisodeGroup & { episodes: IKissAnimeSeriesEpisodeLink[] })> {
    const episodes = page.getEpisodes();
    const episodesChunks = chunk(episodes, 23);
    return episodesChunks.map((episodesChunk, chunkId) => {
      let title = episodesChunk[0].name;
      if (episodesChunk.length > 1) {
        const name1 = episodesChunk[0].name;
        const name2 = episodesChunk[episodesChunk.length - 1].name;
        title = `${name1} - ${name2}`;
      }
      return {
        episodes: episodesChunk,
        id: `${page.getTitle()}-epschunk${chunkId}`,
        title,
      };
    });
  }
}
