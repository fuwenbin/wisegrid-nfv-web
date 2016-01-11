# coding:utf8
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse

# Create your views here.


def index(request):
    
    if not request.user.is_authenticated():
        return HttpResponseRedirect(reverse('login'))
    else:
        return HttpResponseRedirect(reverse('servers_list'))
    
def overview(request):
    
    return render_to_response('overview.html', locals(), context_instance=RequestContext(request))
    

def loadbalance(request):
	node = 1
	return render_to_response('overview.html', locals(), context_instance=RequestContext(request))

def firewall(request):
    node = 1
    return render_to_response('overview.html', locals(), context_instance=RequestContext(request))

def waf(request):
	node = 1
	return render_to_response('overview.html', locals(), context_instance=RequestContext(request))

def anti(request):
    node = 1
    return render_to_response('overview.html', locals(), context_instance=RequestContext(request))

def audi(request):
    node = 1
    return render_to_response('overview.html', locals(), context_instance=RequestContext(request))

def ips(request):
    node = 1
    return render_to_response('overview.html', locals(), context_instance=RequestContext(request))