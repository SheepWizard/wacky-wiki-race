function hideLink(node: HTMLAnchorElement) {
  node.classList.add("link-hide");
  node.style.color = "black";
}

function disableLink(node: HTMLAnchorElement) {
  node.addEventListener("click", (e) => {
    e.preventDefault();
  });
}

export async function anchorClickListen(callback: (pageTitle: string) => void) {
  const atags = document.querySelectorAll("a");

  for (let node of atags) {
    // node.setAttribute("data-link-remove", node.innerText);
    // node.classList.add(searchHide);
    // node.innerHTML = "";

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

      const tokens = target.href.split("/");
      const pageTitle = tokens.pop();
      if (!pageTitle) {
        return;
      }
      callback(decodeURIComponent(pageTitle));
    });
  }
}
