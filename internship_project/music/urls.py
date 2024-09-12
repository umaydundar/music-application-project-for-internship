from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from music.views import*

from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = [
    #general page views
    path('', LoginView.as_view(), name='login'),
    path('home/', HomeView.as_view(), name='home'),
    path('display/', DisplayView.as_view(), name = 'display'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('collections/', CollectionsView.as_view(), name='collections'),
    path('music_selector/', MusicSelectorView.as_view(), name='music_selector'),
    path('music_search/', MusicSearchView.as_view(), name='music_search'),
    path('music_play_album/', MusicPlayAlbumView.as_view(), name='music_play_album'),
    path('music_play_song/', MusicPlaySongView.as_view(), name='music_play_song'),
    path('create/', CreateView.as_view(), name='create'),
    path('music_genre/', MusicGenreView.as_view(), name="music_genre"),
    path('artist_profile/', ArtistProfileView.as_view(), name="artist_profile"),
    path('events/', EventsView.as_view(), name="events"),
    path('live/', LiveView.as_view(), name="live"),
    path('user_profile/', UserProfileView.as_view(), name="user_profile"),
    path('top_artists/', TopArtistsView.as_view(), name="top_artists"),
    path('recommendations/', RecommendationsView.as_view(), name="recommendations"),
    path('recently_played/', RecentlyPlayedMusicView.as_view(), name="recently_played"),
    path('musics/', MusicsView.as_view(), name="musics"),
    path('albums/', AlbumsView.as_view(), name="albums"),
    path('artist/', ArtistView.as_view(), name="artist"),
    path('artist_albums/', ArtistAlbumsView.as_view(), name="artist_albums"),
    path('artist_musics/', ArtistMusicsView.as_view(), name="artist_musics"),
    path('all_events/', AllEventsView.as_view(), name="all_events"),
    path('top_events/', TopArtistEventsView.as_view(), name="top-events"),
    path('fav_events/', FavoriteArtistEventsView.as_view(), name="fav_events"),
    path('fav_artists/', FavoriteArtistsView.as_view(), name="fav_artists"),
    path('all_live_events/', AllLiveEventsView.as_view(), name="all_live_events"),
    path('top_live_events/', TopArtistLiveEventsView.as_view(), name="top_live_events"),
    path('fav_live_events/', FavoriteArtistLiveEventsView.as_view(), name="fav_live_events"),
    path('login_user/', LoginUserView.as_view(), name="login_user"),
    path('signup_user/',SignupUserView.as_view(), name="signup_user"),
    path('change_password_user/', ChangeUserPasswordView.as_view(), name="change_password_user"),
    path('genre/', GenreView.as_view(), name="genre"),
    path('genre_artists/', GenreArtistsView.as_view(), name="genre_artists"),
    path('genre_albums/', GenreAlbumsView.as_view(), name="genre_albums"),
    path('genre_musics/', GenreMusicsView.as_view(), name="genre_musics"),
    path('album/', AlbumView.as_view(), name="album"),
    path('album_musics/', AlbumMusicsView.as_view(), name="album_musics"),
    path('song/', SongView.as_view(), name="song"),
    path('lyrics/', LyricsView.as_view(), name="lyrics"),
    path('search_genre/', SearchGenreView.as_view(), name="search_genre"),
    path('search_artist/', SearchArtistView.as_view(), name="search_artist"),
    path('search_album/', SearchAlbumView.as_view(), name="search_album"),
    path('search_music/', SearchMusicView.as_view(), name="search_music"),
    path('mood_music/', MoodMusicView.as_view(), name="mood_music"),
    path('fav_albums/', FavoriteAlbumsView.as_view(), name="fav_albums"),
    path('fav_musics/', FavoriteMusicsView.as_view(), name="fav_musics"),
    path('artist_suggestions/', ArtistSuggestionsView.as_view(), name="artist_suggestion"),
    path('album_suggestions/', AlbumSuggestionsView.as_view(), name="album_suggestion"),
    path('music_suggestions/', MusicSuggestionsView.as_view(), name="music_suggestions"),
    path('genre_suggestions/', GenreSuggestionsView.as_view(), name="genre_suggestions"),
    path('edit_profile/', EditProfileView.as_view(), name="edit_profile"),
    path('add_fav_artist/', AddFavArtistView.as_view(), name="add_fav_artist"),
    path('remove_fav_artist/', RemoveFavArtistView.as_view(), name="remove_fav_artist"),
    path('is_fav_artist/', IsFavArtistView.as_view(), name="is_fav_artist"),
    path('add_fav_album/', AddFavAlbumView.as_view(), name="add_fav_album"),
    path('remove_fav_album/', RemoveFavAlbumView.as_view(), name="remove_fav_album"),
    path('is_fav_album/', IsFavAlbumView.as_view(), name="is_fav_album"),
    path('add_fav_song/', AddFavSongView.as_view(), name="add_fav_song"),
    path('remove_fav_song/', RemoveFavSongView.as_view(), name="remove_fav_song"),
    path('is_fav_song/', IsFavSongView.as_view(), name="is_fav_song"),
    path('create_collection/', CreateCollectionView.as_view(), name="create_collection"),
    path('delete_collection/', DeleteCollectionView.as_view(), name="delete_collection"),
    path('add_song_to_collection/', AddSongToCollectionView.as_view(), name="add_song_to_collection"),
    path('remove_song_from_collection/', RemoveSongFromCollectionView.as_view(), name="remove_song_from_collection"),
    path('all_collections/', AllCollectionsView.as_view(), name="all_collections"),
    path('add_saved_album/', AddSavedAlbumView.as_view(), name="add_saved_album"),
    path('remove_saved_album/', RemoveSavedAlbumView.as_view(), name="remove_saved_album"),
    path('all_saved_albums/', AllSavedAlbumsView.as_view(), name="all_saved_albums"),
    path('create_playlist/', CreatePlaylistView.as_view(), name="create_playlist"),
    path('delete_playlist/', DeletePlaylistView.as_view(), name="delete_playlist"),
    path('all_playlists/', AllPlaylistsView.as_view(), name="all_playlists"),
    path('add_song_to_playlist/', AddSongToPlaylistView.as_view(), name="add_song_to_playlist"),
    path('remove_song_from_playlist/', RemoveSongFromPlaylistView.as_view(), name="remove_song_from_playlist"),
    path('create_single/', CreateSingleView.as_view(), name="create_single"),
    path('delete_single/', DeleteSingleView.as_view(), name="delete_single"),
    path('create_album/', CreateAlbumView.as_view(), name="create_album"),
    path('delete_album/', DeleteAlbumView.as_view(), name="delete_album"),
    path('add_song_to_album/', AddSongToAlbumView.as_view(), name="add_song_to_album"),
    path('remove_song_from_album/', RemoveSongFromAlbumView.as_view(), name="remove_song_from_album"),
    path('create_event/', CreateEventView.as_view(), name="create_event_view"),
    path('delete_event/', DeleteEventView.as_view(), name="delete_event_view"),
    path('create_live_event/', CreateLiveEventView.as_view(), name="create_live_event_view"),
    path('delete_live_event/', DeleteLiveEventView.as_view(), name="delete_live_event_view"),
    path('created_singles/', CreatedSinglesView.as_view(), name="created_singles"),
    path('created_albums/', CreatedAlbumsView.as_view(), name="created_albums"),
    path('created_events/', CreatedEventsView.as_view(), name="created_events"),
    path('created_live_events/', CreatedLiveEventsView.as_view(), name="created_live_events"),
    path('collection_musics/', CollectionMusicsView.as_view(), name="collection_musics"),
    path('playlist_musics/', PlaylistMusicsView.as_view(), name="playlist_musics"), 
    path('is_saved_album/', IsSavedAlbumView.as_view(), name="is_saved_album"),
    path('is_saved_music/', IsSavedMusicView.as_view(), name="is_saved_music"),
    path('collection_contains_music/', CollectionsContainsMusicView.as_view(), name="collection_contains_music"),
    path('collection_not_contains_music/', CollectionsNotContainsMusicView.as_view(), name="collection_not_contains_music"),
    path('playlist_contains_music/', PlaylistContainsMusicView.as_view(), name="playlist_contains_music"),
    path('playlist_not_contains_music/', PlaylistNotContainsMusicView.as_view(), name="playlist_not_contains_music"),
    path('music_suggestions_collection/', MusicSuggestionsCollectionView.as_view(), name="music_suggestions_collection"),
    path('music_suggestions_playlist/', MusicSuggestionsPlaylistView.as_view(), name="music_suggestions_playlist"),
    path('edit_profile/', EditProfileView.as_view(), name="edit_profile"),
    path('collection_by_id/', CollectionByIdView.as_view(), name="collection_by_id"),
    path('playlist_by_id/', PlaylistByIdView.as_view(), name="playlist_by_id"),
    path('create_album_music/', CreateAlbumMusicView.as_view(), name="create_album_music"),
]
   
urlpatterns += staticfiles_urlpatterns()

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
