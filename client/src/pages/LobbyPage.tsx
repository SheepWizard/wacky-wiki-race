import { useEffect, useState } from "preact/hooks";
import { Room } from "../types";
import { getRandomWikiPage } from "../wiki";
import { WikiSearchInput } from "../components/WikiSearchInput";
import GreenBox from "../components/GreenBox";
import Title from "../components/Title";
import Button from "../components/Button";
import { flex, hstack, vstack } from "../../styled-system/patterns";
import { css } from "../../styled-system/css";
import NameTag from "../components/NameTag";
import { useRoom } from "../providers/RoomProvider";
import { useSession, useSocket } from "../providers/SessionProvider";

interface LobbyPageProps {
  room: Room;
}

export default function LobbyPage({ room }: LobbyPageProps) {
  const { userId } = useSession();
  const socket = useSocket();
  const { setRoom } = useRoom();
  const isRoomOwner = room.roomOwnerId === userId;

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

        socket.emit("room:set:start", room.id, results[0]);
        socket.emit("room:set:end", room.id, results[1]);
      } catch {}
    };

    getRandom();
  }, [room.id]);

  const handleSetStart = (value: string) => {
    socket.emit("room:set:start", room.id, value);
  };

  const handleSetEnd = (value: string) => {
    socket.emit("room:set:end", room.id, value);
  };

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

  const handleReadyUp = () => {
    socket.emit("room:user:readyUp", room.id);
  };

  const startValue = room.start.replaceAll("_", " ");
  const endValue = room.end.replaceAll("_", " ");

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
                <NameTag
                  name={user.userName}
                  self={user.id === userId}
                  ready={user.ready}
                />
              </li>
            ))}
          </ul>
          <WikiSearchInput
            labelValue="Start"
            value={startValue}
            onChange={handleSetStart}
            // disabled={inputsDisabled}
          />
        </div>
        <WikiSearchInput
          labelValue="Finish"
          value={endValue}
          onChange={handleSetEnd}
          // disabled={inputsDisabled}
        />

        {isRoomOwner && (
          <Button
            onClick={handleStartGame}
            stretch
          >{`Start game ${room.users.length}/100`}</Button>
        )}
        <div class={hstack({ gap: 8, alignItems: "center" })}>
          <Button onClick={handleReadyUp}>Ready Up</Button>
          <Button onClick={handleRoomLeave}>Leave</Button>
        </div>
      </GreenBox>
    </div>
  );
}
