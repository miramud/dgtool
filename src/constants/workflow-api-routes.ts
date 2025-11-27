// Workflow API routes
export enum WORKFLOW_API_ROUTES {
  BASE = "/workflows",
}

export const WORKFLOW_ROUTES = {
  LIST: WORKFLOW_API_ROUTES.BASE,
  CREATE: WORKFLOW_API_ROUTES.BASE,
  GET_BY_ID: (id: string) => `${WORKFLOW_API_ROUTES.BASE}/${id}`,
  UPDATE: (id: string) => `${WORKFLOW_API_ROUTES.BASE}/${id}`,
  DELETE: (id: string) => `${WORKFLOW_API_ROUTES.BASE}/${id}`,
};
