import json, datetime, time, threading
from urllib.request import urlopen
'''
Dieses Python Script lädt ein aktuelles Datenset vom Demo-Server und hängt dieses mit einem Timestamp
Key-Value Paar an die collected.json an.
Das Script ist darauf ausgelegt, als Cronjob zu laufen um eine Kleine Datensammlung für die History
Funktion zu erhalten.
'''



INPUT_FILE = OUTPUT_FILE = 'collected.json'
#INPUT_FILE = 'app/js/data.json'
URL = 'http://176.198.133.123:8080/WebServiceClient/sampleHomeBereichProxy/Result.jsp?method=16'
old_data = None
data_list = []
id = 0

def load_json():
    with open(INPUT_FILE, 'r', ) as input_file:
        json_input = ( input_file.read() )
        json_data = json.loads( json_input)
        return json_data



def dump():
    '''
    pretty print the filels
    '''
    dump =   json.dumps(data_list  ,"utf-8", sort_keys=False, indent=4)
    print("export to json done")
    return dump

def appendToFile(data):
    '''
    append to output file
    '''
    with open( OUTPUT_FILE, 'w' ) as output_file:
        output_file.write( data )
    print("written to file")




def get_jsonparsed_data(url):
    """
     from http://stackoverflow.com/questions/12965203/how-to-get-json-from-webpage-into-python-script
     Receive the content of ``url``, parse it as JSON and return the  object.
    """
    response = urlopen(url)
    encoding = response.headers.get_content_charset()
    return json.loads(response.read().decode(encoding))


def timestamp(data):
    '''
    timestamp an das objekt anhängen, mit der aktuellen Zeit im Iso-Format
    '''
    data['timestamp'] = ( datetime.datetime.now().isoformat() )
    return data


data_list = load_json()
data = get_jsonparsed_data(URL)
'''


if ( len( data_list ) == 0 or data_list[ len( data_list) -1] != data ):
    old_data = data
    data_list.append( timestamp(data)  )
    print("Neue Daten hinzugefügt" )
else:
    print("Keine neuen Daten")
'''
data_list.append( timestamp(data)  )
dump = dump( )
print ( dump )
appendToFile ( dump )


'''
Erzeugte Datenstruktur:

[{ "timestamp":  timestamp,
    "name" : "Erdgeschoss",
    "children" : {  ... }
},
{ "timestamp":  timestamp,
    "name" : "Erdgeschoss",
    "children" : {  ... }
},
]
'''
