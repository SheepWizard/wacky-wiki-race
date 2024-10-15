import { Room } from "../types";

function hideLink(node: HTMLAnchorElement) {
  node.classList.add("link-hide");
}

function disableLink(node: HTMLAnchorElement) {
  node.addEventListener("click", (e) => {
    e.preventDefault();
  });
}

export async function anchorClickListen(
  rules: Room["rules"],
  callback: (pageTitle: string) => void
) {
  const atags = document.querySelectorAll("a");

  if (rules.noNavBox) {
    const navBoxs = document.querySelectorAll(".navbox");
    for (let elm of navBoxs) {
      elm.remove();
    }
  }

  for (let node of atags) {
    if (rules.noPageSearch) {
      node.setAttribute("data-link-remove", node.innerText);
      node.classList.add("searchHide");
      node.innerHTML = "";
    }

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
