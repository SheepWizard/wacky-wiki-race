import { Room } from "../types";

interface EndGamePageProps {
  room: Room;
}

export default function EndGamePage({ room }: EndGamePageProps) {
  const winningUser = room.users.find((x) => x.id === room.winnerUserId);

  const otherUsers = room.users
    .filter((x) => x.id !== room.winnerUserId)
    .map((x) => ({
      userName: x.userName,
      route: x.route,
    }));

  return (
    <div style={{ display: "flex", flexDirection: "column" }} class="min-width">
      <h1>Winner</h1>
      <h1>{winningUser?.userName}</h1>
      <ul>
        {winningUser?.route.map((pageName, index) => (
          <li key={index}>{pageName}</li>
        ))}
      </ul>

      {otherUsers.map((user) => {
        return (
          <>
            <h2>{user.userName}</h2>
            <ul>
              {user.route.map((pageTitle, index) => (
                <li key={index}>{pageTitle}</li>
              ))}
            </ul>
          </>
        );
      })}
    </div>
  );
}
