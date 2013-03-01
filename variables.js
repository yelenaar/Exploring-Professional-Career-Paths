//global variables
var parser = d3.time.format("%Y-%m-%d").parse,
    year = d3.time.format("%Y").parse;
var articles;
//Create svg and aside tags
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960-margin.left-margin.right,
    height = 500-margin.top-margin.bottom;
var extraTop = 100, extraLeft = 100;
var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right + extraLeft)
            .attr("height", height + margin.top + margin.bottom + extraTop)
        .append("g")
            .attr("transform", "translate("+margin.left+","+margin.top+")");
var aside = d3.select("body").append("aside");//.style("left", 100).style("position","absolute");
    aside.append("p").text("Author:").append("select").attr("id","authors_names").append("option").text("");
var x = d3.time.scale().range([extraLeft,width+extraLeft]);
var y = d3.scale.linear().range([height,0]);
var dvdr = 3;
var angle = d3.time.scale().range([0, 2 * Math.PI]);
var radius = d3.scale.linear().range([10,55]);
var sangle = d3.scale.linear().range([0, 2 * Math.PI]);
var sradius = d3.scale.linear().range([5,50]);
var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(d3.time.years,1);
var pbs_path = d3.svg.area()
        .x(function(d){return x(year(d.key));})
        .y0(function(d){return y(d.values.length*2);})
        .y1(function(d){return y(d.values.length*2+(d.friends.length+d.attacker.length)/dvdr);})
        .interpolate("monotone");
var clip_path = d3.svg.area()
        .x(function(d){return d.x;})
        .y0(function(d){return d.y0;})
        .y1(function(d){return d.y1;})
        .interpolate("monotone");
var attks_path = d3.svg.area()
        .x(function(d){return x(year(d.key));})
        .y0(function(d){return y(d.values.length*2);})
        .y1(function(d){return y(d.values.length*2-d.attacking.length/dvdr);})
        .interpolate("monotone");
var ball = d3.svg.area.radial()
        .interpolate("cardinal-closed")
        .angle(function(d){return angle(year(d.key));})
        .innerRadius(function(d){return radius(d.values.length*2);})
        .outerRadius(function(d){return radius(d.values.length*2+(d.friends.length+d.attacker.length)/dvdr);});
var spike = d3.svg.area.radial()
        .angle(function(d){return sangle(d);})
        .innerRadius(0)
        .outerRadius(function(d){return sradius(0.20+0.25-(d%2)*0.25);});
var brush = d3.svg.brush()
            .x(x)
            .on("brush", brush);
var oneYear = 31556926000;
var colors = ["silver","lightsteelblue", "#e7969c", "black"];
var yearMinMax;
var shift = 3.5;

//define gradients
//gradient for collaborators and attackers
var gradient = svg.append("defs")
      .append("linearGradient").attr("id","gradient")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "100%").attr("y2", "0%")
      .attr("spreadMethod", "pad");
//gradient for attacking events
var gradientPurple = svg.append("defs")
      .append("radialGradient").attr("id","gradientPurple")
      .attr("cx", "50%").attr("cy", "50%").attr("r","80%")
      .attr("fx", "50%").attr("fy", "50%")
      .attr("spreadMethod", "pad");
var gradientPink = svg.append("defs")
      .append("radialGradient").attr("id","gradientPink")
      .attr("cx", "50%").attr("cy", "50%").attr("r","80%")
      .attr("fx", "50%").attr("fy", "50%")
      .attr("spreadMethod", "pad");