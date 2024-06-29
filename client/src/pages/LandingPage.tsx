import { useRef, useState } from "preact/hooks";
import { getFunnyName } from "../util/funnyNames";
import { socket } from "../socket";
import { flex } from "../../styled-system/patterns";
import Title from "../components/Title";
import Input from "../components/Input";
import Button from "../components/Button";
import GreenBox from "../components/GreenBox";
import { css } from "../../styled-system/css";

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
    <div class={css({ bg: "ww-yellow", h: "lvh", overflow: "hidden" })}>
      <GreenBox>
        <Title />
        <Input
          value={userName}
          onChange={setUserName}
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
            value={roomCode}
            onChange={setRoomCode}
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
    </div>
  );
}
