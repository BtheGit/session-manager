export function clampSessionExpiration(
  sessionLengthInMilliseconds: number
): Date {
  const defaultSessionExpiration = new Date(
    Date.now() + sessionLengthInMilliseconds
  );
  const maximumAllowedExpiration = new Date(
    new Date().setHours(23, 59, 59, 999)
  );
  return new Date(
    Math.min(defaultSessionExpiration as any, maximumAllowedExpiration as any)
  );
}
