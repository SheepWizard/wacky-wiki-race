import { useEffect, useState } from "preact/hooks";
import { WikiSearchInput } from "../../components/WikiSearchInput";
import { useRoom } from "../../providers/RoomProvider";
import { useSocket } from "../../providers/SessionProvider";
import { wikiApiGetExtract } from "../../wiki";
import { vstack } from "../../../styled-system/patterns";
import { css } from "../../../styled-system/css";
import { WikiPage } from "../../types";

export default function RouteSelect() {
  const { room } = useRoom();
  const socket = useSocket();
  const [startExtract, setStartExtract] = useState("");
  const [endExtract, setEndExtract] = useState("");

  if (!room) {
    return null;
  }

  const handleSetStart = (value: WikiPage) => {
    socket.emit("room:set:start", room.id, value);
  };

  const handleSetEnd = (value: WikiPage) => {
    socket.emit("room:set:end", room.id, value);
  };

  const startTitle = room.start.title.replaceAll("_", " ");
  const endTitle = room.end.title.replaceAll("_", " ");
  const startId = room.start.pageId;
  const endId = room.end.pageId;

  useEffect(() => {
    const getStartExtract = async () => {
      try {
        const extract = await wikiApiGetExtract(startId);
        setStartExtract(extract);
      } catch {
        setStartExtract("");
      }
    };
    getStartExtract();
  }, [startId]);

  useEffect(() => {
    const getEndExtract = async () => {
      try {
        const extract = await wikiApiGetExtract(endId);
        setEndExtract(extract);
      } catch {
        setEndExtract("");
      }
    };
    getEndExtract();
  }, [endId]);

  return (
    <>
      <div className={vstack({ gap: 1, w: "full" })}>
        <WikiSearchInput
          labelValue="Start"
          value={startTitle}
          onChange={handleSetStart}
          // disabled={inputsDisabled}
        />
        <div className={css({ color: "ww-grey-dark" })}>{startExtract}</div>
      </div>
      <div className={vstack({ gap: 1, w: "full" })}>
        <WikiSearchInput
          labelValue="Finish"
          value={endTitle}
          onChange={handleSetEnd}
          // disabled={inputsDisabled}
        />
        <div className={css({ color: "ww-grey-dark" })}>{endExtract}</div>
      </div>
    </>
  );
}
