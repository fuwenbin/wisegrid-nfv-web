"""wisegridnfv URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin

urlpatterns = [
#    url(r'^admin/', include(admin.site.urls)),
     url(r'^$','functions.views.overview',name="index"),  
     url(r'^loadbalance','functions.views.loadbalance',name="loadbalance"),
     url(r'^firewall','functions.views.firewall',name="firewall"),
     url(r'^waf','functions.views.waf',name="waf"),
     url(r'^anti','functions.views.anti',name="anti"),
     url(r'^audi','functions.views.audi',name="auti"),
     url(r'^ips','functions.views.ips',name="ips"),
     url(r'^config','systemconfig.views.config',name="config"),
     url(r'^layer2','network.views.layer2',name="layer2"),
     url(r'^topology/$','network.views.topology',name="topology"),
     url(r'^topologies/nodes/$','network.views.nodes',name="nodes"),
     url(r'^topologies/links/$','network.views.links',name="links"),
     url(r'^topology_map/$','network.views.maptopology',name="topologymap"),
     url(r'^layer3','network.views.layer3',name="layer3"),
]
