#!/bin/sh
set -eu

if [ "$#" -ne 1 ]; then
  echo "Usage: sh restore.sh /backups/file.sql.gz"
  exit 1
fi

INPUT_FILE="$1"

if [ ! -f "${INPUT_FILE}" ]; then
  echo "Backup file not found: ${INPUT_FILE}"
  exit 1
fi

echo "Restoring ${INPUT_FILE} into ${POSTGRES_DB}"
gunzip -c "${INPUT_FILE}" | psql -h db -U "${POSTGRES_USER}" -d "${POSTGRES_DB}"
echo "Restore complete"
