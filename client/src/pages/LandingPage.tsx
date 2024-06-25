import { useRef, useState } from "preact/hooks";
import { getFunnyName } from "../util/funnyNames";
import { socket } from "../socket";
import { center, flex } from "../../styled-system/patterns";
import Title from "../components/Title";
import Input from "../components/Input";
import Button from "../components/Button";

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
    <div
      class={center({
        width: "min(800px, 100% - 16px)",
        marginInline: "auto",
        height: "100%",
      })}
    >
      <div
        class={center({
          bg: "ww-green",
          rounded: "br-12",
          border: "solid 2px",
          borderColor: "ww-black",
          flexGrow: 1,
          flexDir: "column",
          gap: 12, // change me
          shadow: "ww-thicc",
          paddingX: 4,
          paddingY: 8,
        })}
      >
        <Title />
        <Input
          value={roomCode}
          onChange={setRoomCode}
          labelValue="Lobby code"
          placeholder={ref.current}
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
          />
          <Button onClick={handleJoinLobby} disabled={!roomCode} stretch>
            Join lobby
          </Button>
        </div>
        <Button onClick={handleCreateLobby} stretch>
          Create lobby
        </Button>
      </div>
    </div>
  );
}
