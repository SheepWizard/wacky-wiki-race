import { useRef, useState } from "preact/hooks";
import { getFunnyName } from "../util/funnyNames";
import { socket } from "../socket";
import { center, flex } from "../../styled-system/patterns";
import Title from "../components/Title";
import Input from "../components/Input";
import Button from "../components/Button";
import GreenBox from "../components/GreenBox";

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
    <GreenBox>
      <Title />
      <Input
        value={roomCode}
        onChange={setRoomCode}
        labelValue="Friendly name"
        placeholder={ref.current}
        max={20}
      />
      <div
        class={flex({
          justifyContent: "space-between",
          alignItems: "flex-end",
          width: "100%",
          gap: 4,
          flexWrap: "wrap",
          "& > *": {
            flex: "1 1 200px",
          },
        })}
      >
        <Input
          value={userName}
          onChange={setUserName}
          labelValue="Lobby code"
          max={24}
        />
        <Button onClick={handleJoinLobby} disabled={!roomCode} stretch>
          Join lobby
        </Button>
      </div>
      <Button onClick={handleCreateLobby} stretch>
        Create lobby
      </Button>
    </GreenBox>
  );
}
