import json
from bson import ObjectId
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .storage.mongo import songs_collection
from .storage.redisdb import redis_client
from .storage.minio_client import get_object_url


def serialize_song(doc):
    if not doc:
        return None
    d = dict(doc)
    d["_id"] = str(d["_id"])
    return d


# ---------------------------------------------------
#  PLAY SONG  (Redis Counter + Recent List + Cache)
# ---------------------------------------------------
@api_view(["POST"])
def play_song(request):
    user_id = request.data.get("user_id", "guest")
    song_name = request.data.get("song_name", "").strip()

    # Find song in MongoDB by title
    song = songs_collection.find_one({"title": song_name})
    if not song:
        return Response({"message": "Song not found"}, status=404)

    song_id = str(song["_id"])
    
    # Generate a presigned URL for streaming
    file_url = get_object_url(song.get("file_name"))

    # Increment play counter in Redis
    redis_client.incr(f"song_views:{song_id}")

    # Add to recent list
    redis_client.lpush(f"recently_played:{user_id}", song_id)
    redis_client.ltrim(f"recently_played:{user_id}", 0, 9)

    # Cache metadata
    redis_client.set(f"song_cache:{song_id}", json.dumps(serialize_song(song)))

    # Get current views
    views = redis_client.get(f"song_views:{song_id}")
    views = int(views) if views else 0

    return Response({
        "message": f"Now playing: {song_name}",
        "song_id": song_id,
        "file_url": file_url,
        "views": views
    })


# ---------------------------------------------------
#  GET RECENTLY PLAYED SONGS
# ---------------------------------------------------
@api_view(["GET"])
def recent(request, user_id):
    ids = redis_client.lrange(f"recently_played:{user_id}", 0, 9)
    ids = [i.decode() for i in ids]

    songs = []
    for sid in ids:
        cached = redis_client.get(f"song_cache:{sid}")
        if cached:
            songs.append(json.loads(cached))
            continue

        # Fallback to MongoDB
        try:
            doc = songs_collection.find_one({"_id": ObjectId(sid)})
        except:
            doc = songs_collection.find_one({"_id": sid})
        songs.append(serialize_song(doc))

    return Response({
        "user_id": user_id,
        "recent": songs
    })
