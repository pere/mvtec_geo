
var first_load=true;

function create_score_svg(container,buckets,end_color)
        {
            /*
            [
    {
        "counts": 188,
        "index": 0,
        "label": "Low",
        "color": "#f2690a",
        "range": [
            0.9260861247862415,
            5.847790218047075
        ],
        "ids": [
           
    }
]
*/
            //{min:score_min, avg:score_avg,max:score_max},

             $('.'+container).css('display','block');
             $('.voronois_scores_container,.scores_scale').css('display','block');

             var svg = d3.select('.'+container);

             var svg_width = $('.sidenav').width()-20;
             
             svg.style('width', svg_width + 'px');
             svg.style('height', '30px');
             svg.select('defs').remove();
             var defs = svg.append("defs");
             var gradient = defs.append("linearGradient")
                 .attr("id", "new_svgGradient")
                 .attr("x1", "0%")
                 .attr("y1", "0%")
                 .attr("x2", "100%")
                 .attr("y2", "0%");
            
                // (max_val-min_val)/3, 
                //(score_max-score_avg)/2, 
           // var domain = [buckets.min, buckets.avg,((buckets.max-buckets.avg)/2)+buckets.avg, buckets.max];
           
            console.log(buckets)
            var domain=buckets.map(d=>d.range[0]);
            domain.push(buckets[buckets.length-1].range[1]);
            /* xValues = d3.set(domain).values();
            var axisLeg = d3.axisBottom(xScale)
                .tickValues(xValues) */

           // var colorScale=d3.scaleLinear().domain(domain).range(["#f2690a", "#E2EB16", "#12EB5D","#12EB5D"]);
            var xScale = d3.scaleLinear()                
                .domain([buckets[0].range[0],buckets[buckets.length-1].range[1]])
                .range([1,svg_width-7]);

            var xScale2 = d3.scaleLinear()                
                .domain([buckets[0].range[0],buckets[buckets.length-1].range[1]])
                .range([0,100]);
             //
            //var colors = ["#f2690a", "#E2EB16", "#12EB5D"];
            var colors=buckets.map(d=>d.color);
            console.warn(domain)
         /*    var mod=domain.push(300000);
            console.info(mod) */
             //Append multiple color stops by using D3's data/enter step  
             gradient.selectAll("stop")
                 //.data(colors)
                 //.data(["#f2690a", "#E2EB16", "#12EB5D","#12EB5D"])
                 .data(domain)
                 .enter().append("stop")
                 .attr("offset", function(d, i) {
                   
                    if (i==domain.length-1)
                    return '100%';
                    else
                     return xScale2(domain[i]) + '%';
                         //return (domain[i]*10) + '%';
                     //return domain[i] + '%';
                 })
                 .attr("stop-color", function(d, i) {
                    if (i==domain.length-1)
                    return end_color
                    else
                    return colors[i];

                 });

               /*   var b = '';
            
            for (var p in colors) {
                if (p == 0) {
                    b += 'linear-gradient(90deg, ' + colors[p] + ' 0%, ';
                } else {
                    if (p == colors.length - 1) {
                        b += colors[p] + ' 100%)';
                    } else {
                        var x = parseInt((p * max_val) / colors.length)

                        b += colors[p] + ' ' + x + '%,'
                    }
                }
            }
            console.log(b); */
         
            $('.sidenav .new_rect_legend,.legendWrapper').remove();
            var rect = svg.append("rect")
                .attr('class', 'new_rect_legend')
                .attr('width', svg_width)
                .attr('height', 10)
                .attr("fill", "url(#new_svgGradient)");

            xValues = d3.set(domain).values();
            var axisLeg = d3.axisBottom(xScale)
                .tickValues(xValues)
            
            var legendsvg = svg.append("g")
                .attr("class", "legendWrapper")
                .style("width", svg_width)
                
                .style("height", 45)

            var legendHeight = 10;
            legendsvg.append("g")
                .style("width", svg_width)                
                .style("height", 45)
                .attr("class", "axis") //Assign "axis" class
                .attr("transform", "translate(0, " + (legendHeight) + ")")
                .call(axisLeg)
                .selectAll("text")
                
                .attr("fill", 'white')
                .attr('font-size', '.8rem')
                .attr("transform", "rotate(327) translate(0,2)")
                .style("text-anchor", "start")
                
              /*   .attr("transform", function(d, i) {
                    if (i > 0)
                        return "translate(-10,0)"
                    else
                        return "translate(-10,0)"

                }); */
            }

function add_legend(t_layer)
{
  var svg = d3.select('.analysis_layer.' + t_layer.id + ' svg.circles_svg');
  svg.style('display', 'block');
  var _symbol = d3.symbolCircle;

  var t_symbol = t_layer.params_symbology.filter(function(d) {
      return d.param_name == 'nea'
  });
}

function getUniqueFeatures(array, comparatorProperty) {
    var existingFeatureKeys = {};
    // Because features come from tiled vector data, feature geometries may be split
    // or duplicated across tile boundaries and, as a result, features may appear
    // multiple times in query results.
    var uniqueFeatures = array.filter(function (el) {
      if (existingFeatureKeys[el.properties[comparatorProperty]]) {
        return false;
      } else {
        existingFeatureKeys[el.properties[comparatorProperty]] = true;
        return true;
      }
    });
  
    return uniqueFeatures;
  }

$('document').ready(function() {    

    

    

    var el = document.querySelector('.tabs');
    var instance = M.Tabs.init(el, {});

    $('.sel_country .btn').on('click', function() {

      
        $('.map_legend_control_container').css('display','none');

        if ($(this).hasClass('active')) {

        }
        else
        {

        }
        var c = this_app.countries.filter(d => d.adm0_code == parseInt($(this).attr('code')))[0];
        this_app.flying = true;

        map.once('moveend',()=>{
            console.log('moveend, finished flying')
            
            this_app.flying = true;

            

            update_by_score()

           $('.color_schema_btn').show();
            
            this_app.flying = false;
                

            
                return false;
                   
                    console.log(d)  
            
        })
        
        map.flyTo({
            center: c.center,
            zoom: c.zoom,
            duration: 3000 // Animate over 12 seconds

        })

      
        /* setTimeout(function() {

            resultFeatures = map.querySourceFeatures('voronois_data_source', {sourceLayer: 'voronois_all'});
            console.log(resultFeatures);

            var resultFeatures = map.querySourceFeatures('voronois_data_source', {sourceLayer: 'voronois_data_source', filter: 
                map.getFilter('voronois_data')
            })

            console.log(resultFeatures);

            var features=map.queryRenderedFeatures({ layers: ["voronois_data"] });
            console.log(features)
            if (features)
             {
                 var uniqueFeatures = getUniqueFeatures(features, 'adm0_code');
                 console.warn(uniqueFeatures);
             }
            },1000) */

        $('#test2 .collection').css('display','block');
        this_app.adm0_code = parseInt($(this).attr('code'));
        $(this).toggleClass('active');

        if (first_load==true)
        {
            first_load=false;
            
        }
        
    })

    this_app.feature_stats=function(uniqueFeatures)
        {
            var user_pop_sum_score=this_app.scores.filter(d=>d.param=='pop_sum')[0].value;
            var user_elec_legth_score=this_app.scores.filter(d=>d.param=='elec_length')[0].value;
            var user_dist_elect_score=this_app.scores.filter(d=>d.param=='dist_elect')[0].value;


            var total_scores_arr=uniqueFeatures.map(function(data,i)
            {
                var total_score=0;
                var prop=data.properties;
                var params= ['pop_sum','elec_length','dist_elect'];
                //.forEach(function(param)
                for (var p in params)        
                {          
                    var param=params[p];
                    var score=prop[param+'_score'];          
                    total_score+=parseFloat(score*this_app.scores.filter(d=>d.param==param)[0].value,2);
                    
                };
                uniqueFeatures[i].properties.user_total_score=total_score;
                return total_score;
            });
            
            var score_avg=d3.mean(total_scores_arr);
            var score_max=d3.max(total_scores_arr);
            var score_min=d3.min(total_scores_arr);
            var score_median=d3.median(total_scores_arr);            

            var buckets=[score_min,
                //low values, below avg
                score_avg-0.1,
                //(score_avg/4,
                (((score_max-score_avg)/4)+score_avg)-0.1,
                (((score_max-score_avg)/2)+score_avg)-0.1,
                score_max
        //    score_max
        ];

        

        //var colors=["#f2690a", "#E2EB16", "#12EB5D",'#12aeeb','#094db4'];

        var colors=d3.range(0,6).map(d=>d3[this_app.interpol_name]((d/6)));
        var end_color=colors[colors.length-1];
        console.log(end_color)
        colors=colors.slice(0,colors.length-1);
        console.warn(colors)

            map.setPaintProperty('voronois_data', 'fill-color', 
            [
               'interpolate',['linear'], 
            [
            "+", 
            [ "*", ['get', 'pop_sum_score'],  user_pop_sum_score], 
            [ "*", ['get', 'elec_length_score'],  user_elec_legth_score], 
            [ "*", ['get', 'dist_elect_score'], user_dist_elect_score]
            
            ],
      
            score_min,colors[0],
            buckets[1], colors[1],

            //blueiwh
            //(max_val-avg_val)/2, "#16b6eb",

            //greenish
            
            buckets[2], colors[2],

            //blue
            buckets[3],colors[3],
            //darker blue
            score_max-0.1, colors[4],
            score_max, end_color
            ]
            );

            
            //filter:['==', 'adm0_code',68]
            //map.querySourceFeatures('voronois_data', { sourceLayer: 'voronois_all' });
            map.setPaintProperty('voronois_data', 'fill-opacity', 1);

            $('.min_max_avg').html('Min: <span style="color:#ff9800">'+score_min.toFixed(2)+'</span> Max:  <span style="color:#ff9800">'+score_max.toFixed(2)+'</span> Avg:  <span style="color:#ff9800">'+score_avg.toFixed(2)+'</span>');


            // this_app.colorScale=d3.scaleLinear()
            // .domain(d3.range(buckets.length))
            // //.domain(buckets)
            //    .range(colors);
            

            var buckets=buckets.map((d,i)=>
            {
      
      
                switch (i)
                {
                    case 0: var label='Low';
                        
                    break;
                    /* case 1: var label='Low';break; */
                    case 1: var label='Over average';break;
                    case 2: var label='High';break;
                     case 3: var label='Very High';break;
                     
                    case 4: var label='Max'; break;
                    default: var label='Unknonw';

                } 

                if (i<buckets.length-1)
                {
                
                
                    return {counts:0,index:i,label:label,color: colors[i],
                         range:[parseFloat(d,2),parseFloat(buckets[i+1], 2)],
                        //we caanot modify mapbox original data, so we need to create a new array with the data we need to filter later
                    ids:[]
                    }
                }
                else
                {
                    return {counts:0,index:i,label:label,color: colors[i], range:[parseFloat(d,2)-0.1, parseFloat(score_max,2)],
                        ids:[]}
                    
                }
            });

            console.log(buckets)
            this_app.buckets=buckets;
            
            //.push(score_stats.max_val);

            //var scale=[[score_stats.min_val,score_stats.avg_val],[score_stats.avg_val,score_stats.max_val]];
            var max_total_score=0;
            
           /*  uniqueFeatures.reduce(function(memo,data,i)
            {
                if (total_score>max_total_score)
                {
                    max_total_score=total_score;
                }
            }} */

         

            var red=uniqueFeatures.reduce(function(memo,data,i)
            {
                var total_score=0;
                var prop=data.properties;
                var params= ['pop_sum','elec_length','dist_elect'];
                
           
                var _class=buckets.filter(function(a,i) {
                
                    
                    if (prop.user_total_score >= a.range[0] && prop.user_total_score <= a.range[1]) {                                                                                      
                        memo[i].ids.push(parseInt(prop['gid']));
                        memo[i].counts=memo[i].counts+1;
                        memo[i].color=buckets[i].color;

                       
                    }
                
                    
                })[0];

            return memo;
            },buckets);

            console.log

            //var domain = [buckets.min_val, buckets.avg_val,(buckets.max_val-buckets.avg_val)/2, buckets.max_val];
            
        
            //scores_svg
            
            console.log(buckets)
            console.info(red)
            this_app.reduced_data=red;


            create_score_svg('scores_svg',buckets,end_color)
         
           
            var html='';
            //style="background-image: -webkit-linear-gradient(left,#ff0000 -25%,#E2EB16 50%,#12EB5D 75%)!important; clear: both;"
            red.map((d,i)=>
                {
                    
                    //background-image: -webkit-linear-gradient(left,#ff0000 ,#12EB5D )!important; clear: both;
                     if (i==red.length-1)
                    var b='background-image: -webkit-linear-gradient(left,'+end_color+','+end_color+')!important; clear: both;';
                    else 
                    var b='background-image: -webkit-linear-gradient(left,'+d.color+','+red[i+1].color+')!important; clear: both;';
                    
                   //(i==red.length-1)?d.range[0].toFixed(1):
                    html+='<a href="#!" class="collection-item"><span style="color:black;'+b+'" class="badge">'+d.counts+'</span><span>'+d.label+'<span><span class="range">';
                    
                    if (i==red.length-1)
                    html+=d.range[1].toFixed(1)
                    else
                    html+=d.range.map(d=>d.toFixed(2)).join('-')
                    
                    html+='</span></a>';

                    return html
                }).join('</hr>')

                console.info(html)
 
            $('.map_legend_control_container .collection').html(html)
            $('.map_legend_control_container').css('display','block');
            $('.map_legend_control_container .collection').off('click');
            $('.map_legend_control_container .collection').on('click',function(e)
            {
                
                var el=$(e.target);
                if ($(e.target).hasClass('collection-item'))
                {
                    var t=$(e.target);
                }
                else
                {
                    var t=$(e.target).closest('.collection-item');
                }
                
                t.toggleClass('activated');
                //find the index in a jquery collection of elements
                var pos =t.index();
                console.warn(pos)

              
                var ids=this_app.buckets[pos].ids;
                //map.setFilter('voronois_data',
                //var f=current_filter.push([["!in",["get", "id"],["literal",ids ]]])
                console.log(["in","gid",this_app.buckets[pos].ids])
                


                map.setFilter('voronois_data',["in","gid",...this_app.buckets[pos].ids]);
              /*   map.setPaintProperty('voronois_data','fill-opacity',[
                    "all",
                        ['==','adm0_code',this_app.adm0_code] 
                        , ["case",
                ["in",
                  ["get", "gid"],
                 // ["==",this_app.buckets[pos].ids
                 ["literal",this_app.buckets[pos].ids
                  ]
                 ], 1, // Value when `in` returns true
                0.4 // Fallback
              
            
            ]
        ]) */


           

               // map.setPaintProperty('voronois_data', "fill-opacity", ["!in","gid",...buckets[pos].ids],0.5,1);
               // map.setFilter('voronois_data',["!in","gid",...buckets[pos].ids]);
            //)
                 
                
            })

        


        }

    function update_by_score()
    {
    //setTimeout(function(){
        
       
    //   var data=[{"code":68,"data":[{"param":"pop_count","max":0,"min":0,"avg":0},{"param":"pop_sum","max":10.00007,"min":7.0e-5,"avg":0.17489},{"param":"elec_length","max":10,"min":0.00779,"avg":1.48252},{"param":"dist_elect","max":10,"min":0.04121,"avg":1.47331}]}]
       

       //this_app.scores.filter(d=>d.param==param)[0].value=values[0];

       
       
       var user_pop_sum_score=this_app.scores.filter(d=>d.param=='pop_sum')[0].value;
       var user_elec_legth_score=this_app.scores.filter(d=>d.param=='elec_length')[0].value;
       var user_dist_elect_score=this_app.scores.filter(d=>d.param=='dist_elect')[0].value;
       
 
        

       /*  var d=this_app.uniqueFeatures.map(d=>
            {
                var feature=d;
                var total_score=0;
                      
                var fields = [
                    { code: 'pop_sum', label: 'Sum population' },
                    { code: 'dist_elect', label: 'Distance to grid' },
                    { code: 'elec_length', label: 'Km of grid' }
                ]
        
                return fields.map((d) => {
        
                    var code=d.code;
                    var score_code=d.code+'_score';
                    var user_score=this_app.scores.filter(d=>d.param==code)[0].value;
        
                    return feature.properties[score_code]*user_score;
                    
                })
        
                
            })
        console.warn(d) */
       
        
       map.setFilter('voronois_data',["all",['==','adm0_code',this_app.adm0_code] ,['==', 'nea', 'yes']]);
       map.setFilter('voronois_data_line',["all",['==','adm0_code',this_app.adm0_code] ,['==', 'nea', 'yes']]);

       map.setLayoutProperty('voronois_data', 'visibility', 'visible');
       map.setLayoutProperty('voronois_data_line', 'visibility', 'visible');

       if (!this_app.uniqueFeatures.filter(d=>d.adm0_code==this_app.adm0_code).length)
       {
           setTimeout(function()
              {
                  console.info('waiting for map to load...')
                  var features=map.querySourceFeatures('voronois_data_source',{ sourceLayer: 'voronois_all',filter:map.getFilter('voronois_data')});
                  //var features=map.queryRenderedFeatures({ layers: ["voronois_data"] });                        
                  var uniqueFeatures=getUniqueFeatures(features,'id');
                  this_app.uniqueFeatures.push({adm0_code:this_app.adm0_code,f:
                      uniqueFeatures                            
                      });                     

                  this_app.feature_stats(uniqueFeatures);
                      
              },2500)
       }
       else
       {
          //we have already plotted this country, so we can use the cached data
          var uniqueFeatures=this_app.uniqueFeatures.filter(d=>d.adm0_code==this_app.adm0_code)[0].f;
          this_app.feature_stats(uniqueFeatures);
          
       }
      
          //   var domain = [scores_stats.min_val, scores_stats.avg_val, scores_stats.max_val];
       // create_score_svg('scores_svg',scores_stats);
            
    //},2000)
    }


    setTimeout(function() {
    //['pop_slider',
    ['pop_sum_slider','dist_elect_slider','elec_length_slider'].forEach(function(slider_id)
    {
    
        
        this_app[slider_id] = document.getElementById(slider_id);
        
        noUiSlider.create(this_app[slider_id], {
            animate: false,
            start: 1,
            tooltips: true, // no tooltip
            behaviour: 'drag',
            direction: 'ltr',
            connect: true,
            step: 1,
            range: {
                'min': 0,
                'max': 10
            },
            format:{
                to: (v) => v | 0,
                from: (v) => v | 0
            }
        });
      
     

        var score_throttled_interval = _.throttle(update_by_score, 1500);
        
        this_app[slider_id].noUiSlider.on('update', function(values) {

            if (first_load==true)
            return false;

            var param=$('#'+slider_id).parents().closest('.collection-item').attr('class').split(' ')[1];//.split('_slider')[0];
            console.log(param,values[0],$('#'+slider_id))
            $('#'+slider_id).parent().find('.hover-val').text(values[0]);
            

            this_app.scores.filter(d=>d.param==param)[0].value=values[0];
            score_throttled_interval();
            
            /* console.log(layer_id) */
            /* var l = app_data.layers_info.filter(d => d.id == this_app.event_layer.name)[0];
            l.active_opacity = +values[0];
            
            opacity_throttled_interval(); */
            // update_slider_actions(values)
        });

    });
    
},1500)
    
  

    $('.tabs a').eq(0).click();
    

    $('.analysis_layer').on('click', function(e) {
    
    console.info(target)
    if ((e.originalEvent)) {


        var target = $(e.target);
        
    
        if (target.hasClass('layers')) {
            var layer_name = $(this).attr('level');
            var l = app_data.layers_info.filter(d => d.id == layer_name)[0];
            if (!target.hasClass('activated')) {

            console.warn(l)
            console.log(l.type);
            if (l._layer.type==='raster') {
                //always on the bottom!
                map.addLayer(l._layer, map.getStyle().layers[2].id);
            } else {
            map.addLayer(l._layer);
            }
            } else {
                map.removeLayer(l.id);
            }

            target.toggleClass('activated');
            $(this).find('.card-content-content').toggleClass('hidden')
        }
    }


})
$('.hide_voronois').on('click', function() {

    if ($(this).hasClass('activated')) {
        map.setPaintProperty('voronois_data', 'fill-opacity', 1);
        $(this).text('Hide Voronois');
    }
    else{
        $(this).text('Show Voronois');
        map.setPaintProperty('voronois_data', 'fill-opacity', 0);
    }
    $(this).toggleClass('activated');
})
})
