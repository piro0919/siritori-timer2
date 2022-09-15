import useHowl from "hooks/useHowl";
import router from "next/router";
import usePwa from "use-pwa";
import { useLocalStorage } from "usehooks-ts";
import styles from "./style.module.scss";

function Top(): JSX.Element {
  const clickHowl = useHowl({ src: "/sounds/click.mp3" });
  const [isMute, setIsMute] = useLocalStorage("isMute", true);
  const {
    appinstalled,
    canInstallprompt,
    enabledPwa,
    isPwa,
    showInstallPrompt,
  } = usePwa();

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.button}
        onClick={(): void => {
          router.push("/party");
        }}
      >
        パーティルール
      </button>
      <button
        className={styles.button}
        onClick={(): void => {
          router.push("/expert");
        }}
      >
        エキスパートルール
      </button>
      <div className={styles.buttonsWrapper}>
        <button
          className={styles.button}
          onClick={(): void => {
            clickHowl.play();

            Howler.volume(isMute ? 1 : 0);

            setIsMute((prevIsMute) => !prevIsMute);
          }}
        >{`サウンド：${isMute ? "オフ" : "オン"}`}</button>
        {!appinstalled && canInstallprompt && enabledPwa && !isPwa ? (
          <button className={styles.button} onClick={showInstallPrompt}>
            インストール
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default Top;
