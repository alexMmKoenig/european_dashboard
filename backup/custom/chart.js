// global

var farbe = [["#4C8191", "#8EB0B9", "#1F5361"], ["#F2859A", "#EF518E", "#A0247C"], ["#88E0A6", "#A7C75C", "#F1FFC9"]];
var farbe2 = [["#4C8191", "#8EB0B9", "#1F5361"], ["#88E0A6", "#A7C75C", "#F1FFC9"], ["#F2859A", "#EF518E", "#A0247C"]];
d3.select("#plus").on("click", stack);

var data1 = [{"year": "2013"},{"year": "2012"},{"year": "2011"},{"year": "2010"},{"year": "2009"},{"year": "2008"},{"year": "2007"},{"year": "2006"},{"year": "2005"},{"year": "2004"},{"year": "2003"},{"year": "2002"},{"year": "2001"},{"year": "2000"}];
var activeCountry = "Germany";
var currentGroup = "0";
var stackMode = false;

var active = [
    {subgroup:1, 
    child:  
        [{ 
        indicator: "B1GM", 
        name: "Transaction",
        subgroup: currentGroup
        }]
    }
];

goData(activeCountry, active,"-a", w, h, "48", "none",2.5);

function stack(){
    if (stackMode === false){
        stackMode = true;
    }
    else {
        stackMode = false;
    }
}

function goData(activeCountry, active,tile, rangewidth, rangeheight, labelsize, labelFill, labelOutline){

                    //var xemp = dataFilter(activeCountry, active[m].child[z].indicator);
    data1.forEach(function(d,i){

        d.xaz = active.map(function(l,m){
            var y0 = 0;
            temp = active[m].child;
            
            return {
                subgroup: l.subgroup,
                child: temp.map(function(s,z){
                    //console.log(z,m,i);
                    return {
                        subgroup: l.subgroup,
                        indicator: s.indicator,
                        name: s.name,
                        val: dataFilter(activeCountry, active[m].child[z].indicator)[i], //filter soll dann hier hin
                        y0: y0,
                        y1: y0 += +dataFilter(activeCountry, active[m].child[z].indicator)[i]
                    }
                })
            }
        })

       if(active.length!=0) {d.maximum = data1[i].xaz[0].child[data1[0].xaz[0].child.length-1].y1;};

    })


    subGroups(active);
    axis(active, tile, rangewidth, rangeheight);
    barchart(tile);
    label(activeCountry,tile, labelsize, labelFill,labelOutline);

}

function makeDataStructure(d){

    if (d.state === false) {
      d.state = true;  
    }
    else if (d.state === true){
        d.state = false;
    };

    // add groups to active
    if (stackMode === false){
        if (d.state === true) {
          // add new group to active
            active.push({
            subgroup: (active.length+1),
            child: []
            })
        }

        else if (d.state === false) {
                active.pop();
        }
        currentGroup = active.length-1;
    };

    //add indicators to groups
    if (d.state === true) {

        d.group = currentGroup;

        active[d.group].child.push({
            indicator: d.indicator, 
            name: d.name,
            subgroup: currentGroup
        });
    };

    if (stackMode === true){

        if ((d.state === false)&&(active[currentGroup].child.length === 1 )){
            active.pop();
            stack();
        }

        else if (d.state === false){
            active[d.group].child.splice(active[d.group].child.indexOf(d.indicator),1);
        };
    };

    goData(activeCountry, active,"-a", w, h, "48", "none",2.5);

    for (var i=0; i<countryList.length;i++){
        
       //if (dataFilter(countryList[i], d.indicator) != undefined){

            //console.log(dataFilter(countryList[i], d.indicator));
            goData(countryList[i], active,countryList[i],180,100,20,"grey",0);
       //}
    }
 
    svg3.selectAll("#nameEnter").attr("fill", colorName);
}

function barchart(tile){

// bar grouping per year
    var barGroup = d3.select("#barArea"+tile+"").selectAll(".barGroup")
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
    
        barSubGroup
            .attr("class", "subbars");

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
            
            else {
                return x1(d.subgroup-1);
            } 
        })
        .attr("width", x1.rangeBand())
        .attr("height", function(d) { 
            if (d.y0 < d.y1) {
                return y(d.y0) - y(d.y1);
            } 
            
            else {
                return y(d.y1) - y(d.y0);
            } 
        })
        .attr("y", function(d) { 
            if (d.y0 < d.y1) {
                return y(d.y1);
            } else {
                return y(d.y0)
            } 
        })
        .style("fill", function(d,i) { return farbe[(d.subgroup-1)][i]; });
}

function subGroups(active){

    var boxGroup = svg4.selectAll("svg")
    .data(active);

    boxGroup.enter().append("svg");
    boxGroup.exit().remove();
    
    boxGroup
      .attr("class","boxGroup")
      .attr("width", "100%")
      .attr("height", function(d){return 10+d.child.length*20})
      .attr("id", function(d) { return d.subgroup; });
    
    var boxStack = boxGroup.selectAll("rect")
        .data( function(d) { return d.child; });

        boxStack.enter().append("rect");
        boxStack.exit().remove();

        boxStack
            .attr("id", function(d) {return d.indicator})
            .attr("class", "box")
            .style("fill", function(d,i) { return farbe[(d.subgroup)][i]; })
            .attr("stroke", "black")
            .attr("y", function(d,i){return 5+20*i})
            .attr("x", 2)
            .attr("width", 20)
            .attr("height", 10);
    
    var name = boxGroup.selectAll("text")
        .data( function(d) { return d.child; });

        name.enter().append("text");
        name.exit().remove();

        name
            .text(function(d) { return d.name })
            .attr("x", 25)
            .attr("y", function(d,i){return 15+i*20})
            .style("font-size", "14")
            .style("letter-spacing", 1);
}

function axis(active,tile,rangewidth, rangeheight){

    max = d3.max(data1, function(d,i) { return d.maximum });
    
    var domain = [{"year": "2013"},{"year": "2012"},{"year": "2011"},{"year": "2010"},{"year": "2009"},{"year": "2008"},{"year": "2007"},{"year": "2006"},{"year": "2005"},{"year": "2004"},{"year": "2003"},{"year": "2002"},{"year": "2001"},{"year": "2000"}];

    x = d3.scale.ordinal()
        .domain(domain.reverse().map(function(d,i) { return d.year; }))
        .rangeBands([0, rangewidth], .2, .1);

    x1 = d3.scale.ordinal()
        .domain(active.map(function(d) {return d.subgroup}))
        .rangeBands([0, x.rangeBand()], .2, .1);

    y = d3.scale.linear()
        .domain([max, 0])
        .range([0, rangeheight]);
    
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("top");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("right")
        .ticks(5)
        .tickFormat(d3.format(".2s"));

    d3.select("#yaxis"+tile+"")
        .transition().duration(500).ease("sin-in-out")
        .call(yAxis);

    d3.select("#xaxis"+tile+"")
        .call(xAxis)
        .selectAll("text")
        .attr("fill", "grey")
        .attr("transform", "rotate("+ 45 +")");
}

function label(activeCountry,tile,labelsize, labelFill,labelOutline){
       
    var label = d3.select("#label"+tile+"").selectAll("text")
        .data(activeCountry[0]);
   
    label.enter().append("text");
    label.exit().remove();

    label.text(activeCountry)
        .style("font-size", labelsize)
        .style("fill", labelFill)
        .style("letter-spacing", 1.5)
        .style("font-weight", "bold")
        .style("stroke-width", labelOutline)
        .style("stroke", "grey");
}