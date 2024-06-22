import { useRef, useState } from "preact/hooks";
import { getFunnyName } from "../util/funnyNames";
import { socket } from "../socket";

export default function LandingPage() {
  const ref = useRef(getFunnyName());
  const [userName, setUserName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const handleCreateLobby = () => {
    const name = userName ? userName : ref.current;
    socket.emit("room:create", name);
  };

  const handleJoinLobby = () => {
    if (!roomCode) {
      return;
    }
    const name = userName ? userName : ref.current;
    socket.emit("room:join", roomCode, name);
  };

  return (
    <div>
      <input
        placeholder={ref.current}
        value={userName}
        onChange={(e) => setUserName(e.currentTarget.value)}
      />
      <button onClick={handleCreateLobby}>Create Lobby</button>
      <input
        placeholder="Lobby code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.currentTarget.value)}
      />
      <button disabled={!roomCode} onClick={handleJoinLobby}>
        Join lobby
      </button>
    </div>
  );
}
