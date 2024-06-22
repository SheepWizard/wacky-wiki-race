import { useEffect, useState } from "preact/hooks";
import { socket } from "../socket";
import { Room } from "../types";
import { getRandomWikiPage } from "../wiki";
import { WikiSearchInput } from "../components/WikiSearchInput";

interface LobbyPageProps {
  room: Room;
}

export default function LobbyPage({ room }: LobbyPageProps) {
  const isRoomOwner = room.roomOwnerId === socket.id;
  const [start, setStart] = useState("Cat");
  const [end, setEnd] = useState("Dog");

  useEffect(() => {
    if (!isRoomOwner) {
      return;
    }

    const getRandom = async () => {
      //add try catch
      const randomStartPromise = getRandomWikiPage();
      const randomEndPromise = getRandomWikiPage();

      const results = await Promise.all([randomStartPromise, randomEndPromise]);

      setStart(results[0]);
      setEnd(results[1]);
      socket.emit("room:set:start", room.id, results[0]);
      socket.emit("room:set:end", room.id, results[1]);
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

  const startValue = isRoomOwner
    ? start.replaceAll("_", " ")
    : room.start.replaceAll("_", " ");
  const endValue = isRoomOwner
    ? end.replaceAll("_", " ")
    : room.end.replaceAll("_", " ");

  return (
    <div>
      <div>{room.id}</div>
      <WikiSearchInput
        value={startValue}
        onChange={(value) => setStart(value)}
      />
      <WikiSearchInput value={endValue} onChange={(value) => setEnd(value)} />
      {room.users.map((user) => user.userName)}

      {isRoomOwner && (
        <button
          onClick={handleStartGame}
        >{`Start game ${room.users.length}/100`}</button>
      )}
    </div>
  );
}
