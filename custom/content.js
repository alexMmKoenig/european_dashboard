function description(d) { 

    var heading = d.name;
    var description = d.description;

    $( "h4.panel-title" ).replaceWith( "<h4 class = panel-title>"+ heading+"</h4>" );
    $( ".panel-body" ).replaceWith( "<div class = panel-body>"+ description+"</div>" );
  
}

function save(){

    d3.select("#save").on("click", function(){
        var html = d3.select("#area2").select("svg")
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .node().parentNode.innerHTML;

        var imgsrc = 'data:image/svg+xml;base64,'+ btoa(html);
        var img = '<img src="'+imgsrc+'">'; 

        var canvas = document.querySelector("canvas"),
        context = canvas.getContext("2d");

        var image = new Image;
        image.src = imgsrc;
        
        image.onload = function() {
            context.clearRect ( 0 , 0 , 600 , 500 );
            context.drawImage(image, 0, 0);

            var canvasdata = canvas.toDataURL("image/png");

            var pngimg = '<img src="'+canvasdata+'">'; 

            var a = document.createElement("a");
            a.download = "sample.png";
            a.href = canvasdata;
            document.body.appendChild(a);
            a.click();
        };
    });

}
save();