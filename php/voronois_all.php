<?php

$link = pg_connect("host=xxxxx dbname=xxxx user=xxx password=geoservxxxer");

//Congo, Malawi,Ghana
$arr=array(68,152,94);
foreach($arr as $code)
{
    
$sql="WITH points(geom) AS 
(SELECT geom,adm0_code,nea from mvtec.health_centres where adm0_code=$code)

insert into mvtec.voronois_all (geom,adm0_code)
(select (ST_DUMP(ST_VoronoiPolygons(ST_Collect(geom)))).geom,
$code from points);";

//we clip with the country boundaries
$sql.="update mvtec.voronois_all set geom=q.geom from
(
 select vor.id as _id,vor.adm0_code,
 ST_Intersection(vor.geom, gaul.geom) as geom
	
	FROM mvtec.voronois_all as vor
	JOIN gaul_0_simplified as gaul
ON 
gaul.adm_0_code=$code
and ST_Intersects(vor.geom, gaul.geom)
) q
where q._id=mvtec.voronois_all.id;";

//we get the HC id
$sql.="update mvtec.voronois_all 
set nea=subquery.nea from
(
select polygons.id,points.nea from
	health_centres_updated as points,
	mvtec.voronois_all as polygons
	
	where polygons.adm0_code=$code
	and
	points.adm0_code=$code
	and
	ST_Contains(polygons.geom,points.geom)
)
AS subquery
WHERE  subquery.id = mvtec.voronois_all.id;";


$sql.="with q as (select 
     voronoi.id,
    count (px_val),sum(px_val) from ghs_new_bigger_1_5 ghs 
	join mvtec.voronois_all voronoi
	
	on 
		 voronoi.adm0_code=$code
		   and
		   		 ghs.adm0_code=$code
		   and
		   ST_Within(ghs.geom,voronoi.geom)
	group by 
	voronoi.geom,voronoi.id) 

update mvtec.voronois_all set 
--number of pixels
pop_count=(select count from q where mvtec.voronois_all.id=q.id),
--sum of off-grid population
pop_sum=(select sum from q where mvtec.voronois_all.id=q.id);";

//calculate of distance from health centre to the nearest grid
//25 minutes for RDC!
$sql.="with q as
(SELECT a.id as point_id,
    a.facility_n,
    cl.id,
    st_shortestline(a.geom, cl.geom) AS line

   FROM mvtec.health_centres a,
    energy_new.electric_grid_new_gaul2 cl,
    ( SELECT _a.id AS a_fid,
            ( SELECT _cl.id
                   FROM energy_new.electric_grid_new_gaul2 _cl
                 where _cl.adm0_code=$code
                 and _a.adm0_code=$code 
                  ORDER BY (st_distance(geography(_a.geom), geography(_cl.geom)))
                 LIMIT 1) AS cl_fid
           FROM mvtec.health_centres _a) a_cl
  WHERE a_cl.a_fid = a.id AND a_cl.cl_fid = cl.id
)
update mvtec.health_centres set dist_elect=sub_q.dist
from
(
select point_id,round(ST_Length(ST_Transform(line,102022))::numeric/1000,2) dist from q
	) as sub_q 
	
	where sub_q.point_id=mvtec.health_centres.id
  
update mvtec.voronois_all set dist_elect=sub_q.dist
from (
	select id,dist_elect from mvtec.health_centres
	
) as sub_q 
where sub_q.id=mvtec.voronois_all.id;";

//we need to update polygons with the health center id!!
$sql.="update mvtec.voronois_all set hc_id=sub_q.hc_id,dist_elect=sub_q.dist_elect
from (
	select 
	point.id as hc_id,
	pol.id as pol_id,
	point.dist_elect from 
	mvtec.health_centres point
	join mvtec.voronois_all pol
	on 
point.adm0_code=$code
	and 
pol.adm0_code=$code
	and
	ST_Within(point.geom,pol.geom)
) as sub_q 
where sub_q.pol_id=mvtec.voronois_all.id;


with q as 
(
 select  min(dist_elect),max(dist_elect),
	(max(dist_elect)-min(dist_elect)) as diff
 from mvtec.voronois_all
	where adm0_code=$code
)"; 

//only where health centres are out of the grid
$sql.="UPDATE mvtec.voronois_all
SET elec_length = subquery.length_km
FROM (
    SELECT polygons.id, round(SUM(ST_Length(ST_Intersection(lines.geom, polygons.geom)::geography)::numeric/1000),2)
	as length_km
    FROM energy_new.electric_grid_new_gaul2 as lines, 
    mvtec.voronois_all as polygons
    WHERE 
	polygons.nea='yes' 
	and polygons.adm0_code=$code
	and   lines.adm0_code=$code
	and ST_Intersects(lines.geom, polygons.geom)
    GROUP BY polygons.id
) AS subquery
WHERE  
mvtec.voronois_all.adm0_code=$code
and
subquery.id = mvtec.voronois_all.id;";

//we do this for all parameters (pop, dist_elect, elec_length...)
$sql.="with q as 
(
 select  min(dist_elect),max(dist_elect),
	(max(dist_elect)-min(dist_elect)) as diff
 from mvtec.voronois_all
	where adm0_code=$code
)"; 

//based on mins, max and diff we calculate the score for each polygon
//this score is the one we will paint the map with. User will change the score interactively 
//recalculating and re-painting the map accordingly
$sql.="insert into 
 mvtec.stats (adm0_code,param,min,max,diff) 
 (select $code,'dist_elect',min,max,diff from q)

update mvtec.voronois_all
set dist_elect_score=q.score from 
(
	select id,
	(dist_elect*10)/ (select diff from mvtec.stats 
		where param='dist_elect'
	and adm0_code=152) as score
	from mvtec.voronois_all
	where adm0_code=152
)
as q
where q.id=mvtec.voronois_all.id;";

echo '<br>'.$sql;

}

?>