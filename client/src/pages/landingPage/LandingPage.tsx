import { useRef, useState } from "preact/hooks";
import { css } from "../../../styled-system/css";
import { flex } from "../../../styled-system/patterns";
import Button from "../../components/Button";
import GreenBox from "../../components/GreenBox";
import Input from "../../components/Input";
import Title from "../../components/Title";
import { useSocket } from "../../providers/SessionProvider";
import { getFunnyName } from "../../util/funnyNames";

export default function LandingPage() {
  const socket = useSocket();
  const ref = useRef(getFunnyName());
  const [userName, setUserName] = useState("");
  const [roomCode, setRoomCode] = useState(() => {
    const windowUrl = window.location.search;
    const params = new URLSearchParams(windowUrl);
    return params.get("lobby") ?? "";
  });

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

  const lobbyButtonDisabled = !roomCode;

  return (
    <div class={css({ bg: "ww-primary-10", h: "lvh", overflow: "hidden" })}>
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
          <Button
            onClick={handleJoinLobby}
            disabled={lobbyButtonDisabled}
            stretch
          >
            Join lobby
          </Button>
        </div>
        <Button style="secondary" onClick={handleCreateLobby} stretch>
          Create lobby
        </Button>
      </GreenBox>
    </div>
  );
}
