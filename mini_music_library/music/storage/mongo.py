from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["music_library"]
songs_collection = db["songs"]
