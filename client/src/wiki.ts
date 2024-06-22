export async function getWikiPage(pageTitle: string) {
  const result = await fetch(
    `https://en.wikipedia.org/w/api.php?action=parse&prop=text&page=${pageTitle}&format=json&disableeditsection=1&redirects=true&useskin=minerva&origin=*`
  );
  const data = await result.json();

  return data.parse.text["*"];
}

export async function getRandomWikiPage(): Promise<string> {
  const result = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&list=random&rnnamespace=0&rnlimit=1&format=json&origin=*`
  );
  const data = await result.json();
  const titles = data.query.random.map((x: any) =>
    x.title.replaceAll(" ", "_")
  );
  return titles[0];
}

export async function searchWikiPage(searchTerm: string): Promise<string[]> {
  const result = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${searchTerm}&utf8=&format=json&origin=*`
  );
  const data = await result.json();
  const titles = data.query.search.map((x: any) =>
    x.title.replaceAll(" ", "_")
  );

  return titles;
}
