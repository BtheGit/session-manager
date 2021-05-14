import { v4 as uuidv4 } from "uuid";
import { Session } from "./types";
import { clampSessionExpiration } from "./util";
import { readSession, writeSession } from "./storage";
import { CAMPAIGN, SESSION_LENGTH_IN_MS } from "./constants";

export function updateActiveSession(
  campaign: Session["campaign"],
  id = uuidv4()
): Session {
  const { referrer } = document;
  const clampedSessionExpiration = clampSessionExpiration(SESSION_LENGTH_IN_MS);
  const session: Session = {
    id,
    expiration: clampedSessionExpiration.toISOString(),
    referrer,
    campaign,
  };
  writeSession(session);
  return session;
}

export function getActiveSession(): Session {
  return readSession();
}

export function getSession(): Session {
  const newCampaign = new URLSearchParams(window.location.search).get(CAMPAIGN);
  const activeSession = getActiveSession();
  if (!activeSession) {
    return updateActiveSession(newCampaign);
  }

  const { expiration, campaign: activeCampaign } = activeSession;
  const isSessionExpired = Date.parse(expiration) < Date.now();
  // Internal URLs should not be expected to persist UTM values (considered bad practice),
  // therefore, if a campaign value already exists and a new one does not, we do not have enough
  // information to confidently expire the existing camapaign.
  const isNewCampaign = newCampaign !== null && newCampaign !== activeCampaign;
  if (isSessionExpired || isNewCampaign) {
    return updateActiveSession(newCampaign);
  }

  const { id } = activeSession;
  return updateActiveSession(activeCampaign, id);
}
