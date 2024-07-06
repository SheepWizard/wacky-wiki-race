import { flex } from "../../../styled-system/patterns";
import NameTag from "../../components/NameTag";
import { useRoom } from "../../providers/RoomProvider";
import { useSession } from "../../providers/SessionProvider";

export default function UserList() {
  const { room } = useRoom();
  const { userId } = useSession();

  if (!room) {
    return null;
  }

  return (
    <ul
      class={flex({
        gap: 1,
        width: "100%",
        overflow: "scroll",
        scrollbarWidth: "none",
        justifyContent: "safe center",
      })}
    >
      {room.users.map((user) => (
        <li>
          <NameTag
            name={user.userName}
            self={user.id === userId}
            ready={user.ready}
          />
        </li>
      ))}
    </ul>
  );
}
