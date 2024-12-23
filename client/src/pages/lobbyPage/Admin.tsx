import { useState } from "preact/hooks";
import { css } from "../../../styled-system/css";
import { center, vstack } from "../../../styled-system/patterns";
import Button from "../../components/Button";
import Dialog from "../../components/Dialog";
import { ToggleButton } from "../../components/ToggleButton";
import { useRoom } from "../../providers/RoomProvider";
import { useSocket } from "../../providers/SessionProvider";

export default function Admin() {
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const socket = useSocket();
  const { room } = useRoom();

  if (!room) {
    return null;
  }

  return (
    <>
      <Button onClick={() => setShowAdminDialog(!showAdminDialog)}>
        <p>Admin</p>
      </Button>
      <Dialog open={showAdminDialog} onClose={() => setShowAdminDialog(false)}>
        <div class={vstack({ gap: 2, alignItems: "start" })}>
          <div
            class={center({
              bg: "white",
              border: "solid 4px",
              borderColor: "ww-black",
              rounded: "br-12",
              p: 3,
              textAlign: "center",
            })}
          >
            <h3>Admin</h3>
          </div>
          <div class={css({ display: "flex", flexWrap: "wrap", gap: 2 })}>
            <ToggleButton
              toggled={room.adminRules.lockSelect}
              onToggled={() => {
                const updatedRules = {
                  ...room.adminRules,
                  lockSelect: !room.adminRules.lockSelect,
                };
                socket.emit(
                  "room:rules:updateAdminRules",
                  room.id,
                  updatedRules
                );
              }}
            >
              Lock route select
            </ToggleButton>
            <ToggleButton
              toggled={room.adminRules.lockRules}
              onToggled={() => {
                const updatedRules = {
                  ...room.adminRules,
                  lockRules: !room.adminRules.lockRules,
                };
                socket.emit(
                  "room:rules:updateAdminRules",
                  room.id,
                  updatedRules
                );
              }}
            >
              Lock rules select
            </ToggleButton>
            <ToggleButton
              toggled={room.adminRules.lockPause}
              onToggled={() => {
                const updatedRules = {
                  ...room.adminRules,
                  lockPause: !room.adminRules.lockPause,
                };
                socket.emit(
                  "room:rules:updateAdminRules",
                  room.id,
                  updatedRules
                );
              }}
            >
              Lock pause
            </ToggleButton>
            <ToggleButton
              toggled={room.adminRules.lockChat}
              onToggled={() => {
                const updatedRules = {
                  ...room.adminRules,
                  lockChat: !room.adminRules.lockChat,
                };
                socket.emit(
                  "room:rules:updateAdminRules",
                  room.id,
                  updatedRules
                );
              }}
            >
              Disable chat
            </ToggleButton>
          </div>
        </div>
      </Dialog>
    </>
  );
}
