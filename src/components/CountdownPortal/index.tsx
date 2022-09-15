import useHowl from "hooks/useHowl";
import { useEffect } from "react";
import usePortal, { Args } from "react-cool-portal";
import { useBoolean, useCountdown, useWindowSize } from "usehooks-ts";
import styles from "./style.module.scss";

export type CountdownPortalProps = Pick<Args, "onHide">;

function CountdownPortal({ onHide }: CountdownPortalProps): JSX.Element {
  const { Portal, hide } = usePortal({
    onHide,
    defaultShow: true,
  });
  const { setTrue: onIsStartCountdown, value: isStartCountdown } =
    useBoolean(false);
  const [count, { startCountdown }] = useCountdown({
    countStart: 3,
    countStop: 0,
    intervalMs: 1000,
    isIncrement: false,
  });
  const countHowl = useHowl({
    src: "/sounds/count.mp3",
  });
  const startHowl = useHowl({
    src: "/sounds/start.mp3",
  });
  const { height, width } = useWindowSize();

  useEffect(() => {
    if (!isStartCountdown) {
      return;
    }

    switch (count) {
      case 0: {
        startHowl.play();

        hide();

        break;
      }
      case 1:
      case 2:
      case 3: {
        countHowl.play();

        break;
      }
    }
  }, [count, countHowl, hide, isStartCountdown, startHowl]);

  return (
    <Portal>
      <div
        className={styles.wrapper}
        onClick={(): void => {
          if (isStartCountdown) {
            return;
          }

          onIsStartCountdown();
          startCountdown();
        }}
        style={{ height, width }}
      >
        <div className={styles.text}>
          {isStartCountdown ? count : "Touch Start !"}
        </div>
      </div>
    </Portal>
  );
}

export default CountdownPortal;
