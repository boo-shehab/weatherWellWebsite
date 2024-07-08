
export const emailRule = [
  (v) => !!v || "email required",
  (v) =>
    /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      v
    ) || "email not valid",
];

export const passwordRule = [
  (v) => !!v || "password required",
  (v) => (v && v.length >= 6 && v.length <= 30) || "password must be between 6 and 30 characters",
];

export const NamesRule = [
  (v) => !!v || "name required",
  (v) => (v && v.length >= 2 && v.length <= 30) || "name must be between 2 and 30 characters",
];

export const requiredRule = [
  (v) =>
    v !== undefined && v !== null && v !== "" ? true : "field required",
];
