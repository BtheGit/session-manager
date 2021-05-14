// Typescript does not have discrete typings for formatted Date strings.
// But it's helpful to remember not all strings are equal.
type ISOString = string;
type URLString = string;
export interface Session {
  id: string;
  expiration: ISOString;
  referrer: URLString;
  campaign: string | null;
}
