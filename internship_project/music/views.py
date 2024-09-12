import json
from django.forms import model_to_dict
from django.shortcuts import render
from django.views import View
from django.http import JsonResponse
from django.db.models import Count
from music.models import ( 
    Album,
    Artist,
    Collection,
    Playlist,
    Event,
    Genre,
    Listener,
    Music,
    User,
)
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from django.core.cache import cache
from elasticsearch import Elasticsearch
from .documents import*


GenreDocument().update(Genre.objects.all())
UserDocument().update(User.objects.all())
ArtistDocument().update(Artist.objects.all())
MusicDocument().update(Music.objects.all())
AlbumDocument().update(Album.objects.all())
CollectionDocument().update(Collection.objects.all())
PlaylistDocument().update(Playlist.objects.all())
EventDocument().update(Event.objects.all()) 

top_artist_limit = 0

class HomeView(View):
    template_name = 'music/home.html'
    #@method_decorator(cache_page(60 * 15), name= "dispatch")    
    def get(self, request, *args, **kwargs):
        print("default render called")
        return render(request, self.template_name)   
    
class ProfileView(View):
    template_name = 'music/profile.html'
    #@method_decorator(cache_page(60 * 15), name= "dispatch")    
    def get(self, request, *args, **kwargs):
        print("default render called")
        return render(request, self.template_name)  

class UserProfileView(View):
    def get(self, request, *args, **kwargs):
        username = request.GET.get('username')
        user = list(User.objects.filter(username=username).values())
        return JsonResponse({"user": user})

class TopArtistsView(View):
    def get(self, request, *args, **kwargs):
        username = request.GET.get('username')
        top_artists = Artist.objects.annotate(
            is_top_artist=Count('made_favorite_artist_by_user')
        ).filter(is_top_artist__gt=top_artist_limit).values()
        artists = list(top_artists.filter(genre__genre_users__username = username).exclude(username=username))
        return JsonResponse({"artists": artists})
    
class RecommendationsView(View):
    def get(self, request, *args, **kwargs):
        username = request.GET.get('username')
        musics = list(Music.objects.filter(genre__genre_users__username= username, artist__made_favorite_artist_by_user__username = username).values())
        return JsonResponse({"musics": musics})
    

class RecentlyPlayedMusicView(View):
    def get(self, request, *args, **kwargs):
        username = request.GET.get("username")
        key = f"{username}:recently_played"
        recently_played_ids = cache.get(key, [])
        if recently_played_ids:
            musics = list(Music.objects.filter(id__in=recently_played_ids).order_by('-id').values())
        else:
            musics = []
        return JsonResponse({"musics": musics})

      
class MusicsView(View):
    def get(self, request, *args, **kwargs):
        username = request.GET.get('username')
        musics = list(Music.objects.filter(genre__genre_users__username = username).values())
        return JsonResponse({"musics": musics})  

class AlbumsView(View):
    def get(self, request, *args, **kwargs):
        username = request.GET.get('username')
        albums = list(Album.objects.filter(genre__genre_users__username = username).values())
        return JsonResponse({"albums": albums})

class CreateView(View):
    template_name = 'music/create.html'
    #@method_decorator(cache_page(60 * 15), name= "dispatch") 
    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)   
         
class ArtistProfileView(View):
    template_name = 'music/artist_profile.html'
    #@method_decorator(cache_page(60 * 15), name= "dispatch") 
    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)
    
class ArtistView(View):
    def get(self, request, *args, **kwargs):
        artist_id = request.GET.get("artist_id")
        artists = list(Artist.objects.filter(id=artist_id).values())
        return JsonResponse({"artist": artists})      
        
class ArtistAlbumsView(View):
    def get(self, request, *args, **kwargs):
        artist_id = request.GET.get("artist_id")
        albums = list(Album.objects.filter(artist__id = artist_id).values())
        return JsonResponse({"albums": albums})
    
class ArtistMusicsView(View):
    def get(self, request, *args, **kwargs):
        artist_id = request.GET.get("artist_id")
        musics = list(Music.objects.filter(artist__id = artist_id).values())
        return JsonResponse({"musics": musics})
    
class CollectionsView(View):
    template_name = 'music/collections.html'
    #@method_decorator(cache_page(60 * 15), name= "dispatch") 
    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)     
    
class DisplayView(View):
    template_name = 'music/display.html'
    #@method_decorator(cache_page(60 * 15), name= "dispatch") 
    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)       
        
class EventsView(View):
    template_name = 'music/events.html'
    #@method_decorator(cache_page(60 * 15), name= "dispatch") 
    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)
    
class AllEventsView(View):
    def get(self, request, *args, **kwargs):
        events = list(Event.objects.filter(is_live_event = False).values().order_by("id"))
        return JsonResponse({"events": events})
    
class TopArtistEventsView(View):
    def get(self, request, *args, **kwargs):
        username = request.GET.get('username')
        top_artists = Artist.objects.annotate(
            is_top_artist=Count('made_favorite_artist_by_user')
        ).filter(is_top_artist__gt=top_artist_limit, genre__genre_users__username=username)
        events = list(Event.objects.filter(artist__in=top_artists, is_live_event = False).distinct().values())
        return JsonResponse({"events": events})
    
class FavoriteArtistEventsView(View):
    def get(self, request, *args, **kwargs):
        username = request.GET.get('username')
        events = list(Event.objects.filter(artist__made_favorite_artist_by_user__username = username, is_live_event= False).values().order_by("id"))
        return JsonResponse({"events": events})
    
class FavoriteArtistsView(View):
    def get(self, request, *args, **kwargs):
        username = request.GET.get('username')
        artists = list(Artist.objects.filter(made_favorite_artist_by_user__username = username).values())
        return JsonResponse({"artists": artists})        

class LiveView(View):
    template_name = 'music/live.html'
    #@method_decorator(cache_page(60 * 15), name= "dispatch") 
    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)
    
class AllLiveEventsView(View):
    def get(self, request, *args, **kwargs):
        live = list(Event.objects.filter(is_live_event = True).values().order_by("id"))
        return JsonResponse({"live": live})
         
class TopArtistLiveEventsView(View):
    def get(self, request, *args, **kwargs):
        username = request.GET.get('username')
        top_artists = Artist.objects.annotate(
            is_top_artist=Count('made_favorite_artist_by_user')
        ).filter(is_top_artist__gt=top_artist_limit, genre__genre_users__username=username)
        live = list(Event.objects.filter(artist__in=top_artists, is_live_event= True).distinct().values())
        return JsonResponse({"live": live})
       
class FavoriteArtistLiveEventsView(View):
    def get(self, request, *args, **kwargs):
            username = request.GET.get('username')
            live = list(Event.objects.filter(artist__made_favorite_artist_by_user__username = username, is_live_event = True).values().order_by("id"))
            return JsonResponse({"live": live})
 
class LoginView(View):
    template_name = 'music/login.html'
    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)
    
class LoginUserView(View):
    def get(self, request, *args, **kwargs):
        username = request.GET.get('username', None)
        password = request.GET.get('password', None)
        user = list(User.objects.filter(username=username, password=password).values())
        if user:
            return JsonResponse({'user': user}, status=200)
        else:
            return JsonResponse({'error': 'Invalid username or password'}, status=401) 

class SignupUserView(View):
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        is_artist = data.get('is_artist')
        genres = data.get('genre', [])
        
        if not username or not password:
            return JsonResponse({'error': 'Username and password are required'}, status=400)
        
        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already exists'}, status=400)
        
        if is_artist:
            artist = Artist(username=username, password=password, image="https://i.imghippo.com/files/94ICz1724573846.png", is_creator = True)
            artist.save()
            artist.genre.set(genres)
            artist.favorite_genres.set(genres)
            artist.save()
        else:
            listener = Listener(username=username, password=password, image="https://i.imghippo.com/files/94ICz1724573846.png", is_creator = False)
            listener.save()
            listener.favorite_genres.set(genres)
            listener.save()

        return JsonResponse({'user': username}, status=201)


class ChangeUserPasswordView(View):
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        new_password = data.get('new_password')

        if not username or not password or not new_password:
            return JsonResponse({'error': 'Username, current password, and new password are required'}, status=400)
        
        user = User.objects.filter(username=username, password=password).first()
        if user:
            user.password = new_password
            user.save()

            if user.is_creator and Artist.objects.filter(username=user.username).exists():
                artist = Artist.objects.filter(username=user.username).first()
                artist.password = new_password
                artist.save()
            else:
                listener = Listener.objects.filter(username=user.username).first()
                if listener:
                    listener.password = new_password
                    listener.save()

            user_data = model_to_dict(user)
            user_data['favorite_genres'] = list(user.favorite_genres.values_list('name', flat=True))

            return JsonResponse({'user': user_data}, status=200)
        else:
            return JsonResponse({'error': 'Invalid username or password'}, status=401)

class MusicGenreView(View):
    template_name = 'music/music_genre.html'
    #@method_decorator(cache_page(60 * 15), name= "dispatch") 
    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)
    
class GenreView(View):
    def get(self, request, *args, **kwargs):
        genre_id = request.GET.get("genre_id")
        genre = list(Genre.objects.filter(id = genre_id).values())
        return JsonResponse({'genres': genre})

class GenreArtistsView(View):
    def get(self, request, *args, **kwargs):
        genre_id = request.GET.get("genre_id")
        artists = list(Artist.objects.filter(genre__id =genre_id).values())
        return JsonResponse({'artists': artists})

class GenreAlbumsView(View):
    def get(self, request, *args, **kwargs):
        genre_id = request.GET.get("genre_id")
        albums = list(Album.objects.filter(genre__id=genre_id).values())
        return JsonResponse({'albums': albums})
    
class GenreMusicsView(View):
    def get(self, request, *args, **kwargs):
        genre_id = request.GET.get("genre_id")
        musics = list(Music.objects.filter(genre__id= genre_id).values())
        return JsonResponse({'musics': musics})
        
class MusicPlayAlbumView(View):
    template_name = 'music/music_play_album.html'
    #@method_decorator(cache_page(60 * 15), name= "dispatch") 
    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)
    
class AlbumView(View):
    def get(self, request, *args, **kwargs):
        album_id = request.GET.get("album_id")
        album = list(Album.objects.filter(id = album_id).values())
        return JsonResponse({'album': album})
    
class AlbumMusicsView(View):
    def get(self, request, *args, **kwargs):
        album_id = request.GET.get("album_id")
        musics = list(Music.objects.filter(album__id = album_id).values())
        return JsonResponse({'musics': musics})
        
class MusicPlaySongView(View):
    template_name = 'music/music_play_song.html'
    #@method_decorator(cache_page(60 * 15), name= "dispatch") 
    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)
           
class SongView(View):
    def get(self, request, *args, **kwargs):
        music_id = request.GET.get("music_id")
        username = request.GET.get("username")
        key = f"{username}:recently_played"
        music = list(Music.objects.filter(id = music_id).values())
        recently_played = cache.get(key, [])
        recently_played.insert(0, music_id)
        recently_played = recently_played[:20]
        cache.set(key, recently_played)
        return JsonResponse({'music': music}) 
    
class LyricsView(View):
    def get(self, request, *args, **kwargs):
        music_id = request.GET.get("music_id")
        music = Music.objects.filter(id=music_id).first()
        if music and music.lyrics:
            lyrics_url = music.get_lyrics_url()
            return JsonResponse({'music': {'id': music.id, 'name': music.name, 'lyrics': lyrics_url}})
        return JsonResponse({'error': 'Music or lyrics not found'}, status=404)
    
class MusicSearchView(View):
    template_name = 'music/music_search.html'
    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)
    
class SearchGenreView(View):
    def get(self, request, *args, **kwargs):
        search_string = request.GET.get("search_string")
        genres = list(Genre.objects.filter(genre_name = search_string).values())
        return JsonResponse({"genres": genres})

class SearchArtistView(View):
    def get(self, request, *args, **kwargs):
        search_string = request.GET.get("search_string")
        artist_search = ArtistDocument.search().query("match", username= search_string)
        artists = artist_search.execute()
        artist_list = []
        for artist in artists:
            artist_list.append({
                "id": artist.id,
                "info": artist.info,
                "username": artist.username,
                "image": artist.image,
            })
            
        return JsonResponse({"artists": artist_list})
    
class SearchAlbumView(View):
    def get(self, request, *args, **kwargs):
        search_string = request.GET.get("search_string")
        album_search = AlbumDocument.search().query("match", name= search_string)
        albums = album_search.execute()
        album_list = []
        for album in albums:
            album_object = Album.objects.filter(id= album.id).first()
            album_list.append({
                "id": album_object.id,
                "image": album_object.image,
                "name": album_object.name,
                "artist_id": album_object.artist_id,
            })
            
        return JsonResponse({"albums": album_list})
    
class SearchMusicView(View):
    def get(self, request, *args, **kwargs):
        search_string = request.GET.get("search_string")
        music_search = MusicDocument.search().query("match", name= search_string)
        musics = music_search.execute()
        music_list = []
        for music in musics:
            music_object = Music.objects.filter(id = music.id).first()
            music_list.append({
               "id": music_object.id,
                "image": music_object.image,
                "name": music_object.name,
                "artist_id": music_object.artist_id,
            })
            
        return JsonResponse({"musics": music_list})
        
class MusicSelectorView(View):
    template_name = 'music/music_selector.html'
    #@method_decorator(cache_page(60 * 15), name= "dispatch") 
    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)
    
class MoodMusicView(View):  
    def get(self, request, *args, **kwargs):
        mood_id = request.GET.get("mood", None)
        musics = list(Music.objects.filter(mood = mood_id).values())
        return JsonResponse({"musics": musics})       

class FavoriteAlbumsView(View):
    def get(self, request, *args, **kwargs):
        username = request.GET.get('username')
        albums = list(Album.objects.filter(made_favorite_album_by_user__username=username).values())
        return JsonResponse({"albums": albums})
    
class FavoriteMusicsView(View):
    def get(self, request, *args, **kwargs):
        username = request.GET.get('username')
        musics = list(Music.objects.filter(made_favorite_song_by_user__username=username).values())
        return JsonResponse({"musics": musics})
    
class ArtistSuggestionsView(View):
    def get(self, request, *args, **kwargs):
        username = request.GET.get('username')
        artists = list(Artist.objects.filter(genre__genre_users__username = username).exclude(made_favorite_artist_by_user__username = username).values())
        return JsonResponse({"artists": artists})  

class AlbumSuggestionsView(View):
    def get(self, request, *args, **kwargs):
        username = request.GET.get('username')
        albums = list(Album.objects.filter(genre__genre_users__username = username).exclude(made_favorite_album_by_user__username = username).values())
        return JsonResponse({"albums": albums})
    
class MusicSuggestionsView(View):
    def get(self, request, *args, **kwargs):
        username = request.GET.get('username')
        musics = list(Music.objects.filter(genre__genre_users__username = username).exclude(made_favorite_song_by_user__username = username).values())
        return JsonResponse({"musics": musics})
    
class GenreSuggestionsView(View):
    def get(self, request, *args, **kwargs):
        genres = list(Genre.objects.all().values().order_by("id"))
        return JsonResponse({"genres": genres})
    
class EditProfileView(View):
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        username = data.get('username')
        info = data.get('info')
        user = User.objects.filter(username=username).first()
        user.username = username
        user.info = info
        user.save()
        return JsonResponse({"user": user})
    
class AddFavArtistView(View):
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        username = data.get('username')
        artist_ids = data.get('artists', [])
        user = User.objects.filter(username=username).first()
        artists = Artist.objects.filter(id__in=artist_ids)
        for artist in artists:
            user.favorite_artists.add(artist)
        artist_list = [{"id": artist.id, "name": artist.username} for artist in artists]
        return JsonResponse({"artists": artist_list})

class RemoveFavArtistView(View):
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        username = data.get('username')
        artist_ids = data.get('artists', [])
        user = User.objects.filter(username=username).first()
        artists = Artist.objects.filter(id__in=artist_ids)
        for artist in artists:
            user.favorite_artists.remove(artist)
        artist_list = [{"id": artist.id, "name": artist.username} for artist in artists]
        return JsonResponse({"artists": artist_list})

class IsFavArtistView(View):
    def get(self, request, *args, **kwargs):
        username = request.GET.get("username")
        artist_id = request.GET.get("artist_id")
        artist = list(Artist.objects.filter(id=artist_id, made_favorite_artist_by_user__username=username).values())
        return JsonResponse({"artist": artist})

class AddFavAlbumView(View):
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        username = data.get('username')
        album_ids = data.get('albums', [])
        user = User.objects.filter(username=username).first()
        albums = Album.objects.filter(id__in=album_ids)
        for album in albums:
            user.favorite_albums.add(album)
        return JsonResponse({"albums": list(albums.values())})

class RemoveFavAlbumView(View):
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        username = data.get('username')
        album_ids = data.get('albums', [])
        user = User.objects.filter(username=username).first()
        albums = Album.objects.filter(id__in=album_ids)
        for album in albums:
            user.favorite_albums.remove(album)
        return JsonResponse({"albums": list(albums.values())})
    
class IsFavAlbumView(View):
    def get(self, request, *args, **kwargs):
        username = request.GET.get("username")
        album_id = request.GET.get("album_id")
        album = list(Album.objects.filter(id=album_id, made_favorite_album_by_user__username=username).values())
        return JsonResponse({"album": album})
    
class AddFavSongView(View):
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        username = data.get('username')
        music_ids = data.get('musics', []) 
        user = User.objects.filter(username=username).first()
        musics = Music.objects.filter(id__in=music_ids)
        for music in musics:
            user.favorite_songs.add(music)
        return JsonResponse({"musics": list(musics.values())})

class RemoveFavSongView(View):
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        username = data.get('username')
        music_ids = data.get('musics', [])
        user = User.objects.filter(username=username).first()
        musics = Music.objects.filter(id__in=music_ids)
        for music in musics:
            user.favorite_songs.remove(music)
        return JsonResponse({"musics": list(musics.values())})

    
class IsFavSongView(View):
    def get(self, request, *args, **kwargs):
        username = request.GET.get("username")
        music_id = request.GET.get("music_id")
        music = list(Music.objects.filter(id=music_id, made_favorite_song_by_user__username=username).values())
        return JsonResponse({"music": music})
    
class CreateCollectionView(View):
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        username = data.get('username')
        image = data.get('image')
        user = User.objects.filter(username=username).first()

        if user:
            collection_name = data.get("collection_name")
            collection = Collection(name=collection_name, owner=user, image=image)
            collection.save()
            collection.owned_by_users.add(user)
            return JsonResponse({"collection": collection.id})
        else:
            return JsonResponse({"error": "User not found"}, status=404)
        
class DeleteCollectionView(View):
    def delete(self, request, *args, **kwargs):
        data = json.loads(request.body)
        username = data.get('username')
        collection_ids = data.get("collections", [])
        collections = Collection.objects.filter(id__in=collection_ids, owned_by_users__username=username)

        if not collections.exists():
            return JsonResponse({"error": "No collections found for the given IDs and username."}, status=404)
        collection_data = {
            "name": collections[0].name,
            "image": collections[0].image,
            "owner_id": collections[0].owned_by_users.first().id,  
        }
        for collection in collections:
            collection.delete()
        return JsonResponse({"collection": collection_data})


class AddSongToCollectionView(View):
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        username = data.get('username')
        collection_ids = data.get("collections", [])
        music_ids = data.get('musics', [])
        musics = Music.objects.filter(id__in=music_ids)
        collections = Collection.objects.filter(id__in=collection_ids, owned_by_users__username = username)
        for collection in collections:
            for music in musics:
                collection.musics.add(music)
        return JsonResponse({"collections": list(collections.values())})
    
class RemoveSongFromCollectionView(View):
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        username = data.get('username')
        collection_ids = data.get("collections", [])
        music_ids = data.get('musics', [])
        musics = Music.objects.filter(id__in=music_ids)
        collections = Collection.objects.filter(id__in=collection_ids, owned_by_users__username = username)
        for collection in collections:
            for music in musics:
                collection.musics.remove(music)
        return JsonResponse({"collections": list(collections.values())})

class AllCollectionsView(View):
    def get(self, request, *args, **kwargs):
        username = request.GET.get("username")
        collections = list(Collection.objects.filter(owned_by_users__username = username).values())
        return JsonResponse({"collections": collections})

class AddSavedAlbumView(View):
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        username = data.get('username')
        user = User.objects.filter(username=username).first()
        album_ids = data.get('albums', [])
        albums = Album.objects.filter(id__in=album_ids)
        for album in albums:
            user.saved_albums.add(album)
        return JsonResponse({"albums": list(albums.values())})

class RemoveSavedAlbumView(View):
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        username = data.get('username')
        user = User.objects.filter(username=username).first()
        album_ids = data.get('albums', [])
        albums = Album.objects.filter(id__in=album_ids)
        for album in albums:
            user.saved_albums.remove(album)
        return JsonResponse({"album": list(albums.values())})
    
class IsSavedAlbumView(View):
    def get(self, request, *args, **kwargs):
        username = request.GET.get("username")
        album_id = request.GET.get("album_id")
        album = list(Album.objects.filter(id=album_id, saved_by_users__username=username).values())
        return JsonResponse({"album": album})
  
class AllSavedAlbumsView(View):
    def get(self, request):
        username = request.GET.get("username")
        albums = list(Album.objects.filter(saved_by_users__username = username).values())
        return JsonResponse({"albums": albums})

class CreatePlaylistView(View):
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        username = data.get('username')
        image = data.get('image')
        user = User.objects.filter(username=username).first()
        if user:
            playlist_name = data.get("playlist_name")
            playlist = Playlist(name=playlist_name, owner=user, image=image)
            playlist.save()
            playlist.created_by_users.add(user)
            return JsonResponse({"playlist": playlist.id})
        else:
            return JsonResponse({"error": "User not found"}, status=404)

class DeletePlaylistView(View):
    def delete(self, request, *args, **kwargs):
        data = json.loads(request.body)
        username = data.get('username')
        playlist_ids = data.get("playlists", [])
        playlists = Playlist.objects.filter(id__in=playlist_ids, created_by_users__username=username)
        if not playlists.exists():
            return JsonResponse({"error": "No playlists found for the given IDs and username."}, status=404)
        playlist_data = {
            "name": playlists[0].name,
            "image": playlists[0].image,
            "owner_id": playlists[0].created_by_users.first().id,  
        }
        for playlist in playlists:
            playlist.delete()
        return JsonResponse({"collection": playlist_data})
    
class AllPlaylistsView(View):
    def get(self, request, *args, **kwargs):
        username = request.GET.get("username")
        playlists = list(Playlist.objects.filter(created_by_users__username = username).values())
        return JsonResponse({"playlists": playlists})

class AddSongToPlaylistView(View):
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        username = data.get('username')
        playlist_ids = data.get("playlists", [])
        music_ids = data.get('musics', [])
        musics = Music.objects.filter(id__in=music_ids)
        playlists = Playlist.objects.filter(id__in=playlist_ids, created_by_users__username = username)
        for playlist in playlists:
            for music in musics:
                playlist.musics.add(music)
        return JsonResponse({"playlists": list(playlists.values())})

class RemoveSongFromPlaylistView(View):
     def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        username = data.get('username')
        playlist_ids = data.get("playlists", [])
        music_ids = data.get('musics', [])
        musics = Music.objects.filter(id__in=music_ids)
        playlists = Playlist.objects.filter(id__in=playlist_ids, created_by_users__username = username)
        for playlist in playlists:
            for music in musics:
                playlist.musics.remove(music)
        return JsonResponse({"playlist": list(playlists.values())})


class CreateSingleView(View):
    def post(self, request, *args, **kwargs):
        music_name = request.POST.get("music_name")
        music_artist = request.POST.get("music_artist")
        mood = request.POST.get("mood")
        genre_id = request.POST.get("genre")
        duration = request.POST.get("duration")
        image = request.POST.get("image")  
        audio = request.POST.get("audio")  
        lyrics = request.FILES.get("lyrics") 
        artist = Artist.objects.filter(username=music_artist).first()
        genre = Genre.objects.filter(id=genre_id).first()
        music = Music(name=music_name, artist=artist, image=image, audio=audio, mood=mood, genre=genre, lyrics=lyrics, play_time=int(float(duration)), is_single = True)
        music.save()
        return JsonResponse({"music": music.id})


class DeleteSingleView(View):
    def delete(self, request, *args, **kwargs):
        data = json.loads(request.body)
        music_ids = data.get("musics",[])
        musics = Music.objects.filter(id__in =music_ids)
        for music in musics:  
            music.delete()
        return JsonResponse({"music": list(musics.values())})

class CreateAlbumView(View):
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        album_name = data.get("album_name")
        album_artist = data.get("album_artist")
        album_image = data.get("album_image")
        album_genre = data.get("album_genre")
        print(album_genre)
        genre = Genre.objects.filter(id=album_genre).first()
        print(genre)
        artist = Artist.objects.filter(username = album_artist).first()
        album = Album(name=album_name, artist=artist, image=album_image, genre= genre)
        album.save()
        print(album.id)
        return JsonResponse({'album': album.id})

class DeleteAlbumView(View):
    def delete(self, request, *args, **kwargs):
        data = json.loads(request.body)
        album_ids = data.get("albums")
        albums = Album.objects.filter(id__in=album_ids)
        for album in albums:
            album.delete()
        return JsonResponse({"album": list(albums.values())})

class AddSongToAlbumView(View):
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        album_id = data.get("album_id")
        music_ids = data.get('musics', [])
        musics = Music.objects.filter(id__in=music_ids)
        album = Album.objects.filter(id=album_id).first()
        for music in musics:
            album.musics.add(music)
        return JsonResponse({"album": album.id})

class RemoveSongFromAlbumView(View):
    def delete(self, request, *args, **kwargs):
        data = json.loads(request.body)
        album_id = data.get("album_id")
        music_ids = data.get('musics', [])
        musics = Music.objects.filter(id__in=music_ids)
        album = Album.objects.filter(id=album_id).first()
        for music in musics:
            album.album_musics.remove(music)
            music.delete()
        album_data = {
            "name": album.name,
            "id": album.id
        }
        return JsonResponse({"album": album_data})

class CreateEventView(View):
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        event_name = data.get("event_name")
        event_artist_name = data.get("artist")
        event_location = data.get("location")
        event_date = data.get("date")
        event_image = data.get("image")
        
        event_artist = Artist.objects.filter(username=event_artist_name).first()
        if not event_artist:
            return JsonResponse({"error": "Artist not found"}, status=404)
        
        event = Event(
            name=event_name, 
            artist=event_artist, 
            location=event_location, 
            date=event_date, 
            image=event_image, 
            is_live_event=False
        )
        event.save()
        
        event_data = {
            "name": event.name,
            "artist": event.artist.username if event.artist else None,
            "location": event.location,
            "date": event.date,
            "image": event.image
        }
        
        return JsonResponse({"event": event_data})

    
class DeleteEventView(View):
    def delete(self, request,*args, **kwargs):
        data = json.loads(request.body)
        event_ids = data.get("events", [])
        events = Event.objects.filter(id__in = event_ids)
        for event in events:
            event.delete()
        return JsonResponse({'event': list(events.values())})

class CreateLiveEventView(View):
    def post(self, request,*args, **kwargs):
        data = json.loads(request.body)
        live_event_name = data.get("event_name")
        live_event_artist_name = data.get("artist")
        event_link = data.get("link")
        event_date = data.get("date")
        event_info = data.get("info")
        event_image = data.get("image")
        live_event_artist = Artist.objects.filter(username = live_event_artist_name).first()
        live_event = Event(name=live_event_name, artist=live_event_artist, location="none", link = event_link, date= event_date, is_live_event=True, info = event_info, image = event_image)
        live_event.save()
        live_event_data = {
            "name": live_event.name,
            "artist": live_event.artist.username if live_event.artist else None,
            "info": live_event.info,
            "location": live_event.link,
            "date": live_event.date,
            "image": live_event.image,
            "is_live_event": True,
        }
        return JsonResponse({"live": live_event_data})

class DeleteLiveEventView(View):
    def delete(self, request, *args, **kwargs):
        data = json.loads(request.body)
        event_ids = data.get("events")
        live_events = Event.objects.filter(id__in =event_ids, is_live_event=True)
        for live_event in live_events:
            live_event.delete()
        return JsonResponse({"live": list(live_event.values())})

class CreatedSinglesView(View):
    def get(self, request, *args, **kwargs):
        username = request.GET.get( "username")
        musics = list(Music.objects.filter(artist__username = username, is_single = True).values())
        return JsonResponse({"musics": musics})

class CreatedAlbumsView(View):
    def get(self, request, *args, **kwargs):
        username = request.GET.get( "username")
        albums = list(Album.objects.filter(artist__username = username).values())
        return JsonResponse({"albums": albums})
        
class CreatedEventsView(View):
    def get(self, request, *args, **kwargs):
        username = request.GET.get( "username")
        events = list(Event.objects.filter(artist__username = username, is_live_event= False).values().order_by("id"))
        return JsonResponse({"events": events})
        
class CreatedLiveEventsView(View):
    def get(self, request, *args, **kwargs):
        username = request.GET.get( "username")
        live = list(Event.objects.filter(artist__username = username, is_live_event= True).values().order_by("id"))
        return JsonResponse({"live": live})
    
class CollectionMusicsView(View):
    def get(self, request, *args, **kwargs):
       collection_id = request.GET.get("collection_id")
       collection = Collection.objects.filter(id=collection_id).first()
       musics = list(collection.musics.values())
       return JsonResponse({"musics": musics})
    
class PlaylistMusicsView(View):
    def get(self, request, *args, **kwargs):
       playlist_id = request.GET.get("playlist_id")
       playlist = Playlist.objects.filter(id=playlist_id).first()
       musics = list(playlist.musics.values())
       return JsonResponse({"musics": musics})
   
class IsSavedMusicView(View):
    def get(self, request, *args, **kwargs):
        music_id = request.GET.get("music_id")
        collection = Collection.objects.filter(musics__id = music_id).values()
        playlist = Playlist.objects.filter(musics__id = music_id).values()
        if collection:
            musics = list(Music.objects.filter(id= music_id).values())
        elif playlist:
            musics = list(Music.objects.filter(id= music_id).values())
        else:
            musics = ""
        return JsonResponse({"musics": musics})
    

class CollectionsContainsMusicView(View):
    def get(self, request, *args, **kwargs):
        music_id = request.GET.get("music_id")
        music = Music.objects.filter(id=music_id).first()
        if music:
            collections_contains = list(Collection.objects.filter(musics__id=music.id).values())
            return JsonResponse({"collections": collections_contains})
        return JsonResponse({"error": "Music not found"}, status=404)

class CollectionsNotContainsMusicView(View):
    def get(self, request, *args, **kwargs):
        music_id = request.GET.get("music_id")
        music = Music.objects.filter(id=music_id).first()
        if music:
            collections_not_contains = list(Collection.objects.exclude(musics__id=music.id).values())
            return JsonResponse({"collections": collections_not_contains})
        return JsonResponse({"error": "Music not found"}, status=404)

class PlaylistContainsMusicView(View):
    def get(self, request, *args, **kwargs):
        music_id = request.GET.get("music_id")
        music = Music.objects.filter(id=music_id).first()
        if music:
            playlists_contains = list(Playlist.objects.filter(musics__id=music.id).values())
            return JsonResponse({"playlists": playlists_contains})
        return JsonResponse({"error": "Music not found"}, status=404)

class PlaylistNotContainsMusicView(View):
    def get(self, request, *args, **kwargs):
        music_id = request.GET.get("music_id")
        music = Music.objects.filter(id=music_id).first()
        if music:
            playlists_not_contains = list(Playlist.objects.exclude(musics__id=music.id).values())
            return JsonResponse({"playlists": playlists_not_contains})
        return JsonResponse({"error": "Music not found"}, status=404)

class EditProfileView(View):
    def post(self, request,*args, **kwargs):
        data = json.loads(request.body)
        username = data.get("username") 
        new_image = data.get("new_image")
        new_info = data.get("new_info")
        user = User.objects.filter(username = username).first()
        user.image = new_image
        user.info = new_info
        user.save()
        user_data = {
            "username": user.username,
            "info": user.info,
            "image": user.image,
        }
        return JsonResponse({"user": user_data})
    
class CollectionByIdView(View):
    def get(self, request, *args, **kwargs):
        collection_id = request.GET.get("collection_id")
        collections =  list(Collection.objects.filter(id = collection_id).values())
        return JsonResponse({"collections":collections})
        
class PlaylistByIdView(View):
    def get(self, request, *args, **kwargs):
        playlist_id = request.GET.get("playlist_id")
        playlists = list(Playlist.objects.filter(id = playlist_id).values())
        return JsonResponse({"playlists": playlists})

class MusicSuggestionsCollectionView(View):
    def get(self, request, *args, **kwargs):
        username = request.GET.get("username")
        user = User.objects.filter(username=username).first()
        favorite_genres = user.favorite_genres.all()
        musics = list(Music.objects.filter(genre__in=favorite_genres).values())
        print(musics)
        return JsonResponse({"musics": musics})

class MusicSuggestionsPlaylistView(View):
    def get(self, request, *args, **kwargs):
        username = request.GET.get("username")
        user = User.objects.filter(username=username).first()
        favorite_genres = user.favorite_genres.all()
        musics = list(Music.objects.filter(genre__in=favorite_genres).values())
        return JsonResponse({"musics": musics})

class CreateAlbumMusicView(View):
    def post(self, request, *args, **kwargs):
        music_name = request.POST.get("music_name")
        music_artist = request.POST.get("music_artist")
        mood = request.POST.get("mood")
        genre_id = request.POST.get("genre")
        duration = request.POST.get("duration")
        image = request.POST.get("image")  
        audio = request.POST.get("audio")  
        lyrics = request.FILES.get("lyrics") 
        album_id = request.POST.get("album")
        print(album_id)
        artist = Artist.objects.filter(username=music_artist).first()
        genre = Genre.objects.filter(id=genre_id).first()
        album = Album.objects.filter(id=album_id).first()
        music = Music(name=music_name, artist=artist, image=image, audio=audio, mood=mood, genre=genre, lyrics=lyrics, play_time=int(float(duration)), is_single = False, album = album)
        music.save()
        return JsonResponse({"music": music.id})