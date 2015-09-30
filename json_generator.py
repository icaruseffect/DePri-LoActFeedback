#!/usr/bin/env python3
import json, datetime, time, random, codecs

MAX_HISTORY = 30
MIN_HISTORY = 10

def generate (gen_name):
    gen = []
    min = 2
    max = 5
    for i in range ( random.randint(min, max)):
        gen.append( (gen_name + " " + str(i) ) )
    #print (gen)
    return gen

def rantime():
     year = 2015
     month =  random.randint(1,12)
     day =  random.randint(1,30)
     hour = random.randint(0,23)
     minute =  random.randint(0, 59)
     parsestring =   str(year) + " " + str(month) + " "+  str(day) + " " + str(hour) + " "   + str(minute)
     parsed = time.strptime( parsestring , "%Y %m %d %H %M")
     return parsed


def concat ():
    house = {"name" : "Haus", "children": [] }
    random_structime = time.mktime ( rantime( )  )

    house['timestamp'] = ( time.mktime( rantime() ) )

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
                devicedict["active"] = bool(random.getrandbits(1))
                roomdict[u"children"].append(devicedict)

            leveldict[u"children"].append(roomdict)

        house["children"].append(leveldict)


    return house

def timerange ( ):
    samples = []
    for i in range (random.randint(MIN_HISTORY, MAX_HISTORY)  ):
        samples.append( concat() )
    return json.dumps( samples ,"utf-8", sort_keys=False, indent=4)


with codecs.open( "randcollection.json", 'w' ,"utf-8" ) as output_file:
    output_file.write( timerange()  )
