export enum DATA_CATALOGUE_API_ROUTES {
    DATASETS = "/datasets",
    DATASET_BY_ID = "/datasets/{id}",
    DATASET_CLEANUP_SESSION = "/datasets/{id}/cleanup-session",
    DATASET_DUPLICATE_RECORDS = "/datasets/{id}/duplicate-records",
    DATASET_DUPLICATE_RECORDS_BY_GROUP = "/datasets/{id}/duplicate-records/{group_hash}",
    TEMPLATES = "/templates",
    DATASET_TYPES = "/dataset-types",
}