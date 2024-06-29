import { useEffect, useRef, useState } from "preact/hooks";
import { Room } from "../types";
import { getWikiPage } from "../wiki";
import { socket } from "../socket";
import Timer from "../components/Timer";
import { css } from "../../styled-system/css";
import { center, flex } from "../../styled-system/patterns";

interface RoomPageProps {
  room: Room;
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant",
  });
}

const searchHide = css({
  "&:before": {
    content: "attr(data-text)",
  },
});

export default function GamePage({ room }: RoomPageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [currentWiki, setCurrentWiki] = useState(room.start);
  const [loading, setLoading] = useState(true);
  // add loading and try catch
  // Remove external links
  //Cat–dog relationship doesnt end game
  useEffect(() => {
    const current = ref.current;
    if (!current) {
      return;
    }

    const anchorClickListen = () => {
      const atags = document.querySelectorAll("a");

      for (let node of atags) {
        node.setAttribute("data-text", node.innerText);
        node.classList.add(searchHide);
        node.innerHTML = "";
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
          socket.emit("room:user:route", room.id, pageTitle);
          setCurrentWiki(pageTitle);
        });
      }
    };

    const displayWiki = async () => {
      setLoading(true);
      try {
        const data = await getWikiPage(currentWiki);
        current.innerHTML = data;
      } catch {
        // add a retry button
      } finally {
        scrollToTop();
        anchorClickListen();
        setLoading(false);
      }
    };

    displayWiki();
  }, [currentWiki, room.id]);

  return (
    <div>
      <div
        class={flex({
          height: 28,
          backgroundColor: "ww-yellow",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 5,
          paddingInline: 20,
          marginBottom: 3,
          borderBottom: "solid 2px",
          borderColor: "ww-black",
        })}
      >
        <Timer />
        <div>{room.end.replaceAll("_", " ")}</div>
        <div />
      </div>
      {loading && <div class={center()}>Loading</div>}

      <div
        data-loading={loading}
        class={css({
          width: "min(1200px, 100% - 4em)",
          marginInline: "auto",
          "&[data-loading=true]": {
            display: "none",
          },
        })}
      >
        <h1
          class={css({
            wordBreak: "break-word",
            wordWrap: "break-word",
            fontFamily:
              "Linux Libertine, Georgia, Times, 'Source Serif Pro', serif",
            lineHeight: "1.375",
            fontSize: "1.7em",
            mb: 2,
          })}
        >
          {currentWiki.replaceAll("_", " ")}
        </h1>
        <div
          class="wiki-css"
          style={{ display: loading ? "none" : "block" }}
          ref={ref}
        />
      </div>
    </div>
  );
}
