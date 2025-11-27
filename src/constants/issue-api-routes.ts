export enum ISSUE_API_ROUTES {
  BASE = "/datasets/reported-issues",
}

export const ISSUE_ROUTES = {
  LIST: ISSUE_API_ROUTES.BASE,
  CREATE: ISSUE_API_ROUTES.BASE,
  GET_BY_ID: (id: string) => `${ISSUE_API_ROUTES.BASE}/${id}`,
  UPDATE: (id: string) => `${ISSUE_API_ROUTES.BASE}/${id}`,
  DELETE: (id: string) => `${ISSUE_API_ROUTES.BASE}/${id}`,
  MARK_RESOLVED: (id: string) => `${ISSUE_API_ROUTES.BASE}/${id}/mark-resolved`,
  MARK_CLOSED: (id: string) => `${ISSUE_API_ROUTES.BASE}/${id}/mark-closed`,
  MARK_IN_PROGRESS: (id: string) => `${ISSUE_API_ROUTES.BASE}/${id}/mark-in-progress`,
};
