import { IRegisterFunction } from "limbus-core";
import KissanimeContentProvider from "./KissanimeContentProvider";
import KissanimeVideoProvider from "./KissanimeVideoProvider";

const registerKissanimeProviders: IRegisterFunction = () => {
  return Promise.resolve({
    name: "Kissanime.ac",
    description: "Provides access to kissanime.ac series listing and video playback",
    contentProviders: [new KissanimeContentProvider()],
    videoProviders: [new KissanimeVideoProvider()],
  });
}

module.exports = registerKissanimeProviders;