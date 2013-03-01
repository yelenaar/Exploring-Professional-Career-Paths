//LOAD DATA...from local files
d3.csv("newNodes/nodes_subset.csv",function(in_nodes){
d3.csv("newNodes/nodes_subset_publications.csv", function(in_pbs){
d3.csv("newNodes/nodes_subset_comments.csv", function(in_attacks){
d3.csv("newNodes/nodes_subset_collabs.csv", function(in_friends){
d3.csv("newNodes/output.csv",function(in_articles){
//functions come first
function findNode(nodeToShow){
       node231 = nodes.filter(function(d){return d.key == nodeToShow;});
       var attacker = attackers.filter(function(d){return d.key == nodeToShow;})[0];
       var attacking = attackings.filter(function(d){return d.key == nodeToShow;})[0];
       var friend = friends.filter(function(d){return d.key == nodeToShow;})[0];
       
       node231[0].values.forEach(function(d){
            var fout = friend.values.filter(function(dd){return dd.key == d.key;});
            var cout = attacker.values.filter(function(dd){return dd.key == d.key;});
            var cmout = attacking.values.filter(function(dd){return dd.key == d.key;});
            if (fout.length == 1) d.friends = fout[0].values;
            else d.friends = [];
            if(cout.length == 1) d.attacker = cout[0].values;
            else d.attacker = [];
            if(cmout.length == 1) d.attacking = cmout[0].values;
            else d.attacking = [];
        });
}//find node to display

//Clear loaded data
       in_articles.forEach(function(d){
            d.article_id = +d.article_id;
            d.date = parser(d.date);
       });
       articles = in_articles;
       console.log(articles);
//read in publication data: author_id,article_id,date
      in_pbs.forEach(function(d){
         d.author_id = +d.author_id;
         d.article_id = +d.article_id;
         d.date = parser(d.date);
      });
      var nodes = d3.nest()
               .key(function(d){return d.author_id;})
               .key(function(d){return d.date.getFullYear();})
               .sortKeys(d3.ascending)
               .entries(in_pbs);
//add in empty arrays for missing years
      nodes.forEach(function(d){
         d.key = +d.key;
         var l = d.values.length;
         if(l-1 < d.values[l-1].key-d.values[0].key){//if there are missing pieces in values for years 
           var startYear = d.values[0].key, years = [];
           while(startYear < d.values[l-1].key){
              if(!d.values.some(function(dd){return dd.key == startYear;}))
                 years.push({key:startYear, values:[]});
               startYear = (+startYear+1).toString();
           }//aggregate the missing years
           d.values=d.values.concat(years);
           d.values.sort(function(a,b){return a.key - b.key;});
         }
      });
      nodes.sort(function(a,b){return a.key - b.key;});
      in_nodes.sort(function(a,b){return a.author_id - b.author_id;});
      nodes.forEach(function(d, i){
         d.lname = in_nodes[i].lname;
         d.fname = in_nodes[i].fname; 
      });
      
      var attackers = d3.nest()//author's commenters
                .key(function(d){return d.commented_id;})
                .key(function(d){return d.date.substr(0,4);})
                .sortKeys(d3.ascendinig)
                .entries(in_attacks);
      var attackings = d3.nest()//author's commenting event
                .key(function(d){return d.commenter_id;})
                .key(function(d){return d.date.substr(0,4);})
                .sortKeys(d3.ascendinig)
                .entries(in_attacks);

       in_friends.forEach(function(d){d.date = parser(d.date);});
       var friends = d3.nest()
                    .key(function(d){return d.co1;})
                    .key(function(d){return d.date.getFullYear();})
                    .key(function(d){return d.co2;})
                    .sortKeys(d3.ascending)
                    .entries(in_friends);
       
//make scroll down menu viable
       nodes.sort(function(a,b){
                if(a.lname < b.lname) return -1;
                if(a.lname > b.lname) return 1;
                return 0;
        });
       d3.select("#authors_names").on("change",change)
            .selectAll("option")
            .data(nodes).enter().append("option")
            .attr("value", function(d){return d.key})
            .text(function(d){return d.lname + "," + d.fname;});
       
//Add in publication, collaborators, attackers, and attackings
       var nodeNumber = 16764;
       var node231;
       findNode(nodeNumber);
       drawEverything();
       function change(){
            if(nodeNumber != this.value){
                clearAll();
                findNode(this.value);
                drawEverything();
            }
       }
       
       /*      function redraw(input){
        if(input.key != selectedId) selectedId = input.key;
        else return;
        updateNode(selectedId);
        //clearPath();
        drawGrid();
        drawGradient();
        drawpath();
        drawSpikes();
        drawAxis();
        drawSymbolsWindow();
        drawStampBall();
        drawDynamicLegends();
        drawNumbers();
        drawStaticLegends();
        drawDetails();
        }*/
       
       /* function updateNodes(id){
        
        
        }*/
function drawEverything(){
       modifyDomains(node231[0].values);//modify x and y's domain
       
       drawGrid(node231[0].values);//DYNAMIC: draw background grid
       drawGradient(node231[0].values);//DYNAMIC + STATIC: draw attacking gradient and attacker gradientPurple & gradientPink

       drawPath(node231[0].values);//DYNAMIC:draw path of each individual authors
       drawSpikes(node231[0].values);//draw attacking events
       drawAxis();//STATIC: draw static axis
       drawSymbolsWindow(node231[0].values);//DYNAMIC:draw symbols and brush window
       drawStampBall(node231[0]);//DYNAMIC: draw upper left corner stampball with author name near
      
       drawDynamicLegends(node231[0].values[0]);//DYNAMIC: draw legends
       drawNumbers(node231[0].values);//DYNAMIC:draw total number of collaborators and publications along the path
       drawStaticLegends();//STATIC
       drawDetails(node231[0].values);//DYNAMIC:draw circles of collaboraters & attackers & publications & attacking events
}
       
});});});});});//reading all csv files
var dim = 0.4, norm = 0.7;
//other functions

//brush Function
function brush(){
   var tracker = yearMinMax[0].getFullYear();
   while(tracker <= yearMinMax[1].getFullYear()){
     svg.selectAll(".ball"+tracker).style("visibility","hidden");
     svg.selectAll("#numbers"+tracker+",#psymbol"+tracker+",#csymbol"+tracker).style("visibility","visible");
     tracker++;
   }
   svg.selectAll(".area, .spike").style("opacity",dim);
   if(brush.empty())
      svg.selectAll(".area, .spike").style("opacity",0.7);
   else{//add balls in colored stream
      if(new Date(brush.extent()[0].getFullYear()) <= brush.extent()[0]) tracker = brush.extent()[0].getFullYear()+1;
      else tracker = brush.extent()[0].getFullYear();
      while(tracker <= brush.extent()[1].getFullYear()){
        svg.selectAll(".ball"+tracker).style("visibility","visible");
        svg.selectAll("#numbers"+tracker+",#psymbol"+tracker+",#csymbol"+tracker).style("visibility","hidden");
        tracker++;
      }
   }//else when brush is not empty
}

//end of file