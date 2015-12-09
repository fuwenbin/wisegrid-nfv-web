from django.shortcuts import render
from django.shortcuts import render_to_response
from django.template import RequestContext
# Create your views here.


def topogoly(request):
    node = 3
    page = 1
    
    return render_to_response('netoverview.html',locals(),context_instance=RequestContext(request))