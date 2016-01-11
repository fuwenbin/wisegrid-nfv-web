function main() {
    var nodes = [ { name: "b1-device1" }, { name: "b1-device2" }, { name: "b1-device3" } ];
    var edges = [ { source : 0 , target: 1 } , { source : 1 , target: 2 }];
    var force = d3.layout.force()
      .nodes(nodes) //指定节点数组
      .links(edges) //指定连线数组
      .size([960,280]) //指定作用域范围
      .linkDistance(100) //指定连线长度
      .charge([-2000]); //相互之间的作用力
    force.start();
    var svg =   d3.select("#svg1")
                .attr("width", 960)
                .attr("height", 280);
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
     .attr("r",20)
     .style("fill",function(d,i){
         return color(i);
     })
     .call(force.drag);  //使得节点能够拖动
     svg_nodes.on('dblclick',function(d){
        $('#iframe').attr('src',"");
        $('#iframe').attr('src',"/topology_map/");
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

}

main();