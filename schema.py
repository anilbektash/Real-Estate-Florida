#!/usr/bin/python
import MySQLdb

db = MySQLdb.connect("localhost", "root", "root", "florida")
cursor = db.cursor()
#creates the users database
try:
	sql1 = "DROP DATABASE florida;"
	sql2 = "Create DATABASE florida;"
	cursor.execute(sql1)
	cursor.execute(sql2)
	db.commit()
except:
    db.rollback()

db.close()
