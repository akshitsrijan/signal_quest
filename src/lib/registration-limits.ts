export const MAX_TEAMS = 40;

// Only approved teams hold a confirmed slot — pending/on-hold/rejected
// registrations aren't counted against the cap.
export const COUNTED_STATUSES: "APPROVED"[] = ["APPROVED"];
