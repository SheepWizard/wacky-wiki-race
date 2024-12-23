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
      <Button onClick={() => setShowRulesDialog(!showRulesDialog)}>
        <p>Rules</p>
      </Button>
      <Dialog open={showRulesDialog} onClose={() => setShowRulesDialog(false)}>
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
            <h3>Rules</h3>
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
          </div>
          <div class={css({ alignSelf: "center", marginTop: 3 })}>
            <Button onClick={() => setShowRulesDialog(false)}>Close</Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
