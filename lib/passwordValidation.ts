export const PASSWORD_RULES_MESSAGE =
  "Password must be at least 8 characters and include uppercase, lowercase, and a symbol.";

const passwordRule =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

export function isValidPassword(password: string) {
  return passwordRule.test(password);
}
