import { flex, hstack } from "../../../styled-system/patterns";
import Button from "../../components/Button";
import Timer from "../../components/Timer";
import { useRoom } from "../../providers/RoomProvider";
import { useSocket } from "../../providers/SessionProvider";

export default function GameHeader() {
  const { room, setRoom } = useRoom();
  const socket = useSocket();

  if (!room) {
    return null;
  }

  const handleRoomLeave = () => {
    socket.emit("room:leave");
    setRoom(undefined);
  };

  const handleSurrender = () => {
    socket.emit("room:user:surrender", room.id);
  };

  const surrenderedCount = room.users.filter((x) => x.surrendered).length;

  return (
    <div
      class={flex({
        height: 28,
        backgroundColor: "ww-yellow",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 5,
        paddingInline: 20,
        marginBottom: 3,
        borderBottom: "solid 2px",
        borderColor: "ww-black",
      })}
    >
      <Timer />
      <div>{room.end.title.replaceAll("_", " ")}</div>
      <div class={hstack({ gap: 2 })}>
        <Button
          onClick={handleSurrender}
        >{`Surrender ${surrenderedCount}/${room.users.length}`}</Button>
        <Button onClick={handleRoomLeave}>Leave</Button>
      </div>
    </div>
  );
}
