// Seeded accounts (see backend/Data/DbSeedData.cs) - reused across specs via storageState
// rather than re-logging-in in every file. Do not use these for flows that mutate account
// state in ways other specs depend on being pristine (see individual spec files for how
// each one keeps its footprint self-contained).
export const MEMBER = {
  email: "alesson@test.com",
  password: "EnGarde!2",
};

export const ADMIN = {
  email: "fencingclub@test.com",
  password: "EnGarde!2",
};

export const MEMBER_STORAGE_STATE = "playwright/.auth/member.json";
export const ADMIN_STORAGE_STATE = "playwright/.auth/admin.json";
