d3.select("#plus").on("click", addGroup);
d3.select("#minus").on("click", subtractGroup);
d3.select("circle").on("click", selectGroup);
subGroups();

function addGroup() {

	activeSubgroups.push(activeSubgroups[activeSubgroups.length-1]+1);

	subGroups();
	currentGroup = activeSubgroups.length-1;
	activate(currentGroup);

	active.push({
		subgroup: activeSubgroups.length,
		child: []
	})
}

function subtractGroup() {

	if (activeSubgroups != 1){
		activeSubgroups.pop();
		active.pop();
	}

	subGroups();

	currentGroup = activeSubgroups.length-1;
	activate(currentGroup);
	
	drawChart();
}

function subGroups(){

	var circle = svg4.selectAll("circle")
	.data(activeSubgroups);

	circle.enter().append("circle")
		.attr("id", function(d) {return "circle"+(d-1)})
		.attr("number", function(d) {return (d-1)})
		.attr("fill", "white")
		.attr("stroke", "black")
		.attr("cy", function(d){return d*22})
		.attr("cx", 20)
		.attr("r", 10)

	circle.exit().remove();
}

function selectGroup(){

	
}

function activate(vnum){
	//currentGroup = vnum;
	svg4.selectAll("circle").attr("fill", "white");
	svg4.select("#circle"+vnum).attr("fill", "#219A55");
}

function goChart(d){
  
  if (d.state === false){
    d.state = true;
    d.group = currentGroup;
    active[currentGroup].child.push({indicator: d.indicator, name: d.name});
  }

  else if (d.state === true){
    d.state = false;
    active[d.group].child.splice(active[d.group].child.indexOf(d.indicator),1);
    //d.group = false;
  }

  drawChart();
 
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