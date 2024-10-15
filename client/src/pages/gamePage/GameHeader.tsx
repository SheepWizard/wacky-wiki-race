import { css } from "../../../styled-system/css";
import { flex, hstack, vstack } from "../../../styled-system/patterns";
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
        mdDown: {
          paddingInline: 2,
        },
      })}
    >
      <div class={vstack({ alignItems: "center", gap: 1 })}>
        <h3>Time:</h3>
        <Timer />
      </div>
      <div class={vstack({ alignItems: "center", gap: 1 })}>
        <h3>Article to find:</h3>
        <p>{room.end.title.replaceAll("_", " ")}</p>
      </div>

      <div
        class={css({
          display: "flex",
          gap: 2,
          mdDown: { display: "none", flexDir: "column" },
        })}
      >
        <Button
          onClick={handleSurrender}
        >{`Surrender ${surrenderedCount}/${room.users.length}`}</Button>
        <Button onClick={handleRoomLeave}>Leave</Button>
      </div>
      <div
        class={css({
          display: "flex",
          gap: 2,
          flexDir: "column",
          md: { display: "none" },
        })}
      >
        <Button
          onClick={handleSurrender}
          size="small"
        >{`Surrender ${surrenderedCount}/${room.users.length}`}</Button>
        <Button size="small" onClick={handleRoomLeave}>
          Leave
        </Button>
      </div>
    </div>
  );
}
