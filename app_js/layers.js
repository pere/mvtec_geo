app_data = {
    layers_info: [],
  
};

var ghs_africa_250m_bigger_1_5 = {
    id: 'ghs_africa_250m_bigger_1_5',
    type: 'raster',
    'source': 'ghs_africa_250m_bigger_1_5_source',
    //'source': 'ghs_250m_bigger_than_2_source',
    'paint': {}
};

app_data.layers_info.push({
    // _layer: ghs_africa_250m_bigger_2,
    // id: 'ghs_africa_250m_bigger_2',
    _layer: ghs_africa_250m_bigger_1_5,
    id: 'ghs_africa_250m_bigger_1_5',
    raster: true,

    queryable: true,
    activated_query: false,
    title: 'Population (inhabitants/250 m2)'
        // more_info_html:'The criteria used to delineate the electrified areas were:i)	Populated areas located within a 5 km distance to the existing electricity grid ii)	Settlements with detected night time light> Areas where the probability of a household having electricity is higher than 10%'

});

var electric_grid = {
    "id": "electric_grid",
    "type": "line",
    "source": "electric_grid_source",
    //"source-layer": "electric_grid_classif2",
    "source-layer": "electric_grid_new_gaul",
    'layout': {
        'visibility': 'visible'
    },
    "paint": {

        "line-color": "#f032e6",


        "line-width": [
            "interpolate", ["linear"],
            ["zoom"],
            3,
            0.5,
            5,
            0.8,
            7,
            1.2,
            9,
            1.8
        ],
        "line-dasharray": [2, 0.5],
        "line-opacity": 1

    }
};

app_data.layers_info.push({
    _layer: electric_grid,
    id: 'electric_grid',
    _type: 'line',
    style: {
        "line-color": "#f032e6",
        "line-dasharray": [2, 0.5],
        "line-opacity": 1
    }
});


var hospitals = {
    "id": "hospitals",
    "type": 'circle',
    "source": "hospitals_source",    
    'source-layer': 'health_centres',
    'layout': {
        'visibility': 'visible'

    },
    "paint": {

       
        "circle-radius": [
            "interpolate", ["exponential", 1],
            ["zoom"],
            3,
            1,
            7,
            2,
            13,
            6
        ],
        //kind of grey
        "circle-stroke-color": "#b9bacc",
     
        "circle-stroke-width": [
            "interpolate", ["exponential", 1],
            ["zoom"],
            5,
            0,
            6,
            0.2,
            10,
            0.5,
            16,
            2
        ],
        "circle-opacity": [
            "match", ["get", "nea"],
            ["yes"], 1, ["no"], 0.5,
            0

        ],
        "circle-stroke-opacity": [
            "match", ["get", "nea"],
            ["yes"], 1, ["no"], 0.2,
            0

        ],
  
        "circle-color": [
            "match", ["get", "nea"],
            ["yes"],
            "hsl(224, 93%, 53%)",

            ["no"],
            "#f5430c",
         
            "#eee"
        ]


    }
};

app_data.layers_info.push({
    _layer: hospitals,
    id: 'hospitals'
    
});
    