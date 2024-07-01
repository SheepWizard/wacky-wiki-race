import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { Room } from "../types";
import { getWikiPage } from "../wiki";
import Timer from "../components/Timer";
import { css } from "../../styled-system/css";
import { center, flex, vstack } from "../../styled-system/patterns";
import Button from "../components/Button";
import { anchorClickListen } from "../util/wikiFormatter";
import { useRoom } from "../providers/RoomProvider";
import { useSocket } from "../providers/SessionProvider";

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
  const socket = useSocket();
  const ref = useRef<HTMLDivElement>(null);
  const [currentWiki, setCurrentWiki] = useState(room.start);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { setRoom } = useRoom();

  const displayWiki = useCallback(async () => {
    const current = ref.current;
    if (!current) {
      return;
    }
    setLoading(true);
    try {
      const data = await getWikiPage(currentWiki);
      current.innerHTML = data;
      await anchorClickListen((pageTitle: string) => {
        socket.emit("room:user:route", room.id, pageTitle);
        setCurrentWiki(pageTitle);
      });
    } catch {
      setError(true);
    } finally {
      scrollToTop();
      setLoading(false);
    }
  }, [currentWiki, room.id]);

  useEffect(() => {
    displayWiki();
  }, [displayWiki]);

  const handleTryAgain = () => {
    setError(false);
    displayWiki();
  };

  const handleRoomLeave = () => {
    socket.emit("room:leave");
    setRoom(undefined);
  };

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
        <Button onClick={handleRoomLeave}>Leave</Button>
      </div>
      {loading && <div class={center()}>Loading</div>}
      {error && (
        <div class={vstack({ gap: 2 })}>
          <p>Something went wrong 😭</p>
          <Button onClick={handleTryAgain}>Try again</Button>
        </div>
      )}
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
            fontFamily: "Helvetica Neue,Helvetica,Arial,sans-serif",
            lineHeight: "1.375",
            fontSize: "1.7em",
            mb: 2,
            paddingInline: "51px",
          })}
        >
          {currentWiki.replaceAll("_", " ")}
        </h1>
        <div
          class="wiki-css lang-en"
          style={{ display: loading ? "none" : "block" }}
        >
          <div class="content">
            <div ref={ref} />
          </div>
        </div>
      </div>
    </div>
  );
}
