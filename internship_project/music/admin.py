from django.contrib import admin

# Register your models here
from .models import Genre, Artist, Album, Music, Collection, Event, Listener, Playlist, User

admin.site.register(Genre)
admin.site.register(Artist)
admin.site.register(Album)
admin.site.register(Music)
admin.site.register(Collection)
admin.site.register(Event)
admin.site.register(Listener)
admin.site.register(Playlist)
admin.site.register(User)
