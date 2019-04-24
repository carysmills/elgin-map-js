import googlemaps
import csv
import json
import requests

key = 'AIzaSyDICKv0OQZvErzGajcsPoTJMY2aRXGxqtY'
gmaps = googlemaps.Client(key=key)

csv_path = 'march.csv'
with open(csv_path) as csv_file:
    csv_reader = csv.DictReader(csv_file, delimiter=',')
    csvwriter = csv.writer(csv_file, delimiter=",")
    for row in csv_reader:
        lookup = row['name'] + ', Elgin Street, Ottawa'
        places = gmaps.places(lookup)
        r = json.dumps(places)
        loaded_r = json.loads(r)
        results =  loaded_r['results'][0]

        id = row['id']
        rating = results['rating']
        name = results['name'].encode('ascii', 'ignore').decode('ascii')
        permanently_closed = results.get('permanently_closed', 'false')
        types = results['types'][0].encode('ascii', 'ignore').decode('ascii')
        
        print id, name, types, rating, permanently_closed

        with open('march_results.csv', 'a') as csv_file:
            csvwriter = csv.writer(csv_file, delimiter=",")
            csvwriter.writerow([id, name, types, rating, permanently_closed])