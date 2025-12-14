from django.urls import path, include
from music.views import upload_song, related_songs
from music.views_redis import play_song, recent
urlpatterns = [
    path("upload-song/", upload_song),
    path("play-song/", play_song),

    path("recent/<user_id>/", recent),
    path("related-songs/<str:song_id>/", related_songs),

]
