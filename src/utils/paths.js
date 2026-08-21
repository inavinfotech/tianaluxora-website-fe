export const routePrefix = "";

export const getPath = (path) => {
  if (
    !path ||
    path.startsWith("http") ||
    path.startsWith("#") ||
    path.startsWith("mailto:") ||
    path.startsWith("tel:")
  ) {
    return path;
  }

  return path.startsWith("/") ? path : `/${path}`;
};

