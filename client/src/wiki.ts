export async function wikiApiGetPage(pageTitle: string) {
  const result = await fetch(
    `https://en.wikipedia.org/w/api.php?action=parse&prop=text&page=${encodeURIComponent(pageTitle)}&format=json&disableeditsection=1&redirects=true&useskin=minerva&origin=*`
  );
  const data = await result.json();

  return data.parse.text["*"];
}

export async function wikiApiGetRandomPage(): Promise<string> {
  const result = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&list=random&rnnamespace=0&rnlimit=1&format=json&origin=*`
  );
  const data = await result.json();
  const titles = data.query.random.map((x: any) =>
    x.title.replaceAll(" ", "_")
  );
  return titles[0];
}

const searchCache: Map<string, string[]> = new Map();
export async function wikiApiSearchForPage(
  searchTerm: string
): Promise<string[]> {
  const cachedSearch = searchCache.get(searchTerm);
  if (cachedSearch?.length) {
    return cachedSearch;
  }
  const result = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&utf8=&format=json&origin=*`
  );
  const data = await result.json();
  const titles = data.query.search.map((x: any) =>
    x.title.replaceAll(" ", "_")
  );
  searchCache.set(searchTerm, titles);
  return titles;
}

const extractCache: Map<string, string> = new Map();
export async function wikiApiGetExtract(title: string): Promise<string> {
  const cachedExtract = extractCache.get(title);
  if (cachedExtract) {
    return cachedExtract;
  }

  const result = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exchars=120&titles=${encodeURIComponent(title)}&format=json&explaintext=true&origin=*`
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
    extractCache.set(title, entry[1].extract);
    return entry[1].extract;
  }
  return "";
}
