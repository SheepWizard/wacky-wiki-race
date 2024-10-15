import { useEffect, useState } from "preact/hooks";

export default function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds((x) => x + 1), 1000);

    return () => clearInterval(id);
  }, []);

  const minutes = Math.floor(seconds / 60);
  const timerSeconds = seconds % 60;
  const sec = timerSeconds < 10 ? `${0}${timerSeconds}` : timerSeconds;

  return <p>{`${minutes}:${sec}`}</p>;
}
