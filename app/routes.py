from app import app
from flask import render_template, redirect, request, jsonify
from app.utils import utils
import pandas as pd
from googleplaces import GooglePlaces, types, lang 
import requests 
import json 

@app.route('/home', methods=['GET', 'POST'])
def home():
    return render_template("index.html")
@app.route('/submit',methods=['GET','POST'])
def submit():
	data = None
	if request.method == 'POST':
		data = request.form['data']
	# return render_template("submit.html", data=req)
		data = eval(data)
		condition = data[1].strip()
		lat = float(eval(data[0])[0])
		lng = float(eval(data[0])[1])
		if data[2] == 'E':

			df = pd.read_csv('app/db/sc_hospitals.csv')
			df_filtered = df[df[condition]=='yes']
			# df_filtered['Latitude'] = df_filtered.apply(lambda x: float(x))
			# df_filtered['Longitude'] = df_filtered.apply(lambda x: float(x))
			df_filtered['distance'] = df_filtered[['Longitude','Latitude']].apply(lambda x: utils.haversine(lng,lat,*x),axis=1)
			best = df_filtered.loc[df_filtered['distance'].idxmin()]
			best_lat = best['Latitude']
			best_lng = best['Longitude']
			best_name = best['Hospital']
			best_dict = {
			'lat': best_lat,
			'lng': best_lng,
			'name': best_name
			}
			return jsonify(best_dict)
			# return render_template("submit.html",lat=best_lat,lng=best_lng,hospital=best_name)
		
		else: 
			with open('app/p_key.txt') as f:
				api_key = f.readline()
				f.close
			# center = (37.4275, 122.1697)
			google_places = GooglePlaces(api_key)
			query_result = google_places.nearby_search(lat_lng ={'lat': lat, 'lng': lng},radius=5000,types=[types.TYPE_HOSPITAL])
			clinic = query_result.places[0] 
			clinic_lat = float(clinic.geo_location['lat'])
			clinic_lng = float(clinic.geo_location['lng'])
			clinic_name = clinic.name
			clinic_dict = {
				'lat': clinic_lat,
				'lng': clinic_lng,
				'name': clinic_name
			}
			return jsonify(clinic_dict)

			