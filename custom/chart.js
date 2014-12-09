// global

var farbe = [["#648888","#64FD88","#538045", "#34723F"], ["#FC8888","#6489FE","#B0A474"], ["#648864","#FA89FD","#F13610"], ["#F13610"]];
//var farbe = [["#648888","#C5D1D1","#2D6060"], ["#FFB0B0","#FC8888","#FFD5D5"], ["#64FD88","#CDFFD8","#91FEA9"], ["#F13610"]];
//var farbe = [["#2E9896","#C5D1D1","#2D6060"], ["#FFB0B0", "#FC8888", "#B0A474"], ["#EF982E","#99982E","#FFD5D5"], ["#64FD88","#CDFFD8","#91FEA9"], ["#F13610"]];


var activeCountry = "Germany";

var activeSubgroups = [1];
var currentGroup = "0";
var active =[{subgroup:1, child: [{indicator:"B1GM", name:"GDP"}]}];

subGroups(activeSubgroups);
drawChart(activeCountry, active, activeSubgroups);

d3.select("#plus").on("click", addGroup);
d3.select("#minus").on("click", subtractGroup);
//d3.select(".circle").on("click", selectGroup);

 
function drawChart(activeCountry, active, activeSubgroups){

var countryIndex = findIndexByKeyValue(data, "country", activeCountry);

    goData(activeCountry, active, countryIndex);

    axis(activeSubgroups);
    
    barchart();
    
    label(activeCountry);
    legendIndicators(active);
    
}

function goData(activeCountry, active, countryIndex){

var indicatorList = [];

    for (var i=0; i < data[countryIndex].child[0].values.length; i++){
        indicatorList.push(data[countryIndex].child[0].values[i].indicator);
    }

    data1 = data[countryIndex].child;

    data1.forEach(function(d,i){

        d.xaz = active.map(function(l,m){
            var y0 = 0;
            temp = active[m].child;
            
            return {
                subgroup: l.subgroup,
                child: temp.map(function(s,z){
                    //console.log(i,m,z)
                    return {
                    subgroup: l.subgroup,
                    indicator: s.indicator,
                    name: s.name,
                    val: data1[i].values[indicatorList.indexOf(s.indicator)].val,
                    y0: y0,
                    y1: y0 += +data1[i].values[indicatorList.indexOf(s.indicator)].val
                    }
                })
            }
        })
        d.maximum = [];
        for (a = 0; a < d.xaz.length; a++){
            if (d.xaz[a].child.length > 0) {d.maximum.push(d.xaz[a].child[0].val);}
        }
        d.aximum = d3.max(d.maximum);
    })
}

function barchart(){

// bar grouping per year
    var barGroup = d3.select("#barArea").selectAll(".barGroup")
        .data(data1);

    barGroup.enter().append("g");
    barGroup.exit().remove();
    
    barGroup
      .attr("class","barGroup")
      .attr("id", function(d) { return d.year; })
      .attr("transform", function(d) { return "translate(" + x(d.year) + ",0)"; })
      .attr("width", x.rangeBand());

// bars grouping per subgroup
    var barSubGroup = barGroup.selectAll(".subbars")
        .data( function(d) { return d.xaz; });

    barSubGroup.enter().append("g");
    barSubGroup.exit().remove();
    
    barSubGroup.attr("class", "subbars");

// bars stacking
    var barStack = barSubGroup.selectAll("rect")
        .data( function(d) { return d.child; });
    
    barStack.enter().append("rect");
    barStack.exit().remove();
 
    barStack.transition().duration(500)
        
        .attr("x", function(d) { if (d.y0 < d.y1) {return x1(d.subgroup);} else {return x1(d.subgroup-1);} })
        .attr("width", x1.rangeBand())
        .attr("height", function(d) { if (d.y0 < d.y1) {return y(d.y0) - y(d.y1);} else {return y(d.y1) - y(d.y0);} })
        .attr("y", function(d) { if (d.y0 < d.y1) {return y(d.y1);} else {return y(d.y0)} })
        .style("fill", function(d,i) { return farbe[(d.subgroup-1)][i]; });

}

function legendIndicators(active){
    
    boot = active.map(function(d,i){
        
        memp = d.child;
        return memp.map(function(s,z){
            return s.name
        });
    });
    var info = d3.select("#legend").selectAll("text")
        .data(boot);
   
    info.enter().append("text");
   
    info.exit().remove();
    
    info.text(function(d) { return d })
        .attr("y", function(d, i) { return 10+i*12})
        .style("font-size", "12")
        .style("fill", function(d,i) { return farbe[i][0]; })
        .style("letter-spacing", 1.5);
}

function axis(activeSubgroups){

    max = d3.max(data1, function(d,i) { return d.aximum });

    x = d3.scale.ordinal()
        .domain(data1.map(function(d,i) { return d.year; }))
        .rangeBands([0, w], .2, .1);

    x1 = d3.scale.ordinal()
        .domain(activeSubgroups)
        .rangeBands([0, x.rangeBand()], .2, .1);

    y = d3.scale.linear()
        .domain([max, 0])
        .range([0, h]);
    
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("top");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("right")
        .ticks(10)
        .tickFormat(d3.format(".2s"));

    d3.select("#yaxis")
      .transition().duration(500).ease("sin-in-out")
      .call(yAxis);

    d3.select("#xaxis")
      .call(xAxis);
}

function label(activeCountry){
       
    var label = d3.select("#label").selectAll("text")
        .data(activeCountry[0]);
   
    label.enter().append("text");
    label.exit().remove();

    label.text(activeCountry)
        .style("font-size", "28")
        .style("fill", "none")
        .style("letter-spacing", 1.5)
        .style("font-weight", "bold")
        .style("stroke-width", 1.5)
        .style("stroke", "black");
}

function addGroup() {

    activeSubgroups.push(activeSubgroups[activeSubgroups.length-1]+1);

    active.push({
        subgroup: activeSubgroups.length,
        child: []
    })
    currentGroup = activeSubgroups.length-1;
    
    subGroups(activeSubgroups);
    activate(currentGroup);

    drawChart(activeCountry, active, activeSubgroups);
}

function subtractGroup() {

    if (activeSubgroups != 1){
        activeSubgroups.pop();
        active.pop();
    }

    currentGroup = activeSubgroups.length-1;
    
    subGroups(activeSubgroups);
    activate(currentGroup);

    drawChart(activeCountry, active, activeSubgroups);
}

function subGroups(activeSubgroups){

    var circle = svg4.selectAll("circle")
    .data(activeSubgroups);

    circle.enter().append("circle")
        .attr("id", function(d) {return "circle"+(d-1)})
        .attr("class", "circle")
        .attr("number", function(d) {return (d-1)})
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("cy", function(d){return d*22})
        .attr("cx", 20)
        .attr("r", 10)

    circle.exit().remove();
}

function activate(vnum){
    currentGroup = vnum;
    svg4.selectAll(".circle").attr("fill", "white");
    svg4.select("#circle"+vnum).attr("fill", "#219A55");
}

function goChart(d){
  //console.log(d);
  if (d.state === false){
    d.state = true;
    d.group = currentGroup;
    active[d.group].child.push({indicator: d.indicator, name: d.name});
  }

  else if (d.state === true){
    d.state = false;
    //d.group = currentGroup;
    active[d.group].child.splice(active[d.group].child.indexOf(d.indicator),1);
    //d.group = false;
  }

  drawChart(activeCountry, active, activeSubgroups);
 
  svg3.selectAll("#nameEnter").attr("fill", colorName);
}
