#!/usr/bin/python
import MySQLdb

db = MySQLdb.connect("localhost", "root", "root", "florida")
cursor = db.cursor()
#creates the users database
try:
    sql     = "create table if not exists users(id integer primary key auto_increment, password varchar(100) not null, name varchar(100) not null, surname varchar(100) not null, email varchar(100) unique not null);"
    sql2    = "create table if not exists estate(id bigint primary key, userID integer not null, name varchar(100) not null, price decimal(12, 2) not null, area integer, bed integer, bath integer, date DATE, cur_time time)"
    sql3    = "create table if not exists location(id bigint, street_num varchar(20), street_name varchar(100), apt_num varchar(20), city varchar(100), state varchar(100), zipcode varchar(10))"
    sql4    = "create table if not exists text(id bigint, text varchar(1000))"

    cursor.execute(sql)
    cursor.execute(sql2)
    cursor.execute(sql3)
    cursor.execute(sql4)
    db.commit()
except:
    db.rollback()

db.close()
