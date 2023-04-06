
function add_external_sources()
{
    map.addSource("black_cartodb", {
        "type": "raster",
        "tiles": ["https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"],
        //"tiles":["https://api.maptiler.com/maps/pastel/{z}/{x}/{y}.png?key=PfeqCqeOXLcGceolGsUb"],

        'tileSize': 512
    });

    this_app.black_cartodb = {
        active: true,
        'id': 'black_cartodb',
        'type': 'raster',
        'source': 'black_cartodb',
        'layout': {
            // Make the layer visible by default.
            'visibility': 'visible'
        },

    }

    map.addSource("maptiler_osm_source", {
        "type": "raster",
        "tiles": ["https://api.maptiler.com/maps/openstreetmap/{z}/{x}/{y}.jpg?key=PfeqCqeOXLcGceolGsUb"],
        //"tiles":["https://api.maptiler.com/maps/pastel/{z}/{x}/{y}.png?key=PfeqCqeOXLcGceolGsUb"],

        'tileSize': 512
    });

    this_app.maptiler_osm = {
        active: false,
        'id': 'maptiler_osm',
        'type': 'raster',
        'source': 'maptiler_osm_source',

    }


    map.addSource("maptiler_streets_source", {
        "type": "raster",
        "tiles": ["https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=PfeqCqeOXLcGceolGsUb"],
        //"tiles":["https://api.maptiler.com/maps/pastel/{z}/{x}/{y}.png?key=PfeqCqeOXLcGceolGsUb"],

        'tileSize': 512
    });

    this_app.maptiler_streets = {
        active: false,
        'id': 'maptiler_streets',
        'type': 'raster',
        'source': 'maptiler_streets_source',

    }

    map.addSource("maptiler_winter_source", {
        "type": "raster",
        "tiles": ["https://api.maptiler.com/maps/winter/{z}/{x}/{y}.png?key=PfeqCqeOXLcGceolGsUb"],

        //"tiles":["https://api.maptiler.com/maps/pastel/{z}/{x}/{y}.png?key=PfeqCqeOXLcGceolGsUb"],

        'tileSize': 512
    });

    this_app.maptiler_winter = {
        active: false,
        'id': 'maptiler_winter',
        'type': 'raster',
        'source': 'maptiler_winter_source',

    }



    map.addSource("white_cartodb", {
        "type": "raster",
        id: 'white_cartodb',
        "tiles": ["https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"],
        'tileSize': 240
    });
    this_app.white_cartodb = {
        active: false,
        'id': 'white_cartodb',
        'type': 'raster',
        'source': 'white_cartodb',
        'layout': {
            // Make the layer visible by default.
            'visibility': 'none'
        },
    }
    map.addSource("terrascope_source", {
        "type": "raster",
        id: 'terrascope_satellite',

        "tiles": ["https://services.terrascope.be/wmts/v2?layer=WORLDCOVER_2020_S2_TCC&style=&tilematrixset=EPSG:3857&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png&TileMatrix=EPSG:3857:{z}&e&TILECOL={x}&TILEROW={y}&TIME=2022-07-05"]

    });


    this_app.terrascope_satellite = {
        id: 'terrascope_satellite',
        type: 'raster',
        source: 'terrascope_source'

    }
    new mapboxglEsriSources.TiledMapService('imagery-source', map, {
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
            // url:'https://services.terrascope.be/wmts/v2?layer=CGS_S2_FAPAR&style=&tilematrixset=EPSG:3857&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png&TileMatrix=EPSG:3857:6&TileCol=33&TileRow=21&TIME=2020-05-27'
            // url:'https://services.terrascope.be/wmts?layer=PROBAV_S10_TOC_COLOR&style=default&tilematrixset=g3857&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png&TileMatrix=7&TileCol=66&TileRow=41&TIME=2020-05-11'
    })

    this_app.esri_satellite = {
        id: 'esri_satellite',
        type: 'raster',
        source: 'imagery-source',
        //  source:'terrascope_source',
        'layout': {
            // Make the layer visible by default.
            'visibility': 'none'
        }
    }
    // map.addSource('ghs_africa_250m_bigger_1_5_source', {
    //     'type': 'raster',
    //     'tiles': [               
    //             'https://geospatial.jrc.ec.europa.eu/geoserver/wms?service=WMS&version=1.1.0&request=GetMap&layers=hotspots:pop_ghs_bigger_1_5_4326&STYLES=hotspots:ghs_250m_new_legend&transparent=true&bbox={bbox-epsg-3857}&width=768&height=585&srs=EPSG:3857&format=image/png'

    //         ]
    //         //'tileSize': 256
    // });
    // var ghs_africa_250m_bigger_1_5 = {
    //     id: 'ghs_africa_250m_bigger_1_5',
    //     'type': 'raster',
    //     'source': 'ghs_africa_250m_bigger_1_5_source',
    //     //'source': 'ghs_250m_bigger_than_2_source',
    //     'paint': {}
    // };

    // map.addLayer(this_app.maptiler_winter);
    //map.addLayer(ghs_africa_250m_bigger_1_5)
    //   map.addLayer(this_app.black_cartodb);
    //this_app.active_blayer = 'maptiler_osm';
    //   map.addLayer(satellite);
    //map.addLayer(this_app.maptiler_osm);
    //this_app.active_blayer = 'black_cartodb';

    this_app.active_blayer = 'maptiler_winter';

    class colors_ctrl {
        onAdd(map) {
            this.map = map;
            this.container = document.createElement('div');
            //this.container.className = 'click_country_control_container';
            this.container.className = 'colors_ctrl';

            return this.container;
        }
        onRemove() {
            this.container.parentNode.removeChild(this.container);
            this.map = undefined;
        }
    }


    class print_ctrl {
        onAdd(map) {
            this.map = map;
            this.container = document.createElement('div');
            //this.container.className = 'click_country_control_container';
            this.container.className = 'print_ctrl';

            return this.container;
        }
        onRemove() {
            this.container.parentNode.removeChild(this.container);
            this.map = undefined;
        }
    }

    var print_ctrl_ = new print_ctrl();
    map.addControl(print_ctrl_, 'top-right');

    $('.print_ctrl').addClass('mapboxgl-ctrl');
    $('.print_ctrl').append('<button class="mapboxgl-ctrl-icon print_map tooltiped" type="button" data-position="left" data-tooltip="Print map" aria-label="Print map"><i class="material-icons">print</i></button>');

    $('.print_map').on('click', function() {
       // $('.feature_map_popup').hide();
        //$('.mapboxgl-control-container').hide();

        var mapCanvas = document.getElementsByClassName('mapboxgl-canvas')[0];
        var mapDiv = document.getElementById('map');

        html2canvas(mapDiv,{useCORS:true}).then(canvas => {
            console.warn('printing map')
                // html2canvas(document.querySelector(".d3_legend ")).then(canvas => {
            console.warn(canvas)
            var imgageData = canvas.toDataURL("image/png");

            var newData = imgageData.replace(/^data:image\/png/, "data:application/octet-stream");

            //if (this_app.print_on_pdf == false) {
            $("<a>", {
                    href: imgageData,
                    download: "map.png",
                    on: {
                        click: function() {
                            $(this).remove()
                        }
                    }
                })
                .appendTo("body")[0].click();
            $('.mapboxgl-control-container').show();


        })
    })
    


    map.addControl(new colors_ctrl(), 'top-right');
    $('.colors_ctrl').addClass('mapboxgl-ctrl');
    $('.colors_ctrl').append('<button class="mapboxgl-ctrl-icon color_schema_btn tooltiped" data-position="left" type="button" data-tooltip="Change color schema">'
    +'<i class="material-icons">invert_colors</i></button>');
   
    var schemas_arr = ['interpolateGreens','interpolateRainbow', 'interpolateSinebow', 'interpolateRdYlBu', 'interpolateInferno', 'interpolateRdPu', 'interpolateSpectral', 'interpolateViridis', 'interpolateReds', 'interpolateYlOrRd', 'interpolatePlasma', 'interpolateWarm', 'interpolateRdYlGn', 'interpolatePiYG'];
    var html = '<span class="instructions">Change layer symbolization</span>'
    html += '<ul class="color_schema_collection">';
    for (var p in schemas_arr) {
        var s = schemas_arr[p];

        html += '<li class="collection-item"><div class="collection_gradients ' + s + ' row">'
        html += '<span class="col s11"><svg class="' + s + '"></svg></span></div>' +
            '</li>';
    }
    html += '</ul>';

    class colors_legend_control {
        onAdd(map) {
            this.map = map;
            this.container = document.createElement('div');
            //this.container.className = 'click_country_control_container';
            this.container.className = 'colors_legend_control_container';

            return this.container;
        }
        onRemove() {
            this.container.parentNode.removeChild(this.container);
            this.map = undefined;
        }
    }
    //var legend_control_ctrl = new map_legend_control();

    map.addControl(new colors_legend_control(), 'top-right');
   $('.colors_legend_control_container').append(html); 

    $('.color_schema_btn').on('click', function() {
        if ($('.colors_legend_control_container').hasClass('active'))
            $('.colors_legend_control_container').hide();
        else
            $('.colors_legend_control_container').show();

        $('.colors_legend_control_container').toggleClass('active')
    });

    $('.colors_legend_control_container').find('.collection-item').on('click', function() {

        $('.colors_legend_control_container').find('.collection-item.active').removeClass('active');
        this_app.interpol_name=$(this).find('svg').attr('class');
        $(this).addClass('active');

        console.warn(this_app.uniqueFeatures)
        var uniqueFeatures=this_app.uniqueFeatures.filter(d=>d.adm0_code==this_app.adm0_code)[0].f;
        this_app.feature_stats(uniqueFeatures);
    });
    $('.colors_legend_control_container').find('.collection-item').each(function() {

        var interpol_name = $(this).find('div.collection_gradients').attr('class').split(' ')[1];

        //if (interpol_name == this_param.active_param_scale) {

         //   $(this).addClass('active');
           // this_param.active_param_scale = interpol_name;
        //}
        //var svg = d3.select('svg.'+interpol_name+',.'+this_app.event_layer.name);
        var svg = d3.select('svg.' + interpol_name);
        console.log(svg)

        console.warn(svg)
        var n = 10;

        //popper.css width
        var w = 190;
        var sel_colorScale_filter = d3.scaleSequential(d3[interpol_name])
            .domain([0, 6])
        
        var colors = d3.range(n).map(function(d, i) {
          
            return sel_colorScale_filter(i)            
        });

        /* .gradients {
            height: 15px; */

        svg.style('width', w + 'px');
        svg.style('height', '15px');
        svg.style('transform', 'translate(0px,5px')
        var defs = svg.append("defs");
        var gradient = defs.append("linearGradient")
            .attr("id", interpol_name + '_gradient')            
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "0%");

        //Append multiple color stops by using D3's data/enter step  
        gradient.selectAll("stop")
            .data(colors)
            .enter().append("stop")
            .attr("offset", function(d, i) {

                return (i / n)*100 + "%";
            })
            .attr("stop-color", function(d, i) {
                return d;
            });
        console.log(gradient)

        var rect = svg.append("rect")
            .attr('class', 'rect_legend')
            .attr('width', w)
            .attr('height', 15)
            .attr("fill", "url(#" + interpol_name + "_gradient")
            //.attr("fill", "url(#svgGradient)")

    })



    class blayer_ctrl {
        onAdd(map) {
            this.map = map;
            this.container = document.createElement('div');
            //this.container.className = 'click_country_control_container';
            this.container.className = 'blayer_ctrl';

            return this.container;
        }
        onRemove() {
            this.container.parentNode.removeChild(this.container);
            this.map = undefined;
        }
    }

    var blayer_ctrl_ = new blayer_ctrl();
    map.addControl(blayer_ctrl_, 'top-right');
    $('.blayer_ctrl').addClass('mapboxgl-ctrl');
    $('.blayer_ctrl').append('<button class="mapboxgl-ctrl-icon blayer tooltiped" data-position="left" type="button" data-tooltip="Change base layer" aria-label="Change baselayer"><i class="material-icons">wallpaper</i></button>');

    $('#menu').css('top', parseInt($('.blayer').position().top) + 'px')
    $('.blayer').on('click', function() {
        if ($('#menu').hasClass('active'))
            $('#menu').hide();
        else
            $('#menu').show();

        $('#menu').toggleClass('active')
    });


    $('#menu #baselayers_switcher').on('click', function(e) {


        if ($(e.target).is('input')) {
            $(this).find('input').each(function(i, elem) {

                var _this = $(elem);

                _this.prop('checked', false)

            });
            $(e.target).prop('checked', true)

                    var _id = $(e.target).attr('id');
                        //previously active
                    var active_id = this_app.active_blayer;
                    if (!map.getLayer(_id)) {
                        map.addLayer(this_app[_id], map.getStyle().layers[0].id)
                        this_app.active_blayer = _id;

                        map.removeLayer(active_id);

                        setTimeout(function() {
                            console.warn(_id)
                            map.setLayoutProperty(_id, 'visibility', 'visible');
                        }, 1500)


                    }
                }
            })
   

   
    
}