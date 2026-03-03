export enum DATA_CATALOGUE_API_ROUTES {
    DATASETS = "/datasets",
    DATASET_BY_ID = "/datasets/{id}",
    DATASET_PROCESSED_DATA = "/datasets/{id}/processed-data",
    DATASET_APPEND_BY_ID = "/datasets/{id}/append",
    DATASET_DB_VALIDATE = "/datasets/db-info/validate",
    DATASET_DB_TABLES = "/datasets/db-info/tables",
    DATASET_CLEANUP_SESSION = "/datasets/{id}/cleanup-session",
    DATASET_DUPLICATE_RECORDS = "/datasets/{id}/duplicate-records",
    DATASET_DUPLICATE_RECORDS_BY_GROUP = "/datasets/{id}/duplicate-records/{group_hash}",
    TEMPLATES = "/templates",
    DATASET_TYPES = "/dataset-types",
}
