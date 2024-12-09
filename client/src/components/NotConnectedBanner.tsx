import { useEffect, useState } from "preact/hooks";
import { center } from "../../styled-system/patterns";
import { useSession } from "../providers/SessionProvider";

export default function NotConnectedBanner() {
  const { isConnected } = useSession();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (isConnected) {
      setShowBanner(false);
      return;
    }
    const timeout = setTimeout(() => {
      if (!isConnected) {
        setShowBanner(true);
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [isConnected]);

  if (!showBanner) {
    return null;
  }

  return (
    <div
      class={center({
        h: 10,
        bg: "ww-primary-30",
        w: "full",
        position: "fixed",
        top: 0,
        zIndex: 10,
      })}
    >
      Not connected
    </div>
  );
}
