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
        charge: -400
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

function is_valid_link(link) {
    return (link.src.dpid < link.dst.dpid)
}

var topo = {
     force: d3.layout.force()
        .size([CONF.force.width, CONF.force.height])
        .gravity(0.05)
        .charge(CONF.force.charge)
        .linkDistance(function(d){
            if(d.target.type=='server'|| d.source.type=='server'){
                 return CONF.force.dist;
            }else{
                return CONF.force.dist+60;
            }
            return CONF.force.dist;
        }),
    svg: d3.select("#svg1")
        .attr("width", '100%')
        .attr("height", CONF.force.height)
        .attr('pointer-events','all'),
    zoom:d3.behavior.zoom(),
    nodes: [],
    links: [],
    data_loaded:false,
    node_index: {}, // dpid -> index of nodes array
    init: function () {
        var self = this;
        $('#toggle_labels').on('click', function (e) {
            self.clear_canvas();
            self.load_layer_1();
            self.hide_back_btn();
        });
        $('#instances__action_launch').on('click', function (e) {
            e.preventDefault();
        });
        $('#networks__action_create').on('click', function (e) {
             e.preventDefault();
        });
        $('#Routers__action_create').on('click', function (e) {
             e.preventDefault();
        });

    },
    clear_canvas:function(){
        var self = this;
        self.nodes = [];
        self.links = [];
        self.delete_balloon();
        d3.select('#svg1').remove();
    },
    show_balloon: function (d) {
        var self = this;
        var offsetx = CONF.image.width;
        var offsety = 70;
        var devicePostion = self.get_ScreenCoord(d.px, d.py);
        var styleVal = "left:"+ (devicePostion.x+offsetx)+"px;top:"+ (devicePostion.y+offsety)+"px;"+"display:block;";
        var html = $("#balloonTemplate ").html();
        $('#svgContainer').append(html);
        $('#svgContainer #instance-1').attr('style',styleVal);
        $('#instance-1 .closeTopologyBalloon').on('click',function(e){
            self.delete_balloon();
        });
        self.force.stop();
    },
    delete_balloon:function(){
        if($('.topologyBalloon')) {
            $('.topologyBalloon').remove();
            this.force.start();
        }
    },
    load_layer_1:function(){
        var self  = this;
        var nodes = [ { name: "b1-device1" }, { name: "b1-device2" }, { name: "b1-device3" } ];
        var edges = [ { source : 0 , target: 1 } , { source : 1 , target: 2 }];
        var force = self.force
          .nodes(nodes) //指定节点数组
          .links(edges) //指定连线数组
        force.start();
       var svg = d3.select("#svgContainer").append('svg')
           .attr('id','svg1')
        .attr("width", '100%')
        .attr("height", CONF.force.height)
        .attr('pointer-events','all');

        $('.title').text('物理设备拓扑图');
        $('.description').text('双击设备进入进入设备拓扑图展示。');
        //添加连线
        var svg_edges = svg.selectAll("line")
         .data(edges)
         .enter()
         .append("line")
         .style("stroke","#ccc")
         .style("stroke-width",1)

        var color = d3.scale.category20();

     //添加节点
        var svg_nodes = svg.selectAll("circle")
         .data(nodes)
         .enter()
         .append("circle")
         .attr("r",30)
         .style("fill",function(d,i){
             return color(i);
         })
         .call(force.drag);  //使得节点能够拖动
         svg_nodes.on('dblclick',function(d){
             self.clear_canvas();
             self.load_layer_2();
         })
     //添加描述节点的文字
        var svg_texts = svg.selectAll("text")
         .data(nodes)
         .enter()
         .append("text")
         .style("fill", "black")
         .attr("dx", 20)
         .attr("dy", 8)
         .text(function(d){
            return d.name;
         });
        force.on("tick", function(){ //对于每一个时间间隔
            //更新连线坐标
            svg_edges.attr("x1",function(d){ return d.source.x; })
                .attr("y1",function(d){ return d.source.y; })
                .attr("x2",function(d){ return d.target.x; })
                .attr("y2",function(d){ return d.target.y; });
            //更新节点坐标
            svg_nodes.attr("cx",function(d){ return d.x; })
                .attr("cy",function(d){ return d.y; });
            //更新文字坐标
            svg_texts.attr("x", function(d){ return d.x; })
               .attr("y", function(d){ return d.y; });
        });
    },
    init_layer_2:function(){
        var self = this;
        self.outer_group = d3.select("#svgContainer").append('svg')
           .attr('id','svg1')
            .attr("width", '100%')
            .attr("height", CONF.force.height)
            .attr('pointer-events','all')
            .append('g')
            .call(self.zoom
                .scaleExtent([0.1,1.5])
                .on('zoom',function(){
                self.delete_balloon();
                self.vis.attr('transform','translate('+d3.event.translate+')scale('+self.zoom.scale()+')');
                self.translate=d3.event.translate;
            })
            )
            .on('dblclick.zoom',null);
        $('.title').text('虚拟网络拓扑图');
        $('.description').text('在拓扑图上上下滚动你的鼠标/触控板来调整画布大小。在拓扑图空白处点击并拖拽来移动浏览。');
        self.outer_group.append('rect')
            .attr('width','100%')
            .attr('height','100%')
            .attr('fill','white')
            .on('click',function(){
                self.delete_balloon();
            });
        self.vis = self.outer_group.append('g');
    },
    force_direction: function () {
        var self = this
        self.curve = d3.svg.line().interpolate('cardinal-closed').tension(0.85);
        self.fill = d3.scale.category10();
        self.force
            .nodes(self.nodes)
            .links(self.links)
            .on('tick',function() {
                self.vis.selectAll("line.link")
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
                self.vis.selectAll("g.node").attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });
                self.vis.selectAll(".port").attr("transform", function(d) {
                    var p = self.get_port_point(d);
                    return "translate(" + p.x + "," + p.y + ")";
                });
              //添加设备区域背景
                self.vis.selectAll("path.hulls")
                    .data(self.convex_hulls(self.vis.selectAll(".node").data()))
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
    },
    new_nodes:function(){
        var self = this;
        var node =  self.vis.selectAll("g.node").data(self.nodes);
        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("fill",'white')
            .call(self.force.drag);

        nodeEnter.append("image")
            .attr("xlink:href", function(d){
                if(d.type=="server"){
                    return "/static/img/laptop1.svg"
                }else if(d.type=="router"){
                    return "/static/img/switch.svg"
                }else if(d.type=='network'){
                    return '/static/img/skype6.svg'
                }else if(d.type == 'public'){
                    return "/static/img/network1.svg"
                }
            })
            .attr("x", -CONF.image.width/2)
            .attr("y", -CONF.image.height/2)
            .style('fill','white')
            .style('stroke','black')
            .attr("width", CONF.image.width)
            .attr("height", CONF.image.height);


        nodeEnter.on("click",function(d){
            if($('.topologyBalloon')) {
                $('.topologyBalloon').remove();
            }
            self.show_balloon(d);
        });
        nodeEnter.on('mouseover',function(d){
           self.vis.selectAll('line.link').filter(function(z){
               if(z.source.dpid=== d.dpid|| z.target.dpid=== d.dpid){
                   return true;
               }else{
                   return false;
               }
           }).style('stroke-width','3px');
        });
        nodeEnter.on('mouseout',function(d){
            self.vis.selectAll('line.link').style('stroke-width','1px');
        });
        nodeEnter.append("text")
            .attr("dx", -CONF.image.width/2)
            .attr("dy", CONF.image.height-10)
            .style('fill','black')
            .text(function(d) { return d.name });

    },
    new_links:function(){
        var self = this;
        var line =  self.vis.selectAll("line.link").data(self.links);
        line.enter().insert("line",'g.node')
        .attr("class", "link")
        //.attr('x1',function(d){d.source.x;})
        //.attr('y1',function(d){d.source.y;})
        //.attr('x2',function(d){d.target.x;})
        //.attr('y2',function(d){d.target.y;})
        .style('stroke','black')
        .style('stroke-width',2);
    },
    new_ports:function(){
        var self = this;
        var ports = self.get_ports();
        var portEnter =self.vis.selectAll("g.port").data(ports).enter().append("g")
            .attr("class", "port");
        portEnter.append("circle")
            .attr("r", 8);
        portEnter.append("text")
            .attr("dx", -3)
            .attr("dy", 3)
            .text(function(d) { return trim_zero(d.port_no); });

        },
    loading:function(){
        var self = this;
        var load_text = self.vis.append('text')
            .style('fill','black')
            .style('font-size','40')
            .attr('x','50%')
            .attr('y','50%')
            .text('');
        var counter = 0;
        var timer = setInterval(function(){
            var i;
            var str = '';
            for (i=0;i<=counter;i++){
                str+='.';
            }
            load_text.text(str);
            if(counter>=9){
                counter = 0;
            }else{
                counter++;
            }
            if(self.data_loaded){
                clearInterval(timer);
                load_text.remove();
            }
        },100);
    },
    load_data:function(){
        var self = this;
        d3.json("/topologies/nodes/", function(error, switches) {
        d3.json("/topologies/links/", function(error, links) {
            self.data_loaded = true;
            var data = {switches: switches, links: links};
            self.handle_node_data(data.switches);
            self.new_nodes();
            self.handle_link_data(data.links);
            self.new_links();
            //self.new_ports();
            var i = 0;
            self.force.start();
            while(i<=100){
                self.force.tick();
                i++;
            }


            });
        });
    },

    load_layer_2: function (data) {
        var self = this;
        self.init_layer_2();
        self.force_direction();
        self.loading();
        self.load_data();
        self.show_back_btn();
        //this.add_nodes(data.switches);
        //this.add_links(data.links);
    },
    handle_node_data: function (nodes) {
        var self = this;
        for (var i = 0; i < nodes.length; i++) {
            var link_nodes = [];
            nodes[i].link_nodes = link_nodes;
            self.nodes.push(nodes[i]);
            self.node_index[nodes[i].dpid] = i;
        }
    },
    handle_link_data: function (links) {
        var self = this;
        for (var i = 0; i < links.length; i++) {
            if (!is_valid_link(links[i])) continue;
            console.log("add link: " + JSON.stringify(links[i]));

            var src_dpid = links[i].src.dpid;
            var dst_dpid = links[i].dst.dpid;
            var src_index = self.node_index[src_dpid];
            var dst_index = self.node_index[dst_dpid];
            var link = {
                source: src_index,
                target: dst_index,
                port: {
                    src: links[i].src,
                    dst: links[i].dst
                }
            }
            self.links.push(link);
            self.nodes[src_index].link_nodes.push(dst_index);
            self.nodes[dst_index].link_nodes.push(src_index);
        }
    },
    find_by_id:function(id){
        var self=this;
        var obj,_i,_len,_ref;
        _ref = self.vis.selectAll('g.node').data();
        for(_i=0,_len=_ref.length;_i<_len;_i++){
            obj = _ref[_i];
            if(obj.dpid==id){
                return obj;
            }
        }
        return undefined;
    },
    show_back_btn:function(){
        $('.layer-2').show();
    },
    hide_back_btn:function(){
        $('.layer-2').hide();
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
    get_ScreenCoord:function(x,y){
        var self = this;
        if(self.translate){
            var xn = self.translate[0] + x * self.zoom.scale();
            var yn = self.translate[1] + y * self.zoom.scale();
            return {x:xn,y:yn};
        }else{
            return {x:x,y:y};
        }
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
        var offset = 30;
        while(k<nodes.length){
            var n = nodes[k];
            if(n!==undefined){
                if(n.type=='server') {
                    for (node_index in n.link_nodes) {
                        var val = n.link_nodes[node_index];
                        if (nodes[val].type == 'network') {
                            _h = hulls[nodes[val].dpid] || (hulls[nodes[val].dpid] = []);
                            _h.push([n.x - offset, n.y - offset]);
                            _h.push([n.x - offset, n.y + offset]);
                            _h.push([n.x + offset, n.y - offset]);
                            _h.push([n.x + offset, n.y + offset]);
                        }
                    }
                }else if(n.type=='network'){
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
    topo.init();
    topo.load_layer_1();
    //initialize_topology1();
}

main();