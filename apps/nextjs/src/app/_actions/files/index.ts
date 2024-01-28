const URL_SEPARATOR = "/";

export const getKey = (url: string) =>
  url
    .replace(/http(s?):\/\//g, "")
    .split(URL_SEPARATOR)
    .slice(1)
    .join(URL_SEPARATOR);
