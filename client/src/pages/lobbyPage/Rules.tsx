import { useState } from "preact/hooks";
import { css } from "../../../styled-system/css";
import { center, vstack } from "../../../styled-system/patterns";
import Button from "../../components/Button";
import Dialog from "../../components/Dialog";
import { ToggleButton } from "../../components/ToggleButton";
import { useRoom } from "../../providers/RoomProvider";
import { useSocket } from "../../providers/SessionProvider";

export default function Rules() {
  const [showRulesDialog, setShowRulesDialog] = useState(false);
  const socket = useSocket();
  const { room } = useRoom();

  if (!room) {
    return null;
  }

  return (
    <>
      <div
        class={center({
          paddingInline: 4,
          paddingBlock: 2,
          border: "solid 3px",
          rounded: "br-12",
          cursor: "pointer",
          borderColor: "ww-black",
          bg: "ww-purple",
          alignSelf: "start",
        })}
        onClick={() => setShowRulesDialog(!showRulesDialog)}
      >
        <p>Rules</p>
      </div>
      <Dialog open={showRulesDialog} onClose={() => setShowRulesDialog(false)}>
        <div class={vstack({ gap: 2, alignItems: "start" })}>
          <div
            class={center({
              paddingInline: 4,
              paddingBlock: 2,
              border: "solid 3px",
              rounded: "br-12",
              borderColor: "ww-black",
              bg: "ww-purple",
            })}
          >
            <p>Rules</p>
          </div>
          <div class={css({ display: "flex", flexWrap: "wrap", gap: 2 })}>
            <ToggleButton
              toggled={room.rules.noPageSearch}
              onToggled={() => {
                const updatedRules = {
                  ...room.rules,
                  noPageSearch: !room.rules.noPageSearch,
                };
                socket.emit("room:rules:updateRules", room.id, updatedRules);
              }}
            >
              Disable link search
            </ToggleButton>
            <ToggleButton
              toggled={room.rules.noNavBox}
              onToggled={() => {
                const updatedRules = {
                  ...room.rules,
                  noNavBox: !room.rules.noNavBox,
                };
                socket.emit("room:rules:updateRules", room.id, updatedRules);
              }}
            >
              Disable nav boxes
            </ToggleButton>
            <ToggleButton
              toggled={room.rules.disableChat}
              onToggled={() => {
                const updatedRules = {
                  ...room.rules,
                  disableChat: !room.rules.disableChat,
                };
                socket.emit("room:rules:updateRules", room.id, updatedRules);
              }}
            >
              Disable chat
            </ToggleButton>
          </div>
          <div class={css({ alignSelf: "center", marginTop: 3 })}>
            <Button onClick={() => setShowRulesDialog(false)}>Close</Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
