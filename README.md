# ons-spd
ONS SPD



CREATE TABLE parishes (
	parncp21cd varchar(15) NOT null primary key,
	parncp21nm text not null,
	createdAt timestamp not null DEFAULT now(),
	updatedAt timestamp null
);

create table postcodes (
	pcds varchar(8) NOT null primary key,
	parish varchar(15) NOT null,
	oseast1m integer,
	osnrth1m integer,
    longitude decimal,
	latitude decimal,
	createdAt timestamp not null,
	updatedAt timestamp null,
	
	constraint fk_parishes_postcodes
     foreign key (parish) 
     REFERENCES parishes (parncp21cd)
);

