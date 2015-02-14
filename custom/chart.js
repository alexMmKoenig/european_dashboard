// global

//var farbe = [["#648888","#64FD88","#538045", "#34723F"], ["#FC8888","#6489FE","#B0A474"], ["#648864","#FA89FD","#F13610"], ["#F13610"]];
//var farbe = [["#6489FE","#64FD88","#538045", "#34723F"], ["#FC8888","#6489FE","#B0A474"], ["#648864","#FA89FD","#F13610"], ["#F13610"]];
//var farbe = [["#648888","#C5D1D1","#2D6060"], ["#FFB0B0","#FC8888","#FFD5D5"], ["#64FD88","#CDFFD8","#91FEA9"], ["#F13610"]];
//var farbe = [["#2E9896","#C5D1D1","#2D6060"], ["#FFB0B0", "#FC8888", "#B0A474"], ["#EF982E","#99982E","#FFD5D5"], ["#64FD88","#CDFFD8","#91FEA9"], ["#F13610"]];
//var farbe = [["#00A3FF","#00CFE9","#538045", "#34723F"], ["#EF0094", "#6D00F0","#FF0035","#B0A474"], ["#B5EDE1","#6ADFDF","#F13610"], ["#F13610"]];
//var farbe = ["#6489FE", "#48FB47", "#EF0094", "#F1DE51"];
var farbe = [["#4C8191", "#8EB0B9", "#1F5361"], ["#F2859A", "#EF518E", "#A0247C"], ["#88E0A6", "#A7C75C", "#F1FFC9"]];

d3.select("#plus").on("click", stack);
d3.select("#minus").on("click", subtractGroup);

//var farbe = ["#6489FE","#FC8888","#648888","#64FD88","#538045","#34723F","#FC8888","#6489FE","#B0A474"];
var data1 = [{"year": "2013"},{"year": "2012"},{"year": "2011"},{"year": "2010"},{"year": "2009"},{"year": "2008"},{"year": "2007"},{"year": "2006"},{"year": "2005"},{"year": "2004"},{"year": "2003"},{"year": "2002"},{"year": "2001"},{"year": "2000"}];
var activeCountry = "Germany";
var currentGroup = "0";
var stackMode = false;

var active = [
    {subgroup:1, 
    child:  
        [{ 
        indicator: "F", 
        name: "Transaction",
        subgroup: currentGroup
        }]
    }
];

goData(activeCountry, active);

function stack(){
    if (stackMode === false){
        stackMode = true;
    }
    else {
        stackMode = false;
    }
}

function goData(activeCountry, active){

    data1.forEach(function(d,i){

        d.xaz = active.map(function(l,m){
            var y0 = 0;
            temp = active[m].child;
            
            return {
                subgroup: l.subgroup,
                child: temp.map(function(s,z){
                    var xemp = dataFilter(activeCountry, active[m].child[z].indicator);
                    //console.log(z,m,i);
                    return {
                        subgroup: l.subgroup,
                        indicator: s.indicator,
                        name: s.name,
                        val: xemp[i], //filter soll dann hier hin
                        y0: y0,
                        y1: y0 += +xemp[i]
                    }
                })
            }
        })

        d.maximum = data1[i].xaz[0].child[data1[0].xaz[0].child.length-1].y1;

    })


    axis(active);
    barchart();
    label(activeCountry);
    legendIndicators(active);
    
    subGroups(active);

}

function makeDataStructure(d){

    if ((stackMode === false)&&(d.state === false))
    {
        addGroup();
    }
    if ((stackMode === false)&&(d.state === true))
    {
        subtractGroup();
    }

    if (d.state === false){
        d.state = true;
        d.group = currentGroup;

        active[d.group].child.push({
            indicator: d.indicator, 
            name: d.name,
            subgroup: currentGroup
        });
    }

    else if (d.state === true){
        d.state = false;
        active[d.group].child.splice(active[d.group].child.indexOf(d.indicator),1);
    }

    goData(activeCountry, active);
 
    svg3.selectAll("#nameEnter").attr("fill", colorName);
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
        
        .attr("x", function(d) { 
            if (d.y0 < d.y1) {
                return x1(d.subgroup);
            } 
            else 
            {
                return x1(d.subgroup-1);
            } 
        })
        .attr("width", x1.rangeBand())
        .attr("height", function(d) { 
            if (d.y0 < d.y1) 
            {
                return y(d.y0) - y(d.y1);
            } 
            else 
            {
                return y(d.y1) - y(d.y0);
            } 
        })
        .attr("y", function(d) { 
            if (d.y0 < d.y1) 
            {
                return y(d.y1);
            } else 
            {
                return y(d.y0)
            } 
        })
        .style("fill", function(d,i) { return farbe[(d.subgroup-1)][i]; });
        console.log(barStack);
}

function addGroup() {

    active.push({
        subgroup: (active.length+1),
        child: []
    })

    currentGroup = active.length-1;
    subGroups(active);
    goData(activeCountry, active);
}

function subtractGroup() {

    if (active.length != 1){
        active.pop();
    }

    currentGroup = active.length-1;
    subGroups(active);
    goData(activeCountry, active);
}

function subGroups(active){

    var boxGroup = svg4.selectAll(".boxGroup")
    .data(active);

    boxGroup.enter().append("g");
    boxGroup.exit().remove();
    
    boxGroup
      .attr("class","boxGroup")
      .attr("id", function(d) { return d.subgroup; })
      .attr("transform", function(d,i) { return "translate(0," + d.subgroup*25 + ")"; });
 

    var boxStack = boxGroup.selectAll("rect")
        .data( function(d) { return d.child; });

    boxStack.enter().append("rect");
    boxStack
        .attr("id", function(d) {return d.indicator})
        .attr("class", "box")
        .style("fill", function(d,i) { return farbe[(d.subgroup)][i]; })
        .attr("stroke", "black")
        .attr("x", function(d,i){return 5+25*i})
        .attr("width", 20)
        .attr("height", 10);

    boxStack.exit().remove();
}

function legendIndicators(active){
    
    var array = []; //array contains only active names

    for (var j = 0; j < active.length; j++)
    {
        for (var i = 0; i < active[j].child.length; i++)
        {
            array.push(active[j].child[i].name);
        }

        var info = d3.select("#legend").selectAll("text")
            .data(array);
   
        info.enter().append("text");
   
        info.exit().remove();
    
        info.text(function(d) { return d })
            .attr("y", function(d, i) { return 10+i*14})
            .style("font-size", "14")
            .style("fill", function(d,i) { return farbe[j][i]; })
            .style("letter-spacing", 1.5);
    }
}

function axis(active){

    max = d3.max(data1, function(d,i) { return d.maximum });
    
    var domain = [{"year": "2013"},{"year": "2012"},{"year": "2011"},{"year": "2010"},{"year": "2009"},{"year": "2008"},{"year": "2007"},{"year": "2006"},{"year": "2005"},{"year": "2004"},{"year": "2003"},{"year": "2002"},{"year": "2001"},{"year": "2000"}];

    x = d3.scale.ordinal()
        .domain(domain.reverse().map(function(d,i) { return d.year; }))
        .rangeBands([0, w], .2, .1);

    x1 = d3.scale.ordinal()
        .domain(active.map(function(d) {return d.subgroup}))
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
        .ticks(5)
        .tickFormat(d3.format(".2s"));

    d3.select("#yaxis")
        .transition().duration(500).ease("sin-in-out")
        .call(yAxis);

    d3.select("#xaxis")
        .call(xAxis)
        .selectAll("text")
        .attr("fill", "grey")
        .attr("transform", "rotate("+ 45 +")");
}

function label(activeCountry){
       
    var label = d3.select("#label").selectAll("text")
        .data(activeCountry[0]);
   
    label.enter().append("text");
    label.exit().remove();

    label.text(activeCountry)
        .style("font-size", "48")
        .style("fill", "none")
        .style("letter-spacing", 1.5)
        .style("font-weight", "bold")
        .style("stroke-width", 2.5)
        .style("stroke", "grey");
}