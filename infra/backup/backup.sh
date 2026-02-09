#!/bin/sh
set -eu

BACKUP_DIR="/backups"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"
TS="$(date +%Y%m%d_%H%M%S)"
OUT_FILE="${BACKUP_DIR}/hobby_os_${TS}.sql.gz"

mkdir -p "${BACKUP_DIR}"

while true; do
  echo "[backup] creating ${OUT_FILE}"
  pg_dump -h db -U "${POSTGRES_USER}" "${POSTGRES_DB}" | gzip > "${OUT_FILE}"

  echo "[backup] pruning files older than ${RETENTION_DAYS} days"
  find "${BACKUP_DIR}" -type f -name "*.sql.gz" -mtime +"${RETENTION_DAYS}" -delete

  echo "[backup] done, sleeping 24h"
  sleep 86400

  TS="$(date +%Y%m%d_%H%M%S)"
  OUT_FILE="${BACKUP_DIR}/hobby_os_${TS}.sql.gz"
done
