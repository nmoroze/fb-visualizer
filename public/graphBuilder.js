function initializeTheDiGraph(){
    data=getData(function(data) {
        buildGraph(data);
    });
    return false;
}
function getData(callback){
    url="/getFollowers";
    twitterId=document.getElementById("Tid").value;
    console.log("Getting data");
    $.post(url,
        {
          name: twitterId,
        },
        function(data){
            loadData=data;
            console.log("success");
            console.log("Data: " + loadData);
            callback(data); 
        });
    
}
function buildGraph(loadData){
    //var w = 1000;
    //var h = 600;
    console.log(loadData);
    var width = window.innerWidth;
    var height = window.innerHeight;
    var imgSize=50;

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    var force = d3.layout.force()
        .gravity(0.05)
        .distance(200)
        .charge(-100)
        .size([width, height]);

        json=JSON.parse(loadData);

            force
            .nodes(json.nodes)
            .links(json.links)
            .start();

            var link = svg.selectAll(".link")
            .data(json.links)
            .enter().append("line")
            .attr("class", "link");

            var node = svg.selectAll(".node")
            .data(json.nodes)
            .enter().append("g")
            .attr("class", "node")
            .call(force.drag);

            node.append("image")
            .attr("xlink:href", function(d) {return d.picture;})
            .attr("x", -10)
            .attr("y", -10)
            .attr("width", imgSize)
            .attr("height", imgSize);

            node.append("text")
                .attr("dx", 12)
                .attr("dy", ".35em")
                .text(function(d) { return d.name; });

            var setEvents = node.on('click', function(d) {
              d3.select("h2").html(d.name);
              d3.select("h3").html ("Take me to " + "<a href='" + d.link + "' >"  + d.name + " web page ⇢"+ "</a>" );
           });

           /*var refreshGraph = function() {
             var node = svg.selectAll(".node")
             .data(json.nodes)
             .enter().append("g")
             .attr("class", "node")
             .call(force.drag);

             node.append("image")
             .attr("xlink:href", function(d) {return d.picture;})
             .attr("x", -10)
             .attr("y", -10)
             .attr("width", 50)
             .attr("height", 50);

             node.append("text")
                 .attr("dx", 12)
                 .attr("dy", ".35em")
                 .text(function(d) { return d.name; });
           };*/


            force.on("tick", function() {
                 node.attr("cx", function(d) { return d.x = Math.max(imgSize, Math.min(width - imgSize, d.x)); })
                 .attr("cy", function(d) { return d.y = Math.max(imgSize, Math.min(height - imgSize, d.y)); });

                    link.attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });

                    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
                    });
    refreshGraph();
}
