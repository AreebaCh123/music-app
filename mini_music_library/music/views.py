import os
from uuid import uuid4
from bson import ObjectId
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status

from .storage.minio_client import minio_client, BUCKET_NAME, get_object_url
from .storage.mongo import songs_collection

# Neo4j driver
from .storage.graph import get_session


# Optional: duration
try:
    from mutagen.mp3 import MP3
except Exception:
    MP3 = None


# ---------------------------------------------------
#  UPLOAD SONG  (MinIO + MongoDB + Neo4j)
# ---------------------------------------------------
@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def upload_song(request):
    title = request.data.get("title", "").strip()
    artist = request.data.get("artist", "").strip()
    genre = request.data.get("genre", "").strip()
    file_obj = request.FILES.get("file")

    if not file_obj:
        return Response({"error": "No file provided"}, status=400)

    if not (file_obj.content_type in ("audio/mpeg", "audio/mp3") or file_obj.name.lower().endswith(".mp3")):
        return Response({"error": "Only mp3 files are supported"}, status=400)

    ext = os.path.splitext(file_obj.name)[1] or ".mp3"
    object_name = f"{uuid4().hex}{ext}"
    size = file_obj.size

    # Upload file to MinIO
    try:
        data_stream = file_obj.file if hasattr(file_obj, "file") else file_obj

        try:
            data_stream.seek(0)
        except:
            pass

        minio_client.put_object(
            BUCKET_NAME,
            object_name,
            data_stream,
            length=size,
            content_type=file_obj.content_type
        )
    except Exception as e:
        return Response({"error": "MinIO upload failed", "details": str(e)}, status=500)

    file_url = get_object_url(object_name)

    # Duration
    duration_seconds = None
    if MP3:
        try:
            data_stream.seek(0)
            raw = data_stream.read()
            from io import BytesIO
            audio = MP3(BytesIO(raw))
            duration_seconds = int(audio.info.length)
        except:
            duration_seconds = None

    # Save metadata to MongoDB
    metadata = {
        "title": title or os.path.splitext(file_obj.name)[0],
        "artist": artist or "Unknown",
        "genre": genre or "",
        "file_url": file_url,
        "file_name": object_name,
        "size": size,
        "duration": duration_seconds,
    }

    try:
        result = songs_collection.insert_one(metadata)
        metadata["_id"] = str(result.inserted_id)
    except Exception as e:
        return Response({"error": "MongoDB save failed", "details": str(e)}, status=500)

    mongo_id = metadata["_id"]

    # ----------------------------------------------------
    #  SAVE IN NEO4J + CREATE AUTO SIMILARITY RELATIONS
    # ----------------------------------------------------
    try:
        with get_session() as session:

            # Create Song node + Genre
            session.run("""
                MERGE (s:Song {mongo_id: $id})
                SET s.title = $title, s.artist = $artist

                MERGE (g:Genre {name: $genre})
                MERGE (s)-[:HAS_GENRE]->(g)
            """, {
                "id": mongo_id,
                "title": metadata["title"],
                "artist": metadata["artist"],
                "genre": metadata["genre"] or "Unknown"
            })

            # AUTO SIMILARITY LOGIC
            session.run("""
                MATCH (new:Song {mongo_id: $id})-[:HAS_GENRE]->(g:Genre)
                MATCH (other:Song)-[:HAS_GENRE]->(g)
                WHERE new.mongo_id <> other.mongo_id
                MERGE (new)-[:SIMILAR_TO]->(other)
            """, {"id": mongo_id})

    except Exception as e:
        print("Neo4j error:", e)

    return Response({"message": "Uploaded", "song": metadata}, status=201)



# ---------------------------------------------------
#  RELATED SONGS API (Neo4j)
# ---------------------------------------------------
@api_view(["POST"])
def related_songs(request):
    song_name = request.data.get("song_name", "").strip()
    if not song_name:
        return Response({"error": "Song name is required"}, status=400)

    # Find song in MongoDB
    song = songs_collection.find_one({"title": song_name})
    if not song:
        return Response({"error": "Song not found"}, status=404)

    song_id = str(song["_id"])

    # Query Neo4j for related songs
    try:
        with get_session() as session:
            result = session.run("""
                MATCH (s:Song {mongo_id: $id})-[:SIMILAR_TO]->(other:Song)
                RETURN other.mongo_id AS id LIMIT 10
            """, {"id": song_id})

            related_ids = [record["id"] for record in result]
    except Exception as e:
        return Response({"error": "Neo4j query failed", "details": str(e)}, status=500)

    # Fetch related song metadata from MongoDB
    related_songs = []
    for rid in related_ids:
        try:
            doc = songs_collection.find_one({"_id": ObjectId(rid)})
        except:
            doc = songs_collection.find_one({"_id": rid})
        if doc:
            doc["_id"] = str(doc["_id"])
            related_songs.append(doc)

    return Response({"related_songs": related_songs})
