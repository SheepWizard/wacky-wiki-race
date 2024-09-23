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

interface SearchResult {
  title: string;
  snippet: string;
}

export async function wikiApiSearchForPage(
  searchTerm: string
): Promise<SearchResult[]> {
  const result = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&utf8=&format=json&origin=*`
  );
  const data = await result.json();
  const results: SearchResult[] = data.query.search.map((x: any) => ({
    title: x.title.replaceAll(" ", "_"),
    snippet: x.snippet,
  }));

  return results;
}
