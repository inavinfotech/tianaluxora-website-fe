const isUnderDevelopment = import.meta.env.VITE_UNDER_DEVELOPMENT === "true";
export const routePrefix = isUnderDevelopment ? "/dev" : "";

export const getPath = (path) => {
  if (
    path.startsWith("http") ||
    path.startsWith("#") ||
    path.startsWith("mailto:") ||
    path.startsWith("tel:")
  ) {
    return path;
  }

  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // Don't prefix if already prefixed
  if (routePrefix && normalizedPath.startsWith(routePrefix)) {
    return normalizedPath;
  }

  return `${routePrefix}${normalizedPath === "/" ? "" : normalizedPath}`;
};
