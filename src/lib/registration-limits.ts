export const MAX_TEAMS = 41;

// Only approved teams hold a confirmed slot — pending/on-hold/rejected
// registrations aren't counted against the cap.
export const COUNTED_STATUSES: "APPROVED"[] = ["APPROVED"];

// Manual kill switch, independent of the MAX_TEAMS slot count — flip to
// false to reopen registrations.
export const REGISTRATION_CLOSED = false;
