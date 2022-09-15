import Game, { GameProps } from "components/Game";
import InnerSlides, { InnerSlidesProps } from "components/InnerSlides";
import { motion } from "framer-motion";
import useParseUrl from "hooks/useParseUrl";
import { Fragment, useMemo } from "react";
import { useWindowSize } from "usehooks-ts";
import styles from "./style.module.scss";

export type OuterSlidesProps = Pick<
  InnerSlidesProps,
  "defaultValues" | "disabledPlayer" | "onSubmit"
> &
  Partial<Pick<GameProps, "first" | "players">> &
  Pick<GameProps, "isStart">;

function OuterSlides({
  defaultValues,
  disabledPlayer,
  first,
  isStart,
  onSubmit,
  players,
}: OuterSlidesProps): JSX.Element {
  const { url } = useParseUrl();
  const { height, width } = useWindowSize();
  const index = useMemo(() => (url === "/game" ? 1 : 0), [url]);

  return width ? (
    <motion.div
      animate={{ x: width * index * -1 }}
      className={styles.wrapper}
      initial={false}
      style={{ gridTemplateColumns: `repeat(2, ${width}px)` }}
    >
      <div className={styles.item}>
        <div className={styles.inner} style={{ minHeight: height }}>
          <InnerSlides
            defaultValues={defaultValues}
            disabledPlayer={disabledPlayer}
            onSubmit={onSubmit}
          />
        </div>
      </div>
      {typeof first === "number" && players ? (
        <Game first={first} isStart={isStart} players={players} />
      ) : null}
    </motion.div>
  ) : (
    <Fragment />
  );
}

export default OuterSlides;
