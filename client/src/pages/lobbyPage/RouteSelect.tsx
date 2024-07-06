import { WikiSearchInput } from "../../components/WikiSearchInput";
import { useRoom } from "../../providers/RoomProvider";
import { useSocket } from "../../providers/SessionProvider";

export default function RouteSelect() {
  const { room } = useRoom();
  const socket = useSocket();

  if (!room) {
    return null;
  }

  const handleSetStart = (value: string) => {
    socket.emit("room:set:start", room.id, value);
  };

  const handleSetEnd = (value: string) => {
    socket.emit("room:set:end", room.id, value);
  };

  const startValue = room.start.replaceAll("_", " ");
  const endValue = room.end.replaceAll("_", " ");

  return (
    <>
      <WikiSearchInput
        labelValue="Start"
        value={startValue}
        onChange={handleSetStart}
        // disabled={inputsDisabled}
      />
      <WikiSearchInput
        labelValue="Finish"
        value={endValue}
        onChange={handleSetEnd}
        // disabled={inputsDisabled}
      />
    </>
  );
}
