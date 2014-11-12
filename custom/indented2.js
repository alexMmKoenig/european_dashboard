var i = 0,
    duration = 400,
    root;

var tree = d3.layout.tree()
    .nodeSize([0, 30]);
  
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

  d3.select(self.frameElement)
    .transition()
    .duration(duration)
    .style("height", height + "px");

  nodes.forEach(function(n, i) {
    n.x = i * barHeight +20;
  });

  var node = svg3.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; });

      // indicators enter
  var indicatorEnter = nodeEnter.append("g")
      .attr("class", "indicatorEnter")
      .on("click", dlick);

  indicatorEnter.append("text")
      .attr("transform", "translate(-18, 0)")
      .attr("dy", 3.5)
      .attr("dx", -5.5)
      .text(function(d) { if (d.indicator) {return d.indicator} });

      // names enter
  var nameEnter = nodeEnter.append("g")
      .attr("class", "nameEnter")
      .on("click", click)
      .on("mouseover", description);

  nameEnter.append("rect")
      .attr("id", function(d) {return d.indicator})
      .attr("y", -barHeight / 2)
      .attr("height", barHeight)
      .attr("width", barWidth)
      .attr("fill", color);
   
  nameEnter.append("text")
      .attr("dy", 3.5)
      .attr("dx", 5.5)
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
}

function description(d) { 

    var heading = d.name;
    var description = d.description;

    $( "h4.panel-title" ).replaceWith( "<h4 class = panel-title>"+ heading+"</h4>" );
    $( ".panel-body" ).replaceWith( "<div class = panel-body>"+ description+"</div>" );
  
}

function changeState(d){
  
  if (d.state === false){
    d.state = true;
    d.group = currentGroup;
  }

  else if (d.state === true){
    d.state = false;
    //d.group = false;
  }
}

function pushActives(d) {

  if (d.state === true) {

    activeIndicators.push(d.indicator);
    activeNames.push(d.name);

    //addGroup();
    active[currentGroup].child.push({indicator: d.indicator});
  }

  else {

    activeIndicators.splice(activeIndicators.indexOf(d.indicator),1);
    activeNames.splice(activeNames.indexOf(d.name),1);

    active[d.group].child.splice(active[currentGroup].child.indexOf(d.indicator),1);

  }
}

function dlick(d) {
  
  changeState(d);

  pushActives(d);

  drawChart();

}


function color(d) {
  return d._children ? "#c6dbef" : d.children ? "white" : "white";
}