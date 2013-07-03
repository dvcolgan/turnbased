from django.conf.urls import patterns, include, url
from django.conf import settings
from rest_framework.generics import *
from game.models import *
from game.views import *

urlpatterns = patterns('game.views',
    url(r'^$', 'home', name='home'),

    url(r'^api/account/$', ListCreateAPIView.as_view(serializer_class=AccountSerializer, model=Account), name='api-account'),
    url(r'^api/account/(?P<pk>\d+)/$', RetrieveAPIView.as_view(serializer_class=AccountSerializer, model=Account), name='api-account'),
    url(r'^api/account/exists/username/(?P<username>.+)/$', 'api_username_existence', name='api-username-existence'),
    url(r'^api/account/exists/email/(?P<email>.+)/$', 'api_email_existence', name='api-email-existence'),

    url(r'^partials/(?P<template_file>[a-z-]+.html)/$', 'partials', name='partials'),

    url(r'^api/game/$',
        ListCreateAPIView.as_view(
            serializer_class=GameSerializer,
            model=Game
        ),
        name='api-game'
    ),

    url(r'^api/game/(?P<pk>\d+)/$',
        RetrieveUpdateDestroyAPIView.as_view(
            serializer_class=GameSerializer,
            model=Game
        ),
        name='api-game'
    ),

    url(r'^api/player/$',
        ListCreateAPIView.as_view(
            serializer_class=PlayerSerializer,
            model=Player
        ),
        name='api-player'
    ),

    url(r'^api/player/(?P<pk>\d+)/$',
        RetrieveUpdateDestroyAPIView.as_view(
            serializer_class=PlayerSerializer,
            model=Player
        ),
        name='api-player'
    ),

    url(r'^api/game/(?P<pk>\d+)/players/$', GamePlayersListAPIView.as_view(), name='api-players'),
)
