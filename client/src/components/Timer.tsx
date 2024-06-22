import { useEffect, useState } from "preact/hooks";

export default function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds((x) => x + 1), 1000);

    return () => clearInterval(id);
  }, []);

  const minutes = Math.floor(seconds / 60);

  return <div>{`${minutes}:${seconds % 60}`}</div>;
}
