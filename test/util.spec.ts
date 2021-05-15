import { clampSessionExpiration } from "../src/util";

describe("clampSessionExpiration()", () => {
  test.each([
    1, 1000, 100_000, 1_000_000, 10_000_000, 100_000_000, 1_000_000_000,
  ])(
    "should always return an expiration clamped to the same day, with session length %ims",
    (sessionLength) => {
      const clampedExpiration = clampSessionExpiration(sessionLength);
      const currentTime = new Date();
      const isSameDate =
        currentTime.toDateString() === clampedExpiration.toDateString();
      expect(isSameDate).toBe(true);
    }
  );
});
