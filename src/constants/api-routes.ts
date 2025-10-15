export enum AUTH_API_ROUTES {
  // REGISTER_USER = "/users/registration/user-registration/",
  REGISTER_USER = "/auth/signup",
  VERIFY_EMAIL = "/users/verify_mfa/",
  VERIFY_MFA = "/auth/mfa/verify",
  RESEND_OTP = "/users/resend_otp/",
  LOGIN = "/auth/login",
  FORGOT_PASSWORD = "/users/forgot_password/",
  RESET_PASSWORD = "/users/forgot_password_confirm/",
  VERIFY_NEW_USER = "/auth/accounts/verify",
  PASSWORD_RESET_INITIATE = "auth/password-reset/initiate",
  ROLES = "/auth/roles",
  PERMISSIONS = "/auth/permissions",
  STAFFS = "/staffs",
  STAFF_PROFILE = "/staffs/profile",
  NEW_USER_OTP = "auth/otp/verify",

  NEW_PASSWORD_RESET = "auth/password-reset/confirm",
}

export enum METADATA_API_ROUTES {
  TEMPLATES = "/templates",
}

export enum DATASET_TYPE_API_ROUTES {
  BASE = "/dataset-types",
}

export const DATASET_TYPE_ROUTES = {
  LIST: DATASET_TYPE_API_ROUTES.BASE,
  CREATE: DATASET_TYPE_API_ROUTES.BASE,
  GET_BY_ID: (id: string) => `${DATASET_TYPE_API_ROUTES.BASE}/${id}`,
  UPDATE: (id: string) => `${DATASET_TYPE_API_ROUTES.BASE}/${id}`,
  PARTIAL_UPDATE: (id: string) => `${DATASET_TYPE_API_ROUTES.BASE}/${id}`,
  DELETE: (id: string) => `${DATASET_TYPE_API_ROUTES.BASE}/${id}`,
  ARCHIVE: (id: string) => `${DATASET_TYPE_API_ROUTES.BASE}/${id}/archive`,
  UNARCHIVE: (id: string) => `${DATASET_TYPE_API_ROUTES.BASE}/${id}/unarchive`,
};
