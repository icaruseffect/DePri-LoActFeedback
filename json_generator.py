#!/usr/bin/env python3
import json, datetime, time, random, codecs

def generate (gen_name):
    gen = []
    min = 2
    max = 5
    for i in range ( random.randint(min, max)):
        gen.append( (gen_name + " " + str(i) ) )
    #print (gen)
    return gen

def concat ():
    house = {"name" : "Haus", "children": [] }
    house['timestamp'] = ( time.time() )

    levels = generate("Etage")
    for level in levels:
        leveldict = { "name" : level, "children" : [] }

        rooms = generate(u"Raum")
        for room in rooms:
            devices = generate(u"Geraet")
            roomdict = { u"name" : room, u"children" : [] }
            roomdict[u"persons"] = random.randint(0, 3)


            for device in devices:
                devicedict = {}
                devicedict[u"name"] = device
                devicedict[u"value"] = random.randint(100, 1500)
                roomdict[u"children"].append(devicedict)

            leveldict[u"children"].append(roomdict)

        house["children"].append(leveldict)


    return house

def timerange ( ):

    return json.dumps( concat(),"utf-8", sort_keys=False, indent=4)

with codecs.open( "randcollection.json", 'w' ,"utf-8" ) as output_file:
    output_file.write( timerange()  )
