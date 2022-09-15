import deepcopy from "deepcopy";
import useHowl from "hooks/useHowl";
import { useRouter } from "next/router";
import prettyMilliseconds from "pretty-ms";
import { useEffect, useState } from "react";
import {
  IoIosRefresh,
  IoMdArrowBack,
  IoMdPlay,
  IoMdSquare,
  IoMdUndo,
} from "react-icons/io";
import swal from "sweetalert";
import { useBoolean } from "usehooks-ts";
import styles from "./style.module.scss";

type Player = {
  // millisecond
  time: number;
};

export type GameProps = {
  first: number;
  isStart: boolean;
  players: Player[];
};

function Game({
  first,
  isStart,
  players: initialPlayers,
}: GameProps): JSX.Element {
  const [turn, setTurn] = useState(first);
  const [players, setPlayers] = useState(initialPlayers);
  const router = useRouter();
  const { setTrue: onIsEnd, value: isEnd } = useBoolean(false);
  const { toggle: toggleIsStop, value: isStop } = useBoolean(false);
  const secondHowl = useHowl({
    src: "/sounds/second.mp3",
  });
  const nextHowl = useHowl({
    src: "/sounds/next.mp3",
  });
  const endHowl = useHowl({
    src: "/sounds/end.mp3",
  });
  const clickHowl = useHowl({
    src: "/sounds/click.mp3",
  });
  const [playersHistories, setPlayersHistories] = useState<typeof players[]>(
    []
  );
  const [turnHistories, setTurnHistories] = useState<typeof turn[]>([]);

  useEffect(() => {
    if (!isStart || isStop) {
      return;
    }

    const timer = setInterval(() => {
      if (!players[turn].time) {
        clearInterval(timer);

        if (players.filter(({ time }) => time).length > 1) {
          nextHowl.play();

          const playerIndex = players.findIndex(
            ({ time }, index) => time && index > turn
          );

          setTurn(
            playerIndex > 0
              ? playerIndex
              : players.findIndex(({ time }) => time)
          );
        } else {
          onIsEnd();

          endHowl.play();

          const playerIndex = players.findIndex(({ time }) => time);

          swal({
            icon: "success",
            title: `${playerIndex + 1}P Win!`,
          });
        }

        return;
      }

      setPlayers((prevPlayers) => {
        const players = [...prevPlayers];

        players[turn].time = players[turn].time - 100;

        return players;
      });
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, [endHowl, isStart, isStop, nextHowl, onIsEnd, players, turn]);

  useEffect(() => {
    if (!isStart || isStop) {
      return;
    }

    if (!players[turn].time.toString().endsWith("000")) {
      return;
    }

    secondHowl.play();
  }, [isStart, isStop, players, secondHowl, turn]);

  useEffect(() => {
    if (isStop) {
      return;
    }

    setPlayersHistories((prevPlayersHostories) => [
      ...prevPlayersHostories,
      deepcopy(players),
    ]);

    setTurnHistories((prevTurnHistories) => [...prevTurnHistories, turn]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStop, turn]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <ul className={styles.list}>
          {players.map(({ time }, index) => (
            <li className={styles.item} key={index}>
              <button
                className={styles.button}
                disabled={isEnd || !isStart || isStop || turn !== index}
                onClick={(): void => {
                  const playerIndex = players.findIndex(
                    ({ time }, index) => time && index > turn
                  );

                  setTurn(
                    playerIndex > 0
                      ? playerIndex
                      : players.findIndex(({ time }) => time)
                  );
                }}
              >
                <span className={styles.player}>{`${index + 1}P`}</span>
                {!isEnd && isStart && turn === index ? (
                  <span className={styles.status}>
                    {isStop ? (
                      <IoMdSquare color="#f00" size={24} />
                    ) : (
                      <IoMdPlay color="#f00" size={24} />
                    )}
                  </span>
                ) : null}
                <span className={styles.time}>
                  {prettyMilliseconds(time, {
                    colonNotation: true,
                    keepDecimalsOnWholeSeconds: true,
                  })}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className={styles.buttonsWrapper}>
          <button
            className={styles.button2}
            disabled={isEnd || !isStart}
            onClick={(): void => {
              if (isStop) {
                setPlayersHistories((prevPlayersHostories) => [
                  ...prevPlayersHostories,
                  deepcopy(players),
                ]);

                setTurnHistories((prevTurnHistories) => [
                  ...prevTurnHistories,
                  turn,
                ]);
              }

              toggleIsStop();
            }}
          >
            {isStop ? (
              <IoMdPlay color="#fff" size={24} />
            ) : (
              <IoMdSquare color="#fff" size={24} />
            )}
          </button>
          <button
            className={styles.button2}
            disabled={
              !isStop || !turnHistories.length || !playersHistories.length
            }
            onClick={(): void => {
              clickHowl.play();

              const prevTurn = turnHistories[turnHistories.length - 1];
              const prevPlayers = playersHistories[playersHistories.length - 1];

              setTurn(prevTurn);
              setPlayers(prevPlayers);

              setTurnHistories((prevTurnHistories) =>
                prevTurnHistories.filter(
                  (_, index) => prevTurnHistories.length - 1 !== index
                )
              );
              setPlayersHistories((prevPlayersHistories) =>
                prevPlayersHistories.filter(
                  (_, index) => prevPlayersHistories.length - 1 !== index
                )
              );
            }}
          >
            <IoMdUndo color="#fff" size={24} />
          </button>
          <button
            className={styles.button2}
            disabled={!isEnd && !isStop}
            onClick={router.back}
          >
            <IoMdArrowBack color="#fff" size={24} />
          </button>
          <button
            className={styles.button2}
            disabled={!isEnd && !isStop}
            onClick={router.reload}
          >
            <IoIosRefresh color="#fff" size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Game;
