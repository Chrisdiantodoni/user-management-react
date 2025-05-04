import queryString from "query-string";

class QueryStringClass {
  stringified = (
    obj: Record<string, string | number | boolean | null | undefined>
  ): string => {
    // Filter out falsy values
    for (const [key, value] of Object.entries(obj)) {
      if (!value) {
        delete obj[key];
      }
    }
    return queryString.stringify(obj);
  };
}

export default new QueryStringClass();
