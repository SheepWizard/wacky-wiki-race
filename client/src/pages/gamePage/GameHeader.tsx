import { css } from "../../../styled-system/css";
import { flex, vstack } from "../../../styled-system/patterns";
import Button from "../../components/Button";
import {
  default as IconButton,
  default as Iconbutton,
} from "../../components/IconButton";
import ExitIcon from "../../components/icons/ExitIcon";
import PauseIcon from "../../components/icons/PauseIcon";
import PlayButton from "../../components/icons/PlayButton";
import Timer from "../../components/Timer";
import { useRoom } from "../../providers/RoomProvider";
import { useSession, useSocket } from "../../providers/SessionProvider";

export default function GameHeader() {
  const { room, setRoom } = useRoom();
  const { isConnected } = useSession();
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

  const handleRoomPause = () => {
    socket.emit("room:pause", room.id);
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
        top: isConnected ? 0 : 10,
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
      <Iconbutton onClick={handleRoomPause}>
        {room.paused ? (
          <PlayButton class={css({ w: 8, h: 8 })} />
        ) : (
          <PauseIcon class={css({ w: 8, h: 8 })} />
        )}
      </Iconbutton>
      <div
        class={vstack({
          gap: 0.5,
          bg: "ww-white",
          borderRadius: "br-25",
          border: "solid 2px",
          borderColor: "ww-black",
          p: 2,
          boxShadow: "ww-mid",
          position: "relative",
          _after: {
            content: '""',
            position: "absolute",
            w: 1,
            left: "10%",
            height: 10,
            top: -10,
            bg: "ww-black",
          },
          _before: {
            content: '""',
            position: "absolute",
            w: 1,
            left: "90%",
            height: 10,
            top: -10,
            bg: "ww-black",
          },
        })}
      >
        <p>{room.end.title.replaceAll("_", " ")}</p>
        <Timer />
      </div>

      <div
        class={css({
          display: "flex",
          gap: 2,
          mdDown: { display: "none", flexDir: "column" },
        })}
      >
        <Button
          style="secondary"
          onClick={handleSurrender}
        >{`Surrender ${surrenderedCount}/${room.users.length}`}</Button>

        <IconButton onClick={handleRoomLeave}>
          <ExitIcon class={css({ w: 8, h: 8 })} />
        </IconButton>
      </div>
    </div>
  );
}
