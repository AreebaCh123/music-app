from minio import Minio
from minio.error import S3Error

MINIO_HOST = "localhost:9000"
MINIO_ACCESS_KEY = "admin"
MINIO_SECRET_KEY = "admin123"
BUCKET_NAME = "songs"

minio_client = Minio(
    "localhost:9000",
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False
)

# Ensure bucket exists (run on import)
try:
    if not minio_client.bucket_exists(BUCKET_NAME):
        minio_client.make_bucket(BUCKET_NAME)
except S3Error as e:
    # On error, print to console (Django server logs will show this)
    print("MinIO bucket check/create error:", e)

def get_object_url(object_name: str) -> str:
    # Development simple URL (MinIO default)
    # If using MinIO console / gateway or S3, you might change this pattern as needed.
    return f"http://{MINIO_HOST}/{BUCKET_NAME}/{object_name}"
