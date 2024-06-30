import { useEffect, useState } from "preact/hooks";
import { socket } from "../socket";
import { Room } from "../types";
import { getRandomWikiPage } from "../wiki";
import { WikiSearchInput } from "../components/WikiSearchInput";
import GreenBox from "../components/GreenBox";
import Title from "../components/Title";
import Button from "../components/Button";
import { flex, vstack } from "../../styled-system/patterns";
import { css } from "../../styled-system/css";
import NameTag from "../components/NameTag";
import { getUserId } from "../util/sessionHook";
import { useRoom } from "../providers/RoomProvider";

interface LobbyPageProps {
  room: Room;
}

export default function LobbyPage({ room }: LobbyPageProps) {
  const isRoomOwner = room.roomOwnerId === getUserId();
  const [start, setStart] = useState("Cat");
  const [end, setEnd] = useState("Dog");
  const { setRoom } = useRoom();

  useEffect(() => {
    if (!isRoomOwner) {
      return;
    }

    const getRandom = async () => {
      try {
        const randomStartPromise = getRandomWikiPage();

        const randomEndPromise = getRandomWikiPage();
        const results = await Promise.all([
          randomStartPromise,
          randomEndPromise,
        ]);

        setStart(results[0]);
        setEnd(results[1]);
        socket.emit("room:set:start", room.id, results[0]);
        socket.emit("room:set:end", room.id, results[1]);
      } catch {}
    };

    getRandom();
  }, [room.id]);

  useEffect(() => {
    if (!isRoomOwner) {
      return;
    }
    socket.emit("room:set:start", room.id, start);
  }, [start, room.id]);

  useEffect(() => {
    if (!isRoomOwner) {
      return;
    }
    socket.emit("room:set:end", room.id, end);
  }, [end, room.id]);

  const handleStartGame = () => {
    socket.emit("room:play", room.id);
  };

  const handleRoomLeave = () => {
    socket.emit("room:leave");
    setRoom(undefined);
  };

  const handleCopyInvite = async () => {
    await navigator.clipboard.writeText(
      `${window.location.host}/?lobby=${room.id}`
    );
  };

  const startValue = isRoomOwner
    ? start.replaceAll("_", " ")
    : room.start.replaceAll("_", " ");
  const endValue = isRoomOwner
    ? end.replaceAll("_", " ")
    : room.end.replaceAll("_", " ");

  const inputsDisabled = !isRoomOwner;

  return (
    <div
      class={css({
        bg: "ww-yellow",
        h: "lvh",
        overflow: "hidden",
      })}
    >
      <GreenBox>
        <Title />
        <div
          class={vstack({
            gap: 6,
            width: "100%",
          })}
        >
          <div
            class={flex({
              justifyContent: "space-between",
              gap: 4,
              width: "100%",
              alignItems: "center",
              flexWrap: "wrap",
              "& > *": {
                flex: "1 1 250px",
              },
            })}
          >
            <p class={css({ overflowWrap: "anywhere" })}>{room.id}</p>
            <Button onClick={handleCopyInvite}>Invite Friend</Button>
          </div>
          <ul
            class={flex({
              gap: 1,
              width: "100%",
              overflow: "scroll",
              scrollbarWidth: "none",
              justifyContent: "safe center",
            })}
          >
            {room.users.map((user) => (
              <li>
                <NameTag name={user.userName} self={false} />
              </li>
            ))}
          </ul>
          <WikiSearchInput
            labelValue="Start"
            value={startValue}
            onChange={(value) => setStart(value)}
            disabled={inputsDisabled}
          />
        </div>
        <WikiSearchInput
          labelValue="Finish"
          value={endValue}
          onChange={(value) => setEnd(value)}
          disabled={inputsDisabled}
        />

        {isRoomOwner && (
          <Button
            onClick={handleStartGame}
            stretch
          >{`Start game ${room.users.length}/100`}</Button>
        )}
        <Button onClick={handleRoomLeave}>Leave</Button>
      </GreenBox>
    </div>
  );
}
