from django_elasticsearch_dsl import Document
from django_elasticsearch_dsl.registries import registry
from .models import *

from django.db import models

@registry.register_document
class GenreDocument(Document):
    class Index:
        name = 'genres'
        settings = {'number_of_shards': 1,
                    'number_of_replicas': 0}

    class Django:
        model = Genre
        fields = [
            'name',
            'image',
        ]

@registry.register_document
class UserDocument(Document):
    class Index:
        name = 'users'
        settings = {'number_of_shards': 1,
                    'number_of_replicas': 0}

    class Django:
        model = User
        fields = [
            'info',
        ]
    
@registry.register_document
class ArtistDocument(UserDocument):
    class Index:
        name = 'artists'
        settings = {'number_of_shards': 1,
                    'number_of_replicas': 0}

    class Django:
        model = Artist
        fields = [
            'id',
            'username',
            'image',
        ]
   
    
@registry.register_document
class MusicDocument(Document):
    class Index:
        name = 'musics'
        settings = {'number_of_shards': 1,
                    'number_of_replicas': 0}

    class Django:
        model = Music
        fields = [
            'id',
            'name',
            'mood',
            'image',
        ]
        
    
@registry.register_document
class AlbumDocument(Document):
    class Index:
        name = 'albums'
        settings = {'number_of_shards': 1,
                    'number_of_replicas': 0}

    class Django:
        model = Album
        fields = [
            'id',
            'name',
            'image',
        ]
        
    
@registry.register_document
class CollectionDocument(Document):
    class Index:
        name = 'collections'
        settings = {'number_of_shards': 1,
                    'number_of_replicas': 0}

    class Django:
        model = Collection
        fields = [
            'name',
            'image',
        ]
  
@registry.register_document
class PlaylistDocument(Document):
    class Index:
        name = 'playlists'
        settings = {'number_of_shards': 1,
                    'number_of_replicas': 0}

    class Django:
        model = Playlist
        fields = [
            'name',
            'image',
        ]
    
@registry.register_document
class EventDocument(Document):
    class Index:
        name = 'events'
        settings = {'number_of_shards': 1,
                    'number_of_replicas': 0}

    class Django:
        model = Event
        fields = [
            'name',
            'info',
            'image',
            'is_live_event',
        ]

