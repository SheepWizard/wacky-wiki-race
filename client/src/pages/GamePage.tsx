import { useEffect, useRef, useState } from "preact/hooks";
import { Room } from "../types";
import { getWikiPage } from "../wiki";
import { socket } from "../socket";

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

export default function GamePage({ room }: RoomPageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [currentWiki, setCurrentWiki] = useState(room.start);
  // add loading and try catch
  useEffect(() => {
    const current = ref.current;
    if (!current) {
      return;
    }

    const anchorClickListen = () => {
      const atags = document.querySelectorAll("a");

      for (let node of atags) {
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
          socket.emit("room:user:route", room.id, pageTitle);
          setCurrentWiki(pageTitle);
        });
      }
    };

    const displayWiki = async () => {
      const data = await getWikiPage(currentWiki);
      current.innerHTML = data;
      scrollToTop();
      anchorClickListen();
    };

    displayWiki();
  }, [currentWiki]);

  return <div ref={ref}>Game</div>;
}
