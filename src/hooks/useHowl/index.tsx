import { Howl, HowlOptions } from "howler";
import { useMemo } from "react";

export type HowlParams = Pick<HowlOptions, "src">;

export type HowlData = Howl;

function useHowl({ src }: HowlParams): HowlData {
  const howl = useMemo(
    () =>
      new Howl({
        src,
      }),
    [src]
  );

  return howl;
}

export default useHowl;
