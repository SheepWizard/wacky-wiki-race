import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { css } from "../../../styled-system/css";
import { center, vstack } from "../../../styled-system/patterns";
import Button from "../../components/Button";
import { useRoom } from "../../providers/RoomProvider";
import { useSocket } from "../../providers/SessionProvider";
import { anchorClickListen } from "../../util/wikiFormatter";
import { wikiApiGetPage, wikiApiGetPageIdFromTitle } from "../../wiki";
import GameHeader from "./GameHeader";

function scrollToTop() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant",
  });
}

export default function GamePage() {
  const socket = useSocket();
  const ref = useRef<HTMLDivElement>(null);
  const { room } = useRoom();

  if (!room) {
    return null;
  }

  const [currentWiki, setCurrentWiki] = useState(room.start);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const displayWiki = useCallback(async () => {
    const current = ref.current;
    if (!current) {
      return;
    }
    setLoading(true);
    try {
      const parse = await wikiApiGetPage(currentWiki.pageId);
      current.innerHTML = parse;
      await anchorClickListen(room.rules, async (pageTitle: string) => {
        // add try catch

        const linkPageId = await wikiApiGetPageIdFromTitle(pageTitle);

        socket.emit("room:user:route", room.id, {
          pageId: linkPageId,
          title: pageTitle,
        });
        setCurrentWiki({
          pageId: linkPageId,
          title: pageTitle,
        });
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

  return (
    <>
      <div>
        <GameHeader />
        {loading && <div class={center()}>Loading</div>}
        {error && (
          <div class={vstack({ gap: 2 })}>
            <p>Something went wrong 😭</p>
            <Button onClick={handleTryAgain}>Try again</Button>
          </div>
        )}
        {room.paused && (
          <div class={center({})}>
            <p>Game paused</p>
          </div>
        )}
        <div
          data-loading={loading}
          data-paused={room.paused}
          class={css({
            width: "min(1200px, 100% - 4em)",
            marginInline: "auto",
            "&[data-loading=true]": {
              display: "none",
            },
            "&[data-paused=true]": {
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
            })}
          >
            {currentWiki.title.replaceAll("_", " ")}
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
    </>
  );
}
