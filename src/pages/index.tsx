import CountdownPortal from "components/CountdownPortal";
import OuterSlides, { OuterSlidesProps } from "components/OuterSlides";
import Seo from "components/Seo";
import useParseUrl from "hooks/useParseUrl";
import { useRouter } from "next/router";
import queryString from "query-string";
import random from "random";
import { useCallback, useEffect, useMemo } from "react";
import { useBoolean, useLocalStorage } from "usehooks-ts";

function Pages(): JSX.Element {
  const {
    query: { first: queryFirst, handicaps, player: queryPlayer, time },
    url,
  } = useParseUrl();
  const initialPlayer = useMemo(() => 2, []);
  const [expertDefaultValues, setExpertDefaultValues] = useLocalStorage(
    "expertDefaultValues",
    {
      first: "",
      handicaps: Array(initialPlayer)
        .fill(undefined)
        .map(() => ({ time: "0" })),
      player: initialPlayer,
      time: 60 * 5,
    }
  );
  const [partyDefaultValues, setPartyDefaultValues] = useLocalStorage(
    "partyDefaultValues",
    {
      first: "",
      handicaps: Array(initialPlayer)
        .fill(undefined)
        .map(() => ({ time: "0" })),
      player: initialPlayer,
      time: 60,
    }
  );
  const { defaultValues, disabledPlayer } = useMemo(() => {
    switch (url) {
      case "/expert": {
        return {
          defaultValues: expertDefaultValues,
          disabledPlayer: true,
        };
      }
      case "/party": {
        return {
          defaultValues: partyDefaultValues,
          disabledPlayer: false,
        };
      }
      default: {
        return {};
      }
    }
  }, [expertDefaultValues, partyDefaultValues, url]);
  const router = useRouter();
  const handleSubmit = useCallback<OuterSlidesProps["onSubmit"]>(
    ({ handicaps, ...values }) => {
      switch (url) {
        case "/expert": {
          setExpertDefaultValues({ handicaps, ...values });

          break;
        }
        case "/party": {
          setPartyDefaultValues({ handicaps, ...values });

          break;
        }
      }

      router.push(
        queryString.stringifyUrl(
          {
            query: {
              ...values,
              handicaps: handicaps.map(({ time }) => time),
            },
            url: "/game",
          },
          {
            skipEmptyString: true,
          }
        )
      );
    },
    [router, setExpertDefaultValues, setPartyDefaultValues, url]
  );
  const first = useMemo<OuterSlidesProps["first"]>(() => {
    if (typeof queryPlayer !== "string") {
      return undefined;
    }

    return typeof queryFirst === "string"
      ? parseInt(queryFirst, 10)
      : random.int(0, parseInt(queryPlayer, 10) - 1);
  }, [queryFirst, queryPlayer]);
  const {
    setFalse: offIsStart,
    setTrue: onIsStart,
    value: isStart,
  } = useBoolean(false);
  const players = useMemo<OuterSlidesProps["players"]>(() => {
    if (
      url !== "/game" ||
      !Array.isArray(handicaps) ||
      typeof queryPlayer !== "string" ||
      typeof time !== "string"
    ) {
      return undefined;
    }

    return Array(parseInt(queryPlayer))
      .fill(undefined)
      .map((_, index) => ({
        time:
          // (parseInt(time, 10) + parseInt(handicaps[index] || "0", 10)) * 1000,
          (5 + parseInt(handicaps[index] || "0", 10)) * 1000,
      }));
  }, [handicaps, queryPlayer, time, url]);

  useEffect(() => {
    if (url === "/game") {
      return;
    }

    offIsStart();
  }, [offIsStart, url]);

  return (
    <>
      <Seo />
      <OuterSlides
        defaultValues={defaultValues}
        disabledPlayer={disabledPlayer}
        first={first}
        isStart={isStart}
        onSubmit={handleSubmit}
        players={players}
      />
      {url === "/game" ? <CountdownPortal onHide={onIsStart} /> : null}
    </>
  );
}

export default Pages;
