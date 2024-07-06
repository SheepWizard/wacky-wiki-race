import { Room } from "../types";
import {
  celebrityUrls,
  majorEventsUrls,
  wikipediaCountryPages,
} from "./excludeGroups";

function hideLink(node: HTMLAnchorElement) {
  node.classList.add("link-hide");
}

function disableLink(node: HTMLAnchorElement) {
  node.addEventListener("click", (e) => {
    console.log("click");
    e.preventDefault();
  });
}

export async function anchorClickListen(callback: (pageTitle: string) => void) {
  const atags = document.querySelectorAll("a");

  for (let node of atags) {
    // node.setAttribute("data-link-remove", node.innerText);
    // node.classList.add(searchHide);
    // node.innerHTML = "";

    if (node.href.match(/^.*\.[a-zA-Z\d]+$/)) {
      hideLink(node);
      disableLink(node);
      continue;
    }

    if (node.href.includes("#")) {
      hideLink(node);
      disableLink(node);
      continue;
    }

    // Find better way of checking wiki link
    if (!node.href.includes("/wiki/")) {
      hideLink(node);
      disableLink(node);
      continue;
    }

    node.addEventListener("click", async (e) => {
      e.preventDefault();
      const target = e.target;
      if (!target) {
        return;
      }
      if (!(target instanceof HTMLAnchorElement)) {
        return;
      }

      if (target.classList.contains("link-hide")) {
        return;
      }

      const tokens = target.href.split("/");
      const pageTitle = tokens.pop();
      if (!pageTitle) {
        return;
      }
      callback(decodeURIComponent(pageTitle));
    });
  }
}

export function applyExcludeRules(
  excludeGroups: Room["rules"]["excludeGroups"]
) {
  const atags = document.querySelectorAll("a");

  const excludePageTitles: string[] = [];
  if (excludeGroups.includes("countries")) {
    excludePageTitles.push(...wikipediaCountryPages);
  }
  if (excludeGroups.includes("events")) {
    excludePageTitles.push(...majorEventsUrls);
  }
  if (excludeGroups.includes("celebrities")) {
    excludePageTitles.push(...celebrityUrls);
  }

  for (let node of atags) {
    for (let pageTitle of excludePageTitles) {
      const hrefLower = node.href.toLowerCase();
      if (hrefLower.endsWith(`/wiki/${pageTitle.toLowerCase()}`)) {
        hideLink(node);
        disableLink(node);
        continue;
      }
    }
  }
}
