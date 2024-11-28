import { css } from "../../../styled-system/css";
import { grid, vstack } from "../../../styled-system/patterns";
import {
  default as Iconbutton,
  default as IconButton,
} from "../../components/IconButton";
import ExitIcon from "../../components/icons/ExitIcon";
import PauseIcon from "../../components/icons/PauseIcon";
import PlayButton from "../../components/icons/PlayButton";
import SurrenderIcon from "../../components/icons/SurrenderIcon";
import Timer from "../../components/Timer";
import { useRoom } from "../../providers/RoomProvider";
import { useSession, useSocket } from "../../providers/SessionProvider";

export default function GameHeader() {
  const { room, setRoom } = useRoom();
  const { isConnected, userId } = useSession();
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

  const userSurrendered = room.users.some(
    (x) => x.id === userId && x.surrendered
  );
  const surrenderedCount = room.users.filter((x) => x.surrendered).length;
  const surrenderLabel = surrenderedCount >= 10 ? "9+" : surrenderedCount;

  return (
    <div
      class={grid({
        height: 28,
        background:
          "linear-gradient(180deg, rgba(224,255,210,1) 0%, rgba(0,212,255,0) 60%);",
        alignItems: "center",
        justifyContent: "center",
        position: "sticky",
        gridTemplateColumns: "auto 1fr auto",
        top: isConnected ? 0 : 10,
        zIndex: 5,
        paddingInline: 8,
        mdDown: {
          paddingInline: 2,
        },
      })}
    >
      <div class={css({ w: "58px" })} />
      <div
        class={vstack({
          gap: 0.5,
          bg: "ww-white",
          borderRadius: "br-12",
          border: "solid 2px",
          borderColor: "ww-black",
          p: 2,
          boxShadow: "ww-mid",
          position: "relative",
          gridColumnStart: 2,
          w: "fit-content",
          justifySelf: "center",
          alignSelf: "self-start",
          marginTop: 5,
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
        <p class={css({ textAlign: "center" })}>
          {room.end.title.replaceAll("_", " ")}
        </p>
        <Timer />
      </div>

      <div
        class={grid({
          gridTemplateRows: "1fr 1fr 1fr",
          gap: 4,
          justifySelf: "end",
          mt: 3,
        })}
      >
        <div
          class={css({
            position: "relative",
            _after: {
              content: '""',
              position: "absolute",
              w: 1,
              left: "calc(50% - 2px)",
              height: 5,
              top: -5,
              bg: "ww-black",
            },
          })}
        >
          <IconButton onClick={handleRoomLeave} colour="red">
            <ExitIcon class={css({ w: 8, h: 8 })} />
          </IconButton>
        </div>
        <div
          class={css({
            position: "relative",
            _after: {
              content: '""',
              position: "absolute",
              w: 1,
              left: "calc(50% - 4px)",
              height: 5,
              top: -5,
              bg: "ww-black",
            },
          })}
        >
          <div
            data-surrender-count={surrenderLabel}
            class={css({
              pos: "relative",
              _after: {
                content: `attr(data-surrender-count)`,
                pos: "absolute",
                borderRadius: "full",
                display: surrenderedCount ? "flex" : "none",
                justifyContent: "center",
                alignItems: "center",
                width: 6,
                height: 6,
                bg: userSurrendered ? "ww-bright-green" : "ww-red",
                left: -1,
                top: -1,
              },
            })}
          >
            <IconButton onClick={handleSurrender} colour="blue">
              <SurrenderIcon class={css({ w: 8, h: 8 })} />
            </IconButton>
          </div>
        </div>
        <div
          class={css({
            position: "relative",
            _after: {
              content: '""',
              position: "absolute",
              w: 1,
              left: "calc(50% - 4px)",
              height: 5,
              top: -5,
              bg: "ww-black",
            },
          })}
        >
          <Iconbutton onClick={handleRoomPause} colour="purple">
            {room.paused ? (
              <PlayButton class={css({ w: 8, h: 8 })} />
            ) : (
              <PauseIcon class={css({ w: 8, h: 8 })} />
            )}
          </Iconbutton>
        </div>
      </div>
    </div>
  );
}
