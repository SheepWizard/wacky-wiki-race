import { socket } from "../socket";
import { Room } from "../types";

interface LobbyPageProps {
  room: Room;
}

export default function LobbyPage({ room }: LobbyPageProps) {
  const isRoomOwner = room.roomOwnerId === socket.id;

  const handleStartGame = () => {
    socket.emit("room:play", room.id);
  };

  return (
    <div>
      <div>{room.id}</div>
      {room.users.map((user) => user.userName)}
      {isRoomOwner && (
        <button
          onClick={handleStartGame}
        >{`Start game ${room.users.length}/100`}</button>
      )}
    </div>
  );
}
