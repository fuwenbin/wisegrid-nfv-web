from django.shortcuts import render
from django.shortcuts import render_to_response,HttpResponse
from django.template import RequestContext
import json
import logging
logger = logging.getLogger("hello:")
def topology(request):
	node = 3 
	logger.debug("enter the topogoly")
	return render_to_response('netoverview.html',locals(),context_instance=RequestContext(request))
def nodes(request):
	nodes  = [{"ports":[{"hw_addr":"aa:07:b8:b7:e3:0b","name":"s1-eth1","port_no":"1","dpid":"01"},
	    		{"hw_addr":"86:93:1e:bf:de:c1","name":"s1-eth2","port_no":"2","dpid":"01"}],"dpid":"01"},
	    		{"ports":[{"hw_addr":"22:0d:8b:31:35:87","name":"s2-eth1","port_no":"1","dpid":"02"},
	    		{"hw_addr":"76:65:a0:d6:02:06","name":"s2-eth2","port_no":"2","dpid":"02"},
	    		{"hw_addr":"9a:d1:e2:d3:b0:21","name":"s2-eth3","port_no":"3","dpid":"02"}],"dpid":"02"},
	    		{"ports":[{"hw_addr":"8e:7e:18:45:72:0d","name":"s3-eth1","port_no":"1","dpid":"03"},
	    		{"hw_addr":"f2:38:74:16:78:fd","name":"s3-eth2","port_no":"2","dpid":"03"},
	    		{"hw_addr":"a6:39:1a:10:65:4f","name":"s3-eth3","port_no":"3","dpid":"03"}],"dpid":"03"},
	    		{"ports":[{"hw_addr":"12:3a:bb:71:c3:b6","name":"s4-eth1","port_no":"1","dpid":"04"},
	    		{"hw_addr":"12:61:eb:98:43:f0","name":"s4-eth2","port_no":"2","dpid":"04"},
	    		{"hw_addr":"72:9b:9e:38:27:c1","name":"s4-eth3","port_no":"3","dpid":"04"}],"dpid":"04"},
	    		{"ports":[{"hw_addr":"0a:c6:54:3b:00:95","name":"s5-eth1","port_no":"1","dpid":"05"},
	    		{"hw_addr":"12:c3:c9:73:56:00","name":"s5-eth2","port_no":"2","dpid":"05"},
	    		{"hw_addr":"92:84:84:b3:7b:27","name":"s5-eth3","port_no":"3","dpid":"05"}],"dpid":"05"},
	    		{"ports":[{"hw_addr":"f2:b7:8f:a1:19:de","name":"s6-eth1","port_no":"1","dpid":"06"},
	    		{"hw_addr":"5a:0b:91:e8:31:39","name":"s6-eth2","port_no":"2","dpid":"06"},
	    		{"hw_addr":"4e:50:f2:64:fd:ac","name":"s6-eth3","port_no":"3","dpid":"06"}],"dpid":"06"},
	    		{"ports":[{"hw_addr":"be:78:8d:2a:b5:68","name":"s7-eth1","port_no":"1","dpid":"07"},
	    		{"hw_addr":"86:bf:d5:4d:1e:11","name":"s7-eth2","port_no":"2","dpid":"07"},
	    		{"hw_addr":"de:be:72:83:5e:9d","name":"s7-eth3","port_no":"3","dpid":"07"}],"dpid":"07"}]
	return HttpResponse(json.dumps(nodes))


def links(request):
	links = [{"src":{"hw_addr":"a6:39:1a:10:65:4f","name":"s3-eth3","port_no":"3","dpid":"03"},"dst":{"hw_addr":"22:0d:8b:31:35:87","name":"s2-eth1","port_no":"1","dpid":"02"}},
	            {"src":{"hw_addr":"0a:c6:54:3b:00:95","name":"s5-eth1","port_no":"1","dpid":"05"},"dst":{"hw_addr":"4e:50:f2:64:fd:ac","name":"s6-eth3","port_no":"3","dpid":"06"}},
	            {"src":{"hw_addr":"72:9b:9e:38:27:c1","name":"s4-eth3","port_no":"3","dpid":"04"},"dst":{"hw_addr":"76:65:a0:d6:02:06","name":"s2-eth2","port_no":"2","dpid":"02"}},
	            {"src":{"hw_addr":"de:be:72:83:5e:9d","name":"s7-eth3","port_no":"3","dpid":"07"},"dst":{"hw_addr":"12:c3:c9:73:56:00","name":"s5-eth2","port_no":"2","dpid":"05"}},
	            {"src":{"hw_addr":"22:0d:8b:31:35:87","name":"s2-eth1","port_no":"1","dpid":"02"},"dst":{"hw_addr":"a6:39:1a:10:65:4f","name":"s3-eth3","port_no":"3","dpid":"03"}},
	            {"src":{"hw_addr":"76:65:a0:d6:02:06","name":"s2-eth2","port_no":"2","dpid":"02"},"dst":{"hw_addr":"72:9b:9e:38:27:c1","name":"s4-eth3","port_no":"3","dpid":"04"}},
	            {"src":{"hw_addr":"9a:d1:e2:d3:b0:21","name":"s2-eth3","port_no":"3","dpid":"02"},"dst":{"hw_addr":"aa:07:b8:b7:e3:0b","name":"s1-eth1","port_no":"1","dpid":"01"}},
	            {"src":{"hw_addr":"12:c3:c9:73:56:00","name":"s5-eth2","port_no":"2","dpid":"05"},"dst":{"hw_addr":"de:be:72:83:5e:9d","name":"s7-eth3","port_no":"3","dpid":"07"}},
	            {"src":{"hw_addr":"86:93:1e:bf:de:c1","name":"s1-eth2","port_no":"2","dpid":"01"},"dst":{"hw_addr":"92:84:84:b3:7b:27","name":"s5-eth3","port_no":"3","dpid":"05"}},
	            {"src":{"hw_addr":"4e:50:f2:64:fd:ac","name":"s6-eth3","port_no":"3","dpid":"06"},"dst":{"hw_addr":"0a:c6:54:3b:00:95","name":"s5-eth1","port_no":"1","dpid":"05"}},
	            {"src":{"hw_addr":"92:84:84:b3:7b:27","name":"s5-eth3","port_no":"3","dpid":"05"},"dst":{"hw_addr":"86:93:1e:bf:de:c1","name":"s1-eth2","port_no":"2","dpid":"01"}},
	            {"src":{"hw_addr":"aa:07:b8:b7:e3:0b","name":"s1-eth1","port_no":"1","dpid":"01"},"dst":{"hw_addr":"9a:d1:e2:d3:b0:21","name":"s2-eth3","port_no":"3","dpid":"02"}}]
	return HttpResponse(json.dumps(links))

def b1device(request):
	b1data = [{'name':'b1_test1'},{'name':'b1_test1'},{'name':'b1_test1'}]
	return b1data

def maptopology(request):

	return render_to_response('nettopology.html',locals(),context_instance=RequestContext(request))

def layer2(request):
	node = 3
	return render_to_response('overview.html',locals(),context_instance=RequestContext(request))

def layer3(request):
	node = 3
	return render_to_response('overview.html',locals(),context_instance=RequestContext(request))