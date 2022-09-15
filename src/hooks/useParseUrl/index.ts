import { useRouter } from "next/router";
import queryString from "query-string";
import { useMemo } from "react";

export type ParseUrlData = queryString.ParsedUrl;

function useParseUrl(): ParseUrlData {
  const { asPath } = useRouter();
  const parseUrl = useMemo(() => queryString.parseUrl(asPath), [asPath]);

  return parseUrl;
}

export default useParseUrl;
