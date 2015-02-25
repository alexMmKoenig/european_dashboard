var i = 0,
    duration = 400,
    root;

var tree = d3.layout.tree()
    .nodeSize([0, 29]);
  
var root = indicators[0];

    root.x0 = 0;
    root.y0 = 0;

    root.children.forEach(collapse);
    update(root);

function collapse(d) {
    if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
    }
};

function update(source) {

    nodes = tree.nodes(root);

    height3 = Math.max(100, nodes.length * barHeight + margin.top);

    d3.select("#indicator-tree").selectAll("svg").transition()
        .duration(duration)
        .attr("height", height3);


    d3.select(self.frameElement)
        .transition()
        .duration(duration)
        .style("height", height3 + "px");

    nodes.forEach(function(n, i) {
        n.x = i * barHeight +15;
    });

    var node = svg3.selectAll("g.node")
        .data(nodes, function(d) { return d.id || (d.id = ++i); });

    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; });

    // indicators enter
    var indicatorEnter = nodeEnter.append("g")
        .attr("class", "indicatorEnter")
        .on("click", makeDataStructure);

    indicatorEnter.append("text")
        //.attr("transform", "translate(-18, 0)")
        .attr("dy", 3.5)
        .attr("dx",  function(d) {return -source.y0-25} )
        .attr("fill", colorName)
        .text(function(d) { if (d.indicator) {return d.indicator} });

    // names enter
    var nameEnter = nodeEnter.append("g")
        .attr("class", "nameEnter")
        .on("mouseover", description)
        .on("click", click);

    nameEnter.append("rect")
        .attr("id", function(d) {return d.indicator})
        .attr("y", -barHeight / 2)
        .attr("height", barHeight-2)
        .attr("width", barWidth)
        .attr("fill", color);
   
    nameEnter.append("text")
        .attr("id", "nameEnter")
        .attr("dy", 3.5)
        .attr("dx", 5.5)
        .attr("fill", colorName)
        .text(function(d) {return d.name} );

    // Transition nodes to their new position.
    node.transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
        .select("rect");

    // Transition exiting nodes to the parent's new position.
    node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
        .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}

// Toggle children on click.
function click(d) {
  
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } 

    else {
        d.children = d._children;
        d._children = null;
    }
  
    update(d);
    svg3.selectAll("#nameEnter").attr("fill", colorName);
}


function color(d) {
  if (d.state != true) {return d._children ? "#c6dbef" : d.children ? "none" : "none"}
  else {return d._children ? "#c6dbef" : d.children ? "none" : "none"};
}

function colorName(d) {
  if (d.state != true) {return d._children ? "black" : d.children ? "black" : "black"}
  else {return d._children ? "red" : d.children ? "red" : "red"};
}