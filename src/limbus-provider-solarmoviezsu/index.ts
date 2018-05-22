import { IRegisterFunction } from "limbus-core";
import SolarmoviezContentProvider from "./SolarmoviezContentProvider";
import SolarmoviezVideoProvider from "./SolarmoviezVideoProvider";

const registerKissanimeProviders: IRegisterFunction = () => {
  return Promise.resolve({
    name: "Solarmoviez.su",
    description: "Provides access to soularmovies.se series listing and video playback",
    contentProviders: [new SolarmoviezContentProvider()],
    videoProviders: [new SolarmoviezVideoProvider()],
  });
}

module.exports = registerKissanimeProviders;