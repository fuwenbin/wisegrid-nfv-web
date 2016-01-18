var CONF = {
    image: {
        width: 50,
        height: 40
    },
    force: {
        width: 960,
        height: 500,
        dist: 60,
        sdist:60,
        charge: -700
    }
};

// var ws = new WebSocket("ws://" + location.host + "/v1.0/topology/ws");
// ws.onmessage = function(event) {
//     var data = JSON.parse(event.data);

//     var result = rpc[data.method](data.params);

//     var ret = {"id": data.id, "jsonrpc": "2.0", "result": result};
//     this.send(JSON.stringify(ret));
// }

function trim_zero(obj) {
    return String(obj).replace(/^0+/, "");
}

function dpid_to_int(dpid) {
    return Number("0x" + dpid);
}

var elem = {
    force: d3.layout.force()
        .size([CONF.force.width, CONF.force.height])
        .gravity(0.05)
        .charge(CONF.force.charge)
        .linkDistance(function(d){
            if(d.target.type=='device'&& d.source.type=="device"){
                 return CONF.force.dist+60;
            }else{
                return CONF.force.dist-20;
            }
        }),
        //.on("tick", _tick),
    outer_group: d3.select("#svg1")
        .attr("width", CONF.force.width)
        .attr("height", CONF.force.height)
        .attr('pointer-events','all')
        .append('g'),
    console: d3.select("body").append("div")
        .attr("id", "console")
        .attr("width", CONF.force.width),
    zoom:d3.behavior.zoom()
};
elem.outer_group.append('rect')
    .attr('width','100%')
    .attr('height','100%')
    .attr('fill','white')
    .on('click',function(){
        if($('.topologyBalloon')) {
            $('.topologyBalloon').remove();
            self.force.start();
        }
    });
elem.vis = elem.outer_group.append('g');
function _tick() {
    elem.vis.selectAll(".link").attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    elem.vis.selectAll(".node").attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    elem.vis.selectAll(".port").attr("transform", function(d) {
        var p = topo.get_port_point(d);
        return "translate(" + p.x + "," + p.y + ")";
    });
  //添加设备区域背景
    elem.vis.selectAll("path.hulls")
        .data(topo.convex_hulls(elem.vis.selectAll(".node").data()))
        .enter().insert('path')
        .attr('class','hulls')
        .attr('pointer-events','all')
        .style('fill',function(d){
            return self.fill(d.group);
        })
        .attr('d',function(d){
            return self.curve(d.path);
        })
        .style("stroke",function(d){
            return self.fill(d.group);
        })
        .style('stroke-linejoin','round')
        .style('stroke-width',10)
        .style('opacity',0.2);
}
//elem.drag = elem.force.drag().on("dragend", _dragstart);
function _dragstart(d) {
    var dpid = dpid_to_int(d.dpid)
    //d3.json("/stats/flow/" + dpid, function(e, data) {
    //    flows = data[dpid];
    //    console.log(flows);
    //    elem.console.selectAll("ul").remove();
    //    li = elem.console.append("ul")
    //        .selectAll("li");
    //    li.data(flows).enter().append("li")
    //        .text(function (d) { return JSON.stringify(d, null, " "); });
    //});
    //d3.select(this).classed("fixed", d.fixed = true);
    elem.draged = true;
}
elem.update = function () {
    self = this
    self.curve = d3.svg.line().interpolate('cardinal-closed').tension(0.85);
    self.fill = d3.scale.category10();
    this.force
        .nodes(topo.nodes)
        .links(topo.links)
        .on('tick',function() {
            elem.vis.selectAll(".link")
                .attr("x1", function(d) {
                    return d.source.x;
                })
                .attr("y1", function(d) {
                    return d.source.y;
                })
                .attr("x2", function(d) {
                    return d.target.x;
                })
                .attr("y2", function(d) { return d.target.y; });
            elem.vis.selectAll(".node").attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
            elem.vis.selectAll(".port").attr("transform", function(d) {
                var p = topo.get_port_point(d);
                return "translate(" + p.x + "," + p.y + ")";
            });
          //添加设备区域背景
            elem.vis.selectAll("path.hulls")
                .data(topo.convex_hulls(elem.vis.selectAll(".node").data()))
                .attr('d',function(d){
                    return self.curve(d.path);
                })
                .enter().insert('path','g')
                .attr('class','hulls')
                .style('fill',function(d){
                    return self.fill(d.group);
                })
                .style("stroke",function(d){
                    return self.fill(d.group);
                })
                .style('stroke-linejoin','round')
                .style('stroke-width',10)
                .style('opacity',0.2);
        });
        //.start();
    self.link =  elem.vis.selectAll(".link").data(topo.links);
    self.link.exit().remove();
    self.link.enter().append("line")
        .attr("class", "link");

    self.node =  elem.vis.selectAll(".node").data(topo.nodes);
    self.node.exit().remove();
    var nodeEnter = self.node.enter().append("g")
        .attr("class", "node")
        .call(this.force.drag);
    nodeEnter.append("image")
        .attr("xlink:href", function(d){
            if(d.type=="server"){
                return "/static/img/laptop1.svg"
            }else if(d.type=="device"){
                 return "/static/img/switch.svg"
            }
        })
        .attr("x", -CONF.image.width/2)
        .attr("y", -CONF.image.height/2)
        .attr("width", CONF.image.width)
        .attr("height", CONF.image.height);

    nodeEnter.on("click",function(d){
        if($('.topologyBalloon')) {
            $('.topologyBalloon').remove();
        }
        var x = d.px+CONF.image.width;
        var y = d.py;
        var styleVal = "left:"+x+"px;top:"+y+"px;"+"display:block;";
        var html = $("#balloonTemplate ").html();
        $('#svgContainer').append(html);
        $('#svgContainer #instance-1').attr('style',styleVal);
        $('#instance-1 .closeTopologyBalloon').on('click',function(e){
            $('#instance-1').remove();
            self.force.start();
        });
        self.force.stop();
    });

    nodeEnter.append("text")
        .attr("dx", -CONF.image.width/2)
        .attr("dy", CONF.image.height-10)
        .text(function(d) { return "dpid: " + trim_zero(d.dpid); });
    var ports = topo.get_ports();
    elem.vis.selectAll(".port").remove();
    var portEnter =elem.vis.selectAll(".port").data(ports).enter().append("g")
        .attr("class", "port");
    portEnter.append("circle")
        .attr("r", 8);
    portEnter.append("text")
        .attr("dx", -3)
        .attr("dy", 3)
        .text(function(d) { return trim_zero(d.port_no); });

    var i=0;
    this.force.start();
    while(i<=100){
        this.force.tick();
        i++;
    }
};

function is_valid_link(link) {
    return (link.src.dpid < link.dst.dpid)
}

var topo = {
    nodes: [],
    links: [],
    node_index: {}, // dpid -> index of nodes array
    load_layer_1:function(){

    },
    load_layer_2:function(){

    },
    new_node:function(){

    },
    new_line:function(){

    },
    initialize: function (data) {
        this.add_nodes(data.switches);
        this.add_links(data.links);
    },
    add_nodes: function (nodes) {
        for (var i = 0; i < nodes.length; i++) {
            var link_nodes = [];
            nodes[i].link_nodes = link_nodes;
            this.nodes.push(nodes[i]);
        }
        this.refresh_node_index();
    },

    add_links: function (links) {
        for (var i = 0; i < links.length; i++) {
            if (!is_valid_link(links[i])) continue;
            console.log("add link: " + JSON.stringify(links[i]));

            var src_dpid = links[i].src.dpid;
            var dst_dpid = links[i].dst.dpid;
            var src_index = this.node_index[src_dpid];
            var dst_index = this.node_index[dst_dpid];
            var link = {
                source: src_index,
                target: dst_index,
                port: {
                    src: links[i].src,
                    dst: links[i].dst
                }
            }
            this.links.push(link);
            this.nodes[src_index].link_nodes.push(dst_index);
            this.nodes[dst_index].link_nodes.push(src_index);
        }
    },
    delete_nodes: function (nodes) {
        for (var i = 0; i < nodes.length; i++) {
            console.log("delete switch: " + JSON.stringify(nodes[i]));

            node_index = this.get_node_index(nodes[i]);
            this.nodes.splice(node_index, 1);
        }
        this.refresh_node_index();
    },
    delete_links: function (links) {
        for (var i = 0; i < links.length; i++) {
            if (!is_valid_link(links[i])) continue;
            console.log("delete link: " + JSON.stringify(links[i]));

            link_index = this.get_link_index(links[i]);
            this.links.splice(link_index, 1);
        }
    },
    get_node_index: function (node) {
        for (var i = 0; i < this.nodes.length; i++) {
            if (node.dpid == this.nodes[i].dpid) {
                return i;
            }
        }
        return null;
    },
    get_link_index: function (link) {
        for (var i = 0; i < this.links.length; i++) {
            if (link.src.dpid == this.links[i].port.src.dpid &&
                    link.src.port_no == this.links[i].port.src.port_no &&
                    link.dst.dpid == this.links[i].port.dst.dpid &&
                    link.dst.port_no == this.links[i].port.dst.port_no) {
                return i;
            }
        }
        return null;
    },
    get_ports: function () {
        var ports = [];
        var pushed = {};
        for (var i = 0; i < this.links.length; i++) {
            function _push(p, dir) {
                key = p.dpid + ":" + p.port_no;
                if (key in pushed) {
                    return 0;
                }

                pushed[key] = true;
                p.link_idx = i;
                p.link_dir = dir;
                return ports.push(p);
            }
            _push(this.links[i].port.src, "source");
            _push(this.links[i].port.dst, "target");
        }

        return ports;
    },
    get_port_point: function (d) {
        var weight = 0.88;

        var link = this.links[d.link_idx];
        var x1 = link.source.x;
        var y1 = link.source.y;
        var x2 = link.target.x;
        var y2 = link.target.y;

        if (d.link_dir == "target") weight = 1.0 - weight;

        var x = x1 * weight + x2 * (1.0 - weight);
        var y = y1 * weight + y2 * (1.0 - weight);

        return {x: x, y: y};
    },
    refresh_node_index: function(){
        this.node_index = {};
        for (var i = 0; i < this.nodes.length; i++) {
            this.node_index[this.nodes[i].dpid] = i;
        }
    },
    convex_hulls:function(nodes){
        var net,_i,len,_ref,_h,i;
        var hulls = {};
        var networkids = {};
        var k = 0;
        var offset = 40;
        while(k<nodes.length){
            var n = nodes[k];
            if(n!==undefined){
                if(n.type=='server') {
                    for (node_index in n.link_nodes) {
                        var val = n.link_nodes[node_index];
                        if (nodes[val].type == 'device') {
                            _h = hulls[nodes[val].dpid] || (hulls[nodes[val].dpid] = []);
                            _h.push([n.x - offset, n.y - offset]);
                            _h.push([n.x - offset, n.y + offset]);
                            _h.push([n.x + offset, n.y - offset]);
                            _h.push([n.x + offset, n.y + offset]);
                        }
                    }
                }else if(n.type=='device'){
                     _h=hulls[n.dpid] || (hulls[n.dpid]=[]);
                    _h.push([n.x-offset, n.y-offset]);
                    _h.push([n.x-offset, n.y+offset]);
                    _h.push([n.x+offset, n.y-offset]);
                    _h.push([n.x+offset, n.y+offset]);
                }
            }
            ++k;
        }
        var hullset = [];
        for(i in hulls){
            if({}.hasOwnProperty.call(hulls,i)){
                hullset.push({group:i,path:d3.geom.hull(hulls[i])});
            }
        }
        return hullset;
    }

}

var rpc = {
    event_switch_enter: function (params) {
        var switches = [];
        for(var i=0; i < params.length; i++){
            switches.push({"dpid":params[i].dpid,"ports":params[i].ports});
        }
        topo.add_nodes(switches);
        elem.update();
        return "";
    },
    event_switch_leave: function (params) {
        var switches = [];
        for(var i=0; i < params.length; i++){
            switches.push({"dpid":params[i].dpid,"ports":params[i].ports});
        }
        topo.delete_nodes(switches);
        elem.update();
        return "";
    },
    event_link_add: function (links) {
        topo.add_links(links);
        elem.update();
        return "";
    },
    event_link_delete: function (links) {
        topo.delete_links(links);
        elem.update();
        return "";
    },
}

function initialize_b1() {
    d3.json("/topogoly?type=nodes", function(error, switches) {
        d3.json("/topogoly?type=links", function(error, links) {
            topo.initialize({switches: switches, links: links});
            elem.update();
        });
    });
}
function initialize_topology1(){
    d3.json("/topologies/nodes/", function(error, switches) {
        d3.json("/topologies/links/", function(error, links) {
            topo.initialize({switches: switches, links: links});
            elem.update();
        });
    });
}

function main() {
    initialize_topology1();
}

main();