from django.db import models
  
class Genre(models.Model):
    name = models.CharField(max_length=255)
    image = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.name

class User(models.Model):
    username = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    info = models.TextField(blank=True) 
    favorite_genres = models.ManyToManyField('Genre', blank=True, related_name="genre_users")
    year_joined = models.BigIntegerField(blank=True, null=True)
    image = models.CharField(max_length=255, blank=True)
    collections = models.ManyToManyField('Collection', blank=True, related_name="owned_by_users")
    playlists = models.ManyToManyField('Playlist', blank=True, related_name="created_by_users")
    saved_albums = models.ManyToManyField('Album', blank=True, related_name="saved_by_users")
    favorite_albums = models.ManyToManyField('Album', blank=True, related_name="made_favorite_album_by_user")
    favorite_artists = models.ManyToManyField('Artist', blank=True, related_name="made_favorite_artist_by_user")
    favorite_songs = models.ManyToManyField('Music', blank=True, related_name="made_favorite_song_by_user")
    recently_played = models.ManyToManyField('Music', blank=True, related_name="recently_played_by_user")
    is_creator = models.BooleanField(default=False)

    def __str__(self):
        return self.username
    
class Artist(User):
    genre = models.ManyToManyField('Genre', related_name="genre_artist")
    
    @property
    def total_likes(self):
        return self.made_favorite_artist_by_user.count()
        
    @property
    def album_count(self):
        return self.artist_albums.count()
        
    @property
    def music_count(self):
        return self.artist_musics.count()
    
    def __str__(self):
        return self.username
    

class Listener(User):
    def __str__(self):
        return self.username
    
class Music(models.Model):
    name = models.CharField(max_length=255)
    play_time = models.BigIntegerField()    
    album = models.ForeignKey('Album', blank=True, null=True, on_delete=models.CASCADE, related_name="album_musics")
    genre = models.ForeignKey('Genre', null=True, on_delete=models.SET_NULL, related_name="genre_musics")
    image = models.CharField(max_length=255, blank=True)
    audio = models.CharField(max_length=255, blank=True)
    mood = models.CharField(max_length=255, blank=True)
    artist = models.ForeignKey('Artist', on_delete=models.CASCADE, related_name="artist_musics")
    played_before = models.ManyToManyField('User', blank=True, related_name="musics_played_before")
    lyrics = models.FileField(upload_to='lyrics/')
    is_single = models.BooleanField(default=False)
    
    @property
    def total_likes(self):
        return self.made_favorite_song_by_user.count()
    
    def __str__(self):
        return self.name
    
    def get_lyrics_url(self):
        return self.lyrics.url
    
     
class Album(models.Model):
    name = models.CharField(max_length=255)
    artist = models.ForeignKey('Artist', on_delete=models.CASCADE, related_name='artist_albums')
    year = models.BigIntegerField(blank=True, null=True)
    image = models.CharField(max_length=255, blank=True)
    genre = models.ForeignKey('Genre', null=True, on_delete=models.SET_NULL, related_name="genre_albums")
    
    @property
    def total_music_count(self):
        return self.musics.count()
    
    @property
    def total_likes(self):
        return self.made_favorite_album_by_user.count()
     
    def __str__(self):
        return self.name
    

class Collection(models.Model):
    name = models.TextField(blank=True)
    musics = models.ManyToManyField('Music', blank=True, related_name="music_collection")
    owner = models.ForeignKey('User', blank=True, on_delete=models.CASCADE, related_name="user_collections")
    image = models.CharField(max_length=255, blank=True)

    @property
    def music_count(self):
        return self.musics.count()
    
    def __str__(self):
        return self.name


class Playlist(models.Model):
    name = models.TextField(blank=True)
    owner = models.ForeignKey('User', blank=True, on_delete=models.CASCADE, related_name="user_playlists")
    musics = models.ManyToManyField('Music', blank=True, related_name="music_playlists")
    image = models.CharField(max_length=255, blank=True)
    
    @property
    def music_count(self):
        return self.musics.count()
        
    def __str__(self):
        return self.name


class Event(models.Model):
    name = models.CharField(max_length=255)
    artist = models.ForeignKey('Artist', on_delete=models.CASCADE, null=True, related_name='artist_events')
    date = models.DateField()
    location = models.TextField()
    info = models.TextField(blank=True)
    image = models.CharField(max_length=255, blank=True)
    is_live_event = models.BooleanField(default=False)
    link = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    

