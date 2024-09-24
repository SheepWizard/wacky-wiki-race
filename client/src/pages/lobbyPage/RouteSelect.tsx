import { useEffect, useState } from "preact/hooks";
import { WikiSearchInput } from "../../components/WikiSearchInput";
import { useRoom } from "../../providers/RoomProvider";
import { useSocket } from "../../providers/SessionProvider";
import { wikiApiGetExtract } from "../../wiki";
import { vstack } from "../../../styled-system/patterns";
import { css } from "../../../styled-system/css";

export default function RouteSelect() {
  const { room } = useRoom();
  const socket = useSocket();
  const [startExtract, setStartExtract] = useState("");
  const [endExtract, setEndExtract] = useState("");

  if (!room) {
    return null;
  }

  const handleSetStart = (value: string) => {
    socket.emit("room:set:start", room.id, value);
  };

  const handleSetEnd = (value: string) => {
    socket.emit("room:set:end", room.id, value);
  };

  const startValue = room.start.replaceAll("_", " ");
  const endValue = room.end.replaceAll("_", " ");

  useEffect(() => {
    const getStartExtract = async () => {
      try {
        const extract = await wikiApiGetExtract(startValue);
        setStartExtract(extract);
      } catch {
        setStartExtract("");
      }
    };
    getStartExtract();
  }, [startValue]);

  useEffect(() => {
    const getEndExtract = async () => {
      try {
        const extract = await wikiApiGetExtract(endValue);
        setEndExtract(extract);
      } catch {
        setEndExtract("");
      }
    };
    getEndExtract();
  }, [endValue]);

  return (
    <>
      <div className={vstack({ gap: 1, w: "full" })}>
        <WikiSearchInput
          labelValue="Start"
          value={startValue}
          onChange={handleSetStart}
          // disabled={inputsDisabled}
        />
        <div className={css({ color: "ww-grey-dark" })}>{startExtract}</div>
      </div>
      <div className={vstack({ gap: 1, w: "full" })}>
        <WikiSearchInput
          labelValue="Finish"
          value={endValue}
          onChange={handleSetEnd}
          // disabled={inputsDisabled}
        />
        <div className={css({ color: "ww-grey-dark" })}>{endExtract}</div>
      </div>
    </>
  );
}
