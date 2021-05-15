import { updateActiveSession, getSession } from "../src/session";
import { Session } from "../src/types";

jest.mock("js-cookie");
import Cookie from "js-cookie";

const DEFAULT_REFERRER_VALUE = "https://www.example.com";
const DEFAULT_CAMPAIGN_VALUE = "email";

describe("session", () => {
  beforeAll(() => {
    Object.defineProperty(document, "referrer", {
      value: DEFAULT_REFERRER_VALUE,
      configurable: true,
    });
  });
  beforeEach(() => {
    // Overriding the search params in JSDOM is a tricky one.
    // See: https://github.com/facebook/jest/issues/5124
    delete (window as any).location;
    (window as any).location = {
      search: `?utm_campaign=${DEFAULT_CAMPAIGN_VALUE}`,
    };
    jest.clearAllMocks();
  });

  describe("updateActiveSession()", () => {
    it("should return an exact copy of the session object persisted to local storage", () => {
      let cookieStore;
      Cookie.set = ((_, value) => {
        cookieStore = value;
      }) as jest.MockedFunction<typeof Cookie.set>;
      const session = updateActiveSession("test_campaign");
      expect(session).toEqual(cookieStore);
    });
  });

  describe("getSession()", () => {
    it("should create a new session if existing session has expired", () => {
      const activeSession: Session = {
        id: "sdfsdfsdfsdf",
        referrer: DEFAULT_REFERRER_VALUE,
        campaign: DEFAULT_CAMPAIGN_VALUE,
        expiration: new Date(Date.now() - 8.64e7).toISOString(),
      };
      Cookie.getJSON = ((_name: string): object =>
        activeSession) as jest.MockedFunction<typeof Cookie.getJSON>;
      const session = getSession();
      expect(activeSession.id === session.id).toBe(false);
    });

    it("should create a new session if campaign has changed", () => {
      const activeSession: Session = {
        id: "sdfsdfsdfsdf",
        referrer: DEFAULT_REFERRER_VALUE,
        campaign: "summer_mailer",
        expiration: new Date(Date.now() + 1_000_000).toISOString(),
      };
      Cookie.getJSON = ((_name: string): object =>
        activeSession) as jest.MockedFunction<typeof Cookie.getJSON>;
      const session = getSession();
      expect(activeSession.id === session.id).toBe(false);
    });

    it("should extend an existing session if still active and campaign hasn't changed", () => {
      const activeSession: Session = {
        id: "sdfsdfsdfsdf",
        referrer: DEFAULT_REFERRER_VALUE,
        campaign: DEFAULT_CAMPAIGN_VALUE,
        expiration: new Date(Date.now() + 1_000_000).toISOString(),
      };
      Cookie.getJSON = ((_name: string): object =>
        activeSession) as jest.MockedFunction<typeof Cookie.getJSON>;
      (window as any).location = {
        search: "",
      };
      const session = getSession();
      expect(activeSession.id === session.id).toBe(true);
    });

    it("should extend an existing campaign-based session if still active and campaign value is no longer available in the URL", () => {
      const activeSession: Session = {
        id: "sdfsdfsdfsdf",
        referrer: DEFAULT_REFERRER_VALUE,
        campaign: DEFAULT_CAMPAIGN_VALUE,
        expiration: new Date(Date.now() + 1_000_000).toISOString(),
      };
      Cookie.getJSON = ((_name: string): object =>
        activeSession) as jest.MockedFunction<typeof Cookie.getJSON>;
      const session = getSession();
      expect(activeSession.id === session.id).toBe(true);
    });

    it("should extend an existing session if only referrer is different and session still active", () => {
      const activeSession: Session = {
        id: "sdfsdfsdfsdf",
        referrer: "https://www.google.com",
        campaign: DEFAULT_CAMPAIGN_VALUE,
        expiration: new Date(Date.now() + 1_000_000).toISOString(),
      };
      Cookie.getJSON = ((_name: string): object =>
        activeSession) as jest.MockedFunction<typeof Cookie.getJSON>;
      const session = getSession();
      expect(activeSession.id === session.id).toBe(true);
    });
  });
});
