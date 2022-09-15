import Footer from "components/Footer";
import Header from "components/Header";
import RuleForm, { RuleFormProps } from "components/RuleForm";
import Top from "components/Top";
import { motion } from "framer-motion";
import useParseUrl from "hooks/useParseUrl";
import { useMemo } from "react";
import { useElementSize } from "usehooks-ts";
import styles from "./style.module.scss";

export type InnerSlidesProps = Partial<
  Pick<RuleFormProps, "defaultValues" | "disabledPlayer">
> &
  Pick<RuleFormProps, "onSubmit">;

function InnerSlides({
  defaultValues,
  disabledPlayer,
  onSubmit,
}: InnerSlidesProps): JSX.Element {
  const { url } = useParseUrl();
  const [ref, { width }] = useElementSize();
  const index = useMemo(() => {
    switch (url) {
      case "/": {
        return 0;
      }
      case "/expert":
      case "/party": {
        return 1;
      }
      default: {
        return 1;
      }
    }
  }, [url]);
  const [headerRef, { height: headerHeight }] = useElementSize();
  const [footerRef, { height: footerHeight }] = useElementSize();

  return (
    <div className={styles.wrapper} ref={ref}>
      <div ref={headerRef}>
        <Header />
      </div>
      <main
        className={styles.main}
        style={{ paddingBottom: (headerHeight - footerHeight) / 2 }}
      >
        {width ? (
          <motion.div
            animate={{ x: width * index * -1 }}
            className={styles.inner}
            initial={false}
            style={{ gridTemplateColumns: `repeat(2, ${width}px)` }}
          >
            <div className={styles.item}>
              <Top />
            </div>
            <div className={styles.item}>
              {defaultValues && typeof disabledPlayer === "boolean" ? (
                <RuleForm
                  defaultValues={defaultValues}
                  disabledPlayer={disabledPlayer}
                  onSubmit={onSubmit}
                />
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </main>
      <div ref={footerRef}>
        <Footer />
      </div>
    </div>
  );
}

export default InnerSlides;
