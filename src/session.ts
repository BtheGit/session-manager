import Cookie from "js-cookie";
import { v4 as uuidv4 } from "uuid";

const SESSION_COOKIE_ID = "_insticatorSession";
const CAMPAIGN = "utm_campaign";
const SESSION_LENGTH_IN_MS = 1_800_000;

interface Session {
  id: string;
  expiration: string;
  referrer: string;
  campaign: string | null;
}

function capSessionExpiration(nextExpiration: Date): Session["expiration"] {
  const maximumAllowedExpiration = new Date(
    new Date().setHours(23, 59, 59, 999)
  );
  return new Date(
    Math.min(nextExpiration as any, maximumAllowedExpiration as any)
  ).toISOString();
}

// Utilities
function updateActiveSession(
  campaign: Session["campaign"],
  id = uuidv4()
): Session {
  // NOTE: Need to be HTTPS or this will not be available.
  const { referrer } = document;
  const maximumPermissableSessionExpiration = new Date(
    Date.now() + SESSION_LENGTH_IN_MS
  );
  const expiration = capSessionExpiration(maximumPermissableSessionExpiration);
  const session: Session = {
    id,
    expiration,
    referrer,
    campaign,
  };
  Cookie.set(SESSION_COOKIE_ID, session);
  return session;
}

function getActiveSession(): Session {
  return Cookie.getJSON(SESSION_COOKIE_ID);
}

export function getSession(): Session {
  const newCampaign = new URLSearchParams(window.location.search).get(CAMPAIGN);
  const activeSession = getActiveSession();
  if (!activeSession) {
    return updateActiveSession(newCampaign);
  }

  const { expiration, campaign: activeCampaign } = activeSession;
  const isSessionExpired = Date.parse(expiration) < Date.now();
  const isNewCampaign =
    newCampaign !== "" &&
    activeCampaign !== "" &&
    newCampaign !== activeCampaign;
  if (isSessionExpired || isNewCampaign) {
    return updateActiveSession(newCampaign);
  }

  const { id } = activeSession;
  return updateActiveSession(activeCampaign, id);
}
