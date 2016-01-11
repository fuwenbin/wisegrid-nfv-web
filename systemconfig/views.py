from django.shortcuts import render
from django.shortcuts import render_to_response
from django.template import RequestContext

# Create your views here.


def config(request):
    node = 2
    return render_to_response('overview.html',locals(),context_instance=RequestContext(request))