import { css } from "../../../styled-system/css";
import { flex } from "../../../styled-system/patterns";
import Button from "../../components/Button";
import { useRoom } from "../../providers/RoomProvider";

export default function FriendInvite() {
  const { room } = useRoom();

  if (!room) {
    return null;
  }

  const handleCopyInvite = async () => {
    await navigator.clipboard.writeText(
      `https://${window.location.host}/?lobby=${room.id}`
    );
  };

  return (
    <div
      class={flex({
        justifyContent: "space-between",
        gap: 4,
        width: "100%",
        alignItems: "center",
        flexWrap: "wrap",
        "& > *": {
          flex: "1 1 250px",
        },
      })}
    >
      <p class={css({ overflowWrap: "anywhere" })}>{room.id}</p>
      <Button onClick={handleCopyInvite}>Invite Friend</Button>
    </div>
  );
}
