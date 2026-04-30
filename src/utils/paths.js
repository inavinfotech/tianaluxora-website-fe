const isUnderDevelopment = import.meta.env.VITE_UNDER_DEVELOPMENT === "true";
export const routePrefix = isUnderDevelopment ? "/dev" : "";

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

  // Ensure path starts with /
  let normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // Special case for root
  if (normalizedPath === "/") {
    return routePrefix || "/";
  }

  // Don't prefix if already prefixed
  if (routePrefix && (normalizedPath === routePrefix || normalizedPath.startsWith(`${routePrefix}/`))) {
    return normalizedPath;
  }

  return `${routePrefix}${normalizedPath}`;
};
