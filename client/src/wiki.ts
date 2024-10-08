import { WikiPage } from "./types";

interface WikiParsePage {
  parse: string;
  pageId: string;
}

const BASE_URL = "https://en.wikipedia.org/w/api.php";

export async function wikiApiGetPage(pageId: number): Promise<WikiParsePage> {
  const result = await fetch(
    `${BASE_URL}?action=parse&prop=text|categories&pageid=${pageId}&disabletoc=true&format=json&disableeditsection=1&redirects=true&useskin=minerva&origin=*`
  );
  const data = await result.json();

  return {
    parse: data.parse.text["*"],
    pageId: data.parse.pageid,
  };
}

export async function wikiApiGetRandomPage(): Promise<WikiPage> {
  const result = await fetch(
    `${BASE_URL}?action=query&list=random&rnnamespace=0&rnlimit=1&format=json&origin=*`
  );
  const data = await result.json();
  const titles = data.query.random.map((x: any) => ({
    title: x.title.replaceAll(" ", "_"),
    pageId: x.pageid,
  }));
  return titles[0];
}

const searchCache: Map<string, WikiPage[]> = new Map();
export async function wikiApiSearchForPage(
  searchTerm: string
): Promise<WikiPage[]> {
  const cachedSearch = searchCache.get(searchTerm);
  if (cachedSearch?.length) {
    return cachedSearch;
  }
  const result = await fetch(
    `${BASE_URL}?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&utf8=&format=json&origin=*`
  );
  const data = await result.json();
  const wikiPages = data.query.search.map((x: any) => ({
    title: x.title.replaceAll(" ", "_"),
    pageId: x.pageid,
  }));
  searchCache.set(searchTerm, wikiPages);
  return wikiPages;
}

const extractCache: Map<number, string> = new Map();
export async function wikiApiGetExtract(pageId: number): Promise<string> {
  const cachedExtract = extractCache.get(pageId);
  if (cachedExtract) {
    return cachedExtract;
  }

  const result = await fetch(
    `${BASE_URL}?action=query&prop=extracts&exchars=120&pageids=${pageId}&format=json&explaintext=true&origin=*`
  );
  const data = await result.json();
  const entry = Object.entries(data.query.pages)[0];
  if (
    entry &&
    entry[1] !== null &&
    typeof entry[1] === "object" &&
    "extract" in entry[1] &&
    typeof entry[1].extract === "string"
  ) {
    extractCache.set(pageId, entry[1].extract);
    return entry[1].extract;
  }
  return "";
}

export async function wikiApiGetCategories(pageId: string): Promise<string[]> {
  const result = await fetch(
    `${BASE_URL}?action=query&prop=categories&format=json&cllimit=50&clcategories=Category:G20 members&pageids=${pageId}&origin=*`
  );
  const data = await result.json();
  const categories = data.query?.pages?.[pageId]?.categories;
  console.log(categories);
  return [];
}

const pageIdCache: Map<string, number> = new Map();
export async function wikiApiGetPageIdFromTitle(
  pageTitle: string
): Promise<number> {
  const cachedExtract = pageIdCache.get(pageTitle);
  if (cachedExtract) {
    return cachedExtract;
  }

  const result = await fetch(
    `${BASE_URL}?action=query&prop=info&format=json&titles=${encodeURIComponent(pageTitle)}&origin=*`
  );
  const data = await result.json();
  const entry = Object.entries(data.query.pages)[0];
  if (
    entry &&
    entry[1] !== null &&
    typeof entry[1] === "object" &&
    "pageid" in entry[1] &&
    typeof entry[1].pageid === "number"
  ) {
    pageIdCache.set(pageTitle, entry[1].pageid);
    return entry[1].pageid;
  }
  throw Error();
}
