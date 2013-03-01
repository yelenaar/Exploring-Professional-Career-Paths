//modifyDomains
function modifyDomains(inNodes){
    yearMinMax = d3.extent(inNodes,function(d){return year(d.key);});
    x.domain([new Date(yearMinMax[0].getFullYear(),-1),new Date(yearMinMax[1].getFullYear(),1)]);
    y.domain([0, d3.max(inNodes,function(d){return (d.values.length*2+(d.friends.length+d.attacker.length)/dvdr);})]);
    angle.domain(yearMinMax);
    radius.domain([0, d3.max(inNodes,function(d){return (d.values.length*2+(d.friends.length+d.attacker.length)/dvdr);})]);
}

//drawAxis
function drawAxis(){
    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0,"+ (extraTop+height) + ")")
    .call(xAxis);
}

//drawDetails Function
function drawDetails(inNodes){
   var yearlyNodes = svg.append("g").attr("class","yearlyNodes").attr("transform","translate(0,"+extraTop+")").style("visibility","hidden");
   var normCollabs = 50, normPubs = 5, ballSize = 5, normCtrs = 5, normCmns = 10;
   //going through each year, append according number of circles
   inNodes.forEach(function(d,i){
                   var p = Math.ceil(d.values.length/normPubs), c = Math.ceil(d.friends.length/normCollabs), a = Math.ceil(d.attacker.length/normCtrs), s = Math.ceil(d.attacking.length/normCmns);
                   var cHeight = y(d.values.length*2+(d.friends.length+d.attacker.length)/dvdr), pHeight = y(d.values.length*2);
                   var track = 0, cUnit = (pHeight - cHeight)/(c+a+1), pUnit = (height-pHeight)/(p+s+1);
                   while(track++ < s) yearlyNodes.append("circle").attr("class","ball"+d.key)
                   .attr("cx",x(year(d.key))).attr("cy",pHeight+pUnit*track).attr("r", ballSize)
                   .on("click",function(d){}).style("fill",colors[3]);
                   track--;
                   while(track++ < p + s) yearlyNodes.append("circle").attr("class","ball"+d.key)
                   .attr("cx",x(year(d.key))).attr("cy",pHeight+pUnit*track).attr("r", ballSize)
                   .on("click",function(d){}).style("fill",colors[0]);
                   track = 0;
                   while(track++ < a) yearlyNodes.append("circle").attr("class","ball"+d.key)
                   .attr("cx",x(year(d.key))).attr("cy",cHeight+cUnit*track).attr("r", ballSize)
                   .style("fill",colors[2]).on("click",function(d){});
                   track--;
                   while(track++ < c+a) yearlyNodes.append("circle").attr("class","ball"+d.key)
                   .attr("cx",x(year(d.key))).attr("cy",cHeight+cUnit*track).attr("r", ballSize)
                   .style("fill",colors[1]).on("click",function(d){});
                   });
   var asd = yearMinMax[0].getFullYear();
   while(asd++ <= yearMinMax[1].getFullYear())
      svg.selectAll(".ball"+asd.toString())
      .on("mouseover", function(){d3.select("body").style("cursor","pointer");})
      .on("mouseout", function(){d3.select("body").style("cursor","auto");});
}

function drawGradient(inNodes){
    gradient.append("svg:stop").attr("offset", "0%").attr("stop-color", colors[1]);//gradient first stop
    var gradientMax = d3.max(inNodes, function(d){return d.attacker.length;});
    inNodes.forEach(function(d, i){
        if(d.attacker.length > 0){
            if(d.key != yearMinMax[0].getFullYear())
                gradient.append("svg:stop")
                    .attr("offset", (x(new Date(+d.key-1,5))-extraLeft)/width)
                    .attr("stop-color", colors[1]);
                gradient.append("svg:stop")
                    .attr("offset", (x(new Date(+d.key,0))-extraLeft)/width)
                    .attr("stop-color", colors[2])
                    .attr("stop_opacity", d.attacker.length/gradientMax*1);
            if(d.key != yearMinMax[1].getFullYear())
                gradient.append("svg:stop")
                    .attr("offset", (x(new Date(+d.key+1,-6))-extraLeft)/width)
                    .attr("stop-color", colors[1]);
            }//if ther is commenter during that year
    });
    gradient.append("stop").attr("offset", 1).attr("stop-color", colors[1]);//gradient last stop
    
    gradientPurple.append("stop").attr("offset",0).attr("stop-color",colors[1]);
    gradientPurple.append("stop").attr("offset",1).attr("stop-color",colors[3]);
    gradientPink.append("stop").attr("offset",0).attr("stop-color",colors[2]);
    gradientPink.append("stop").attr("offset",0.4).attr("stop-color",colors[1]);
    gradientPink.append("stop").attr("offset",1).attr("stop-color",colors[3]);
}


function drawGrid(inNodes){
   var grid = svg.append("g").attr("class", "grid").attr("transform", "translate(0,"+extraTop+")");
   inNodes.forEach(function(d, i){grid.append("line").attr("x1",x(year(d.key))).attr("y1",0).attr("x2",x(year(d.key))).attr("y2",height);});
}

//drawNumbers Function
function drawNumbers(inNodes){
   var numbers = svg.selectAll("g.numbers")
            .data(inNodes).enter()
            .append("g").attr("class","numbers")
            .attr("id",function(d){return "numbers"+d.key;})
            .attr("transform","translate(0,"+extraTop+")");
   
   numbers.append("text").attr("class", "pnumbers")
            .attr("id",function(d){return "p"+d.key;})
            .text(function(d){return (d.values.length).toString();})
            .attr("x",function(d){return x(year(d.key));})
            .attr("y",function(d){return d.values.length == 0? y(d.values.length*2):y(d.values.length*2)+shift+1;})
            .style("text-anchor","middle");
   numbers.append("text").attr("class", "cnumbers")
            .attr("id",function(d){return "c"+d.key;})
            .text(function(d){return (d.friends.length).toString();})
            .attr("x",function(d){return x(year(d.key));})
            .attr("y",function(d){return y((d.friends.length+d.attacker.length)/dvdr+d.values.length*2)})
            .style("text-anchor","middle");
}

//drawPath Function
function drawPath(inNodes){
    svg.append("path")
    .datum(inNodes)
    .attr("class", "area")
    .style("fill", "url(#gradient)")
    .style("stroke", "url(#gradient)")
    .style("stroke-width", 0.5)
    .attr("d", pbs_path)
    .attr("transform","translate(0,"+(extraTop-1)+")")
    .style("opacity", 0.7);
}

//drawSpikes Function
function drawSpikes(inNodes){
   //assuming the domain of x axis is longer than one year
   var yearStart = x.domain()[0].getFullYear()+1;
   var rSpike = x(new Date(yearStart+1,0))-x(new Date(yearStart,0));
   
   inNodes.forEach(function(d, i){
      if(d.attacking.length>0){
         var num = Math.ceil(d.attacking.length/10), input = [], array = [], t = 0;
         while(t++ <= num*8) array.push(t-1);
//make clip-path's inputarray
         if(i != 0) input.push({x:-rSpike, y0:y(inNodes[i-1].values.length*2)-y(d.values.length*2), y1:y(0)-y(d.values.length*2)});
         input.push({x:0, y0:0, y1:y(0)-y(d.values.length*2)});
         if(i != inNodes.length -1) input.push({x:rSpike, y0:y(inNodes[i+1].values.length*2)-y(d.values.length*2), y1:y(0)-y(d.values.length*2)});
//make clip-path
         svg.append("defs").attr("class", "clips").append("clipPath")
            .attr("id", "clip"+d.key)
            .append("path").datum(input).attr("d",clip_path);
//make spike balls
         sradius.domain([0,1]);
         sangle.domain(d3.extent(array, function(d){return d;}));
         svg.append("path").datum(array)
            .attr("class", "spike")
            .style("fill", function(){return d.attacker.length ==0? "url(#gradientPurple)":"url(#gradientPink)";})
//            .style("stroke",colors[3])
            .attr("transform", "translate("+(x(year(d.key)))+","+(y(d.values.length*2)+extraTop-1)+")")
            .attr("clip-path","url(#clip"+d.key+")")
            .attr("d", spike)
            .style("opacity", 0.7);
      }//if the author has attacking event during given year
   });
}//drawSpikes

//draw StampBall and author names
function drawStampBall(inNodes){
    svg.append("path")
    .datum(inNodes.values)
    .attr("class", "StampBall")
    .style("fill", "url(#gradient)")
    .attr("transform", "translate(50 ,50)")
    .attr("d", ball)
    .on("mouseover", function(){d3.select("body").style("cursor","pointer");})
    .on("mouseout", function(){d3.select("body").style("cursor","auto");});
    svg.append("text")
    .attr("x", 100)
    .attr("y", 60)
    .attr("id","Name")
    .style("text-anchor","start")
    .text((inNodes.lname+","+inNodes.fname));
}

//draw symbols and brush window
function drawSymbolsWindow(inNodes){
    svg.append("g")
    .attr("class", "x brush")
    .call(brush)
    .selectAll("rect")
    .attr("y", -6)
    .attr("height", height+7)
    .attr("transform","translate(0,"+extraTop+")");
    svg.selectAll("path.psymbol")
    .data(inNodes)
    .enter().append("path")
    .attr("class","psymbol")
    .attr("id", function(d){return "psymbol"+d.key;})
    .attr("transform",function(d){return "translate(" + x(year(d.key)) + "," + (extraTop+y(d.values.length*2)+1.5) + ")";})
    .attr("d",d3.svg.symbol().size(50));
    svg.selectAll("path.csymbol")
    .data(inNodes)
    .enter().append("path")
    .attr("class","csymbol")
    .attr("id", function(d){return "csymbol"+d.key;})
    .attr("transform",function(d){return "translate(" + x(year(d.key)) + "," + (extraTop+y(d.values.length*2+(d.friends.length+d.attacker.length)/dvdr)-shift) + ")";})
    .attr("d",d3.svg.symbol().size(50));
}

//draw Dynamic Legends Function
function drawDynamicLegends(inNode){
   var lgap = 1.5,xgap = 5;
   var pub1 = inNode.values.length*2, col1 = (inNode.friends.length+inNode.attacker.length)/dvdr;
   var legend = svg.append("g").attr("class","legend").attr("transform","translate("+(extraLeft-10)+","+(extraTop-1.2)+")");
   legend.append("line").attr("x1",0).attr("y1",y(pub1+col1)+lgap).attr("x2",0).attr("y2",y(pub1)-lgap);//short left
   legend.append("line").attr("x1",0).attr("y1",y(pub1)+lgap).attr("x2",0).attr("y2",height-lgap);//long left
   legend.append("line").attr("x1",0).attr("y1",y(pub1)+lgap).attr("x2",xgap).attr("y2",y(pub1)+lgap);//long top
   legend.append("line").attr("x1",0).attr("y1",height-lgap).attr("x2",xgap).attr("y2",height-lgap);//long bottom
   legend.append("line").attr("x1",0).attr("y1",y(pub1+col1)+lgap).attr("x2",xgap).attr("y2",y(pub1+col1)+lgap);//short top
   legend.append("line").attr("x1",0).attr("y1",y(pub1)-lgap).attr("x2",xgap).attr("y2",y(pub1)-lgap);//short bottom
   
   var legendText = svg.append("g").attr("class","legendText");
   legendText.append("text").attr("transform", "rotate(-90)").attr("x", -(y(pub1)-lgap+extraTop)).attr("y", extraLeft-15)
   .style("text-anchor","start").text("#Encounterers");
   legendText.append("text").attr("transform", "rotate(-90)").attr("x", -(height-lgap+extraTop)).attr("y", extraLeft-15)
   .style("text-anchor","start").text("#Publications");
}

//draw Static Legends Function
function drawStaticLegends(){
   var types = ["Publications","Collaborators","Attackers", "Attackings"], rwidth = 10;
   var typeLegend = svg.selectAll("g.types").data(types)
         .enter().append("g").attr("class", "types")
         .attr("transform", "translate("+(extraLeft+2)+","+(extraTop+2)+")")
         .style("fill",function(d,i){return colors[i];});
   typeLegend.append("text").text(function(d){return d;})
         .attr("x",20).attr("y",function(d,i){return 15 * i + 8;});
   typeLegend.append("rect").attr("x",5).attr("y",function(d,i){return 15 * i;})
         .attr("width",rwidth).attr("height",rwidth);
}