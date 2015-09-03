function House () {
	var name = "";
	var floors = [];
	
	this.initialize = function (data, x) {
		if (x == 0) {
			name = data.name;
		}
		if (x == 1) {
			this.addFloor(new Floor(data.name));
		}
		if (x == 2) {
			floors[floors.length - 1].addRoom(new Room(data.name));
		}
		if (data.children) {
			for (var i = 0; i < data.children.length; i++) {
				this.initialize(data.children[i], ++x);
				x--;
			}
		}
	}
	
	// Fügt dem Haus ein Geschoss hinzu.
	this.addFloor = function (_floor) {
		floors.push(_floor);	
	}
	
	this.getFloors = function () {
		return floors;	
	}
}

function Floor (name) {
	this.name = name;
	var rooms = [];
	
	// Fügt dem Geschoss einen Raum hinzu.
	this.addRoom = function (room) {
		rooms.push(room);
	}
	
	this.getPersons = function () {
		var consumption = 0;
		for (var i = 0; i < rooms.length; i++) {
			consumption += rooms[i].getConsumption();
		}
		return consumption;
	}
	
	this.getRooms = function () {
		return rooms;
	}
}

function Room (name) {
	this.name = name;
	var consumers = [];
	var persons = 0;
	
	// Fügt dem Raum einen Verbraucher hinzu.
	this.addConsumer = function (consumer) {
		consumers.push(consumer);
	}
	
	// Gibt den Stromverbrauch in dem Raum zurück.
	this.getConsumption = function () {
		var consumption = 0;
		for (var i = 0; i < consumers.length; i++) {
			consumption += consumers[i].getConsumption();				
		}
		return consumption;
	}
	
	this.getPersons = function () {
		return persons;	
	}
}

function Consumer () {
	var name = "";
	var consumption = 0;
	var activeSince = 0;
	
	this.getName = function () {
		return name;	
	}
	
	this.getConsumption = function () {
		return consumption;
	}
}