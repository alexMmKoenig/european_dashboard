d3.select("#plus").on("click", addGroup);
d3.select("#minus").on("click", subtractGroup);
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

	//currentGroup = 1;

	subGroups();
	//activate(currentGroup);
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
		.on("click", activate(this.number));

	circle.exit().remove();
}

function activate(vnum){

	currentGroup = vnum;
	svg4.selectAll("circle").attr("fill", "white");

	svg4.select("#circle"+currentGroup).attr("fill", "#219A55");


}

