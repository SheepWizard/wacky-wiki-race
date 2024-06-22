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
    <div class="landing-page">
      <div class="min-width landing-content">
        <h1 class="bold">Wacky Wiki Race</h1>
        <div>
          <label for="user-name">
            Do you like cheese?
            <input
              name="user-name"
              placeholder={ref.current}
              value={userName}
              onChange={(e) => setUserName(e.currentTarget.value)}
            />
          </label>
        </div>
        <div>
          <input
            placeholder="Lobby code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.currentTarget.value)}
          />
          <button disabled={!roomCode} onClick={handleJoinLobby}>
            Join lobby
          </button>
        </div>
        <button onClick={handleCreateLobby}>Create Lobby</button>
      </div>
    </div>
  );
}
