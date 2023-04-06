# mvtec_geo
Most of the health centres (HC) in sub-saharian Africa have no access to electricity

The Clean Energy Access tool (https://africa-knowledge-platform.ec.europa.eu/energy_tool) provides geographic layers to explore, interact and analyse, in order to get some insights about in which areas the installation of photovoltaic systems should be a priority

The developed tool here (https://pere.gis-ninja.eu/mvtec/index_dev.html) provides a new interactive methodology using some of this data:
-Health centres
-Population
-Electric grid

A voronoi polygonal layer has been created for 3 countries, using the HC without electricity as input. 
We can calculate then (point-in-polygon operation) how much people are served by each health centre (as this is their closest health centre)

Using an intersection operation, it was also calculated how many kilometers of electric grid are present on each polygon, as well as the distance from its hospital to this grid.
A scaled score (0-10) is calculated for each of these parameters. These values will be modified interactively by the user to establish its 'health centre electrification' priorities.

-Do we have only budget for small photovoltaic systems? we should give more priority to areas that are low populated and it’s distance to the grid is big: the user can set up ‘population priority’ to 1, and 10 for ‘distance to grid’

-The contrary would be if the budget can be used to connect to the main line: user may search densely populated areas relatively close to the grid

The tool has been developed using PostGIS + Geoserver, MapLibreJS and some d3js functionalities.

User can also print the map, apply different color scales and different background layers

All the code (including some PHP and all the SQL functions) can be found in the GitHub
The spatial operations, executed in SQL can be found in the PHP file 
