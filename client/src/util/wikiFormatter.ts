export function anchorClickListen(callback: (pageTitle: string) => void) {
  const atags = document.querySelectorAll("a");

  for (let node of atags) {
    // node.setAttribute("data-text", node.innerText);
    // node.classList.add(searchHide);
    // node.innerHTML = "";
    node.addEventListener("click", async (e) => {
      e.preventDefault();
      const target = e.target;
      if (!target) {
        return;
      }
      if (!(target instanceof HTMLAnchorElement)) {
        return;
      }
      if (!target.href.includes("/wiki/")) {
        const span = document.createElement("span");
        span.innerHTML = target.innerHTML;
        try {
          //find better solution
          target.replaceWith(span);
        } catch {}
        return;
      }

      const tokens = target.href.split("/");
      const pageTitle = tokens.pop();
      if (!pageTitle) {
        return;
      }
      callback(decodeURI(pageTitle));
    });
  }
}
