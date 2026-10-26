const PRIMARY_PRODUCTION_HOST = "www.gleecars.com";
const MOROCCO_PRODUCTION_HOST = "www.gleecars.ma";
const PRIMARY_DEV_HOST = "localhost";
const MOROCCO_DEV_HOST = "ma.localhost";

export function isLocalHostname(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname.endsWith(".localhost");
}

export function isAppHostname(hostname: string): boolean {
  return (
    isLocalHostname(hostname) ||
    hostname === PRIMARY_PRODUCTION_HOST ||
    hostname === "gleecars.com" ||
    hostname === MOROCCO_PRODUCTION_HOST ||
    hostname === "gleecars.ma"
  );
}

export function hostnameForCountry(country: string, currentHostname: string): string {
  const morocco = country === "ma";

  if (isLocalHostname(currentHostname)) {
    return morocco ? MOROCCO_DEV_HOST : PRIMARY_DEV_HOST;
  }

  return morocco ? MOROCCO_PRODUCTION_HOST : PRIMARY_PRODUCTION_HOST;
}

export function homeMarketForHostname(hostname: string): { country: string; city: string } {
  const morocco =
    hostname === MOROCCO_DEV_HOST || hostname === MOROCCO_PRODUCTION_HOST || hostname === "gleecars.ma";

  return morocco ? { country: "ma", city: "casablanca" } : { country: "ae", city: "dubai" };
}

export function originForBrowsing(country: string, current: URL): string {
  const targetHost = hostnameForCountry(country, current.hostname);

  if (isLocalHostname(current.hostname)) {
    const port = current.port ? `:${current.port}` : "";
    return `${current.protocol}//${targetHost}${port}`;
  }

  return `https://${targetHost}`;
}
