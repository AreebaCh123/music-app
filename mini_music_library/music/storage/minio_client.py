from minio import Minio
from minio.error import S3Error
from datetime import timedelta  # <-- import timedelta

MINIO_HOST = "localhost:9000"
MINIO_ACCESS_KEY = "admin"
MINIO_SECRET_KEY = "admin123"
BUCKET_NAME = "songs"

minio_client = Minio(
    MINIO_HOST,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False
)

# Ensure bucket exists
try:
    if not minio_client.bucket_exists(BUCKET_NAME):
        minio_client.make_bucket(BUCKET_NAME)
except S3Error as e:
    print("MinIO bucket check/create error:", e)

def get_object_url(object_name: str) -> str:
    """
    Generate a presigned URL valid for 1 hour for streaming/downloading.
    """
    try:
        url = minio_client.presigned_get_object(
            BUCKET_NAME,
            object_name,
            expires=timedelta(hours=1)  # <-- use timedelta
        )
        return url
    except S3Error as e:
        print("Error generating presigned URL:", e)
        return ""
