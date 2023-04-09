# ons-spd
ONS SPD


create schema onsspd;

CREATE TABLE onsspd.parishes (
	parncp21cd varchar(15) NOT null primary key,
	parncp21nm text not null,
	createdAt timestamp not null DEFAULT now(),
	updatedAt timestamp null
);

CREATE TABLE onsspd.counties (
	cty21cd varchar(15) NOT null primary key,
	cty21nm text not null,
	createdAt timestamp not null DEFAULT now(),
	updatedAt timestamp null
);

CREATE TABLE onsspd.grid_reference_positional_quality_indicator (
	osgrdind integer NOT null primary key,
	description text not null,
	createdAt timestamp not null DEFAULT now(),
	updatedAt timestamp null
);

create table onsspd.postcodes (
	pcds varchar(8) NOT null primary key,
	parish varchar(15) NOT null,
	ctry varchar(15) NOT null,
	oseast1m integer,
	osnrth1m integer,
	osgrdind integer NOT null,
	longitude decimal,
	latitude decimal,
	createdAt timestamp not null,
	updatedAt timestamp null,
	
	
	constraint fk_counties_postcodes
     foreign key (ctry) 
     REFERENCES onsspd.counties (cty21cd),
	
	constraint fk_grid_reference_positional_quality_indicator_postcodes
     foreign key (osgrdind) 
     REFERENCES onsspd.grid_reference_positional_quality_indicator (osgrdind),
	
	constraint fk_parishes_postcodes
     foreign key (parish) 
     REFERENCES onsspd.parishes (parncp21cd)
);
