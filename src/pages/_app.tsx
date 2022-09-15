import usePrevious from "@react-hook/previous";
import Layout from "components/Layout";
import useHowl from "hooks/useHowl";
import useParseUrl from "hooks/useParseUrl";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import "rc-slider/assets/index.css";
import { ReactElement, ReactNode, useEffect } from "react";
import "ress";
import "styles/globals.scss";
import "styles/mq-settings.scss";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout): JSX.Element {
  const getLayout = Component.getLayout ?? ((page): ReactNode => page);
  const { url } = useParseUrl();
  const prevUrl = usePrevious(url);
  const clickHowl = useHowl({ src: "/sounds/click.mp3" });

  useEffect(() => {
    if (!prevUrl || url === prevUrl) {
      return;
    }

    clickHowl.play();
  }, [clickHowl, prevUrl, url]);

  return (
    <>
      <Head>
        <meta content="initial-scale=1.0, width=device-width" name="viewport" />
        <link href="/manifest.json" rel="manifest" />
        <link href="/logo192.png" rel="apple-touch-icon" />
      </Head>
      <Layout>{getLayout(<Component {...pageProps} />)}</Layout>
    </>
  );
}

export default MyApp;
