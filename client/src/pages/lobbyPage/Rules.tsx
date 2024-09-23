import { useState } from "preact/hooks";
import { useRoom } from "../../providers/RoomProvider";
import { center, flex, vstack } from "../../../styled-system/patterns";
import Dialog from "../../components/Dialog";
import { ToggleButton } from "../../components/ToggleButton";
import { useSocket } from "../../providers/SessionProvider";
import Button from "../../components/Button";
import { css } from "../../../styled-system/css";

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
          <p>Exclude groups</p>
          <div class={flex({ wrap: "wrap", gap: 1, width: "100%" })}>
            <ToggleButton
              toggled={room.rules.excludeGroups.includes("countries")}
              onToggled={() => {
                socket.emit("room:rules:excludeGroup", room.id, "countries");
              }}
            >
              Coutries
            </ToggleButton>
            <ToggleButton
              toggled={room.rules.excludeGroups.includes("events")}
              onToggled={() => {
                socket.emit("room:rules:excludeGroup", room.id, "events");
              }}
            >
              Major Events
            </ToggleButton>
            <ToggleButton
              toggled={room.rules.excludeGroups.includes("celebrities")}
              onToggled={() => {
                socket.emit("room:rules:excludeGroup", room.id, "celebrities");
              }}
            >
              Celebrities
            </ToggleButton>
          </div>
          <p>Misc</p>
          <ToggleButton
            toggled={room.rules.excludeGroups.includes("celebrities")}
            onToggled={() => {
              socket.emit("room:rules:excludeGroup", room.id, "celebrities");
            }}
          >
            Disable link search
          </ToggleButton>
          <div class={css({ alignSelf: "center", marginTop: 3 })}>
            <Button onClick={() => setShowRulesDialog(false)}>Close</Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
