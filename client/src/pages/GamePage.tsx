import { useEffect, useRef, useState } from "preact/hooks";
import { Room } from "../types";
import { getWikiPage } from "../wiki";
import { socket } from "../socket";
import Timer from "../components/Timer";
import { css } from "../../styled-system/css";

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
      const data = await getWikiPage(currentWiki);
      current.innerHTML = data;
      scrollToTop();
      anchorClickListen();
      setLoading(false);
    };

    displayWiki();
  }, [currentWiki, room.id]);

  return (
    <div>
      <div
        style={{
          height: 60,
          backgroundColor: "lightblue",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 5,
          paddingInline: 20,
          marginBottom: 30,
          boxShadow: "0px 10px 92px -15px rgba(0,0,0,0.75)",
        }}
      >
        <Timer />
        <div>{room.end.replaceAll("_", " ")}</div>
        <div />
      </div>
      {loading && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Loading
        </div>
      )}
      <div
        class="min-width"
        style={{ display: loading ? "none" : "block" }}
        ref={ref}
      />
    </div>
  );
}
