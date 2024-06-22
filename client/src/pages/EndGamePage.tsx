import { Room } from "../types";

interface EndGamePageProps {
  room: Room;
}

export default function EndGamePage({ room }: EndGamePageProps) {
  return (
    <div>
      {room.winnerUserId}
      {room.users.map((u) => u.route.map((r) => r))}
    </div>
  );
}
