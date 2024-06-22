export async function getWikiPage(pageTitle: string) {
  const result = await fetch(
    `https://en.wikipedia.org/w/api.php?action=parse&prop=text&page=${pageTitle}&format=json&disableeditsection=1&redirects=true&useskin=minerva&origin=*`
  );
  const data = await result.json();

  return data.parse.text["*"];
}
