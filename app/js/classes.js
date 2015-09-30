function House () {
	// Private Deklarationen
	var _name = "";
	var _children = [];
	var _parent = null;

	// Öffentliche Deklarationen für die D3-Treemap-Schnittstelle (Auszug aus der Dokumentation):
	// Runs the treemap layout, returning the array of nodes associated with the specified root node. The treemap
	// layout is part of D3's family of hierarchical layouts. These layouts follow the same basic structure: the
	// input argument to the layout is the root node of the hierarchy, and the output return value is an array
	// representing the computed positions of all nodes. Several attributes are populated on each node:

    // parent - the parent node, or null for the root.
    // children - the array of child nodes, or null for leaf nodes.
    // value - the node value, as returned by the value accessor.
    // depth - the depth of the node, starting at 0 for the root.
    // x - the minimum x-coordinate of the node position (Zuweisung erfolgt in Treemap.layout()).
    // y - the minimum y-coordinate of the node position (Zuweisung erfolgt in Treemap.layout()).
    // dx - the x-extent of the node position (Zuweisung erfolgt in Treemap.layout()).
    // dy - the y-extent of the node position (Zuweisung erfolgt in Treemap.layout()).

	// Note that this will modify the nodes that you pass in.
	// Deswegen werden die originalen Werte privat gehalten und nur in die öffentlichen Member kopiert, damit sie
	// nicht überschrieben werden.

	this.parent = null;
	this.children = [];
	this.value = 0;
	this.depth;

	// ###################################
	// Öffentliche Methoden und Funktionen
	// ###################################

	// Generiert eine Struktur mit konkreten Objekten aus dem generellen JSON-Objekt.
	this.initialize = function (current, newParent) {
		if (newParent == null) {
			_name = current.name;
			console.log("Weise dem Haus den Namen '" + _name + "' zu.");
		}
		if (newParent instanceof House) {
			newParent.add(new Floor(current.name, newParent));
			console.log("Füge dem Haus '" + newParent.getName() + "' das Geschoss '" + current.name + "' hinzu.");
		}
		if (newParent instanceof Floor) {
			newParent.add(new Room(current.name, newParent));
			console.log("Füge dem Geschoss '" + newParent.getName() + "' den Raum '" + current.name + "' hinzu.");
		}
		if (newParent instanceof Room || newParent instanceof Category) {
			if (current.children) {
				newParent.addCategory(new Category(current.name, newParent));
				console.log("Füge dem Raum oder der Kategorie '" + newParent.getName() + "' die Kategorie '" + current.name + "' hinzu.");
			}
			else {
				newParent.addConsumer(new Consumer(current.name, newParent, current.value));
				console.log("Füge dem Raum oder der Kategorie '" + newParent.getName() + "' den Verbaucher '" + current.name + "' hinzu (Verbrauch: " + current.value + ").");
			}
		}
		if (current.children) {
			for (var i = 0; i < current.children.length; i++) {
				this.initialize(current.children[i], (newParent == null) ? this : newParent.getChildren()[newParent.getChildren().length - 1]);
			}
		}
	}

	// Fügt dem Haus ein Geschoss hinzu.
	this.add = function (_floor) {
		_children.push(_floor);
	}

	// Ruft die Kinder (Geschosse) ab.
	this.getChildren = function () {
		return _children;
	}

	// Gibt den Energieverbrauch des Hauses zurück.
	this.getConsumption = function () {
		var consumption = 0;
		for (var i = 0; i < _children.length; i++) {
			consumption += _children[i].getConsumption();
		}
		return consumption;
	}

	// Gibt den Namen des Hauses zurück.
	this.getName = function () {
		return _name;
	}

	this.getFullName = function () {
		return _name;
	}

	// Gibt den Elternknoten zurück.
	this.getParent = function () {
		return _parent;
	}

	// Gibt die Anzahl der Personen zurück, die sich auf diesem Geschoss befinden.
	this.getPersons = function () {
		var persons = 0;
		for (var i = 0; i < _children.length; i++) {
			persons += _children[i].getPersons();
		}
		return persons;
	}
}

function Floor (__name, __parent) {
	// Private Deklarationen
	var _name = __name;
	var _parent = __parent;
	var _children = [];

	// Öffentliche Deklarationen für D3.
	this.parent = null;
	this.children = [];
	this.value = 0;
	this.depth;

	// ###################################
	// Öffentliche Methoden und Funktionen
	// ###################################

	// Fügt dem Geschoss einen Raum hinzu.
	this.add = function (room) {
		_children.push(room);
	}

	// Ruft die Kinder (Räume) ab.
	this.getChildren = function () {
		return _children;
	}

	// Gibt den Energieverbrauch pro Geschoss zurück.
	this.getConsumption = function () {
		var consumption = 0;
		for (var i = 0; i < _children.length; i++) {
			consumption += _children[i].getConsumption();
		}
		return consumption;
	}

	// Gibt den vollen Namen des Geschosses zurück.
	this.getFullName = function () {
		return _parent.getName() + " -> " + _name;
	}

	// Gibt den Name des Geschosses zurück.
	this.getName = function () {
		return _name;
	}

	// Gibt den Elternknoten zurück.
	this.getParent = function () {
		return _parent;
	}

	// Gibt die Anzahl der Personen zurück, die sich auf diesem Geschoss befinden.
	this.getPersons = function () {
		var persons = 0;
		for (var i = 0; i < _children.length; i++) {
			persons += _children[i].getPersons();
		}
		return persons;
	}
}

function Room (__name, __parent) {
	var _name = __name;
	var _parent = __parent;
	var _children = [];
	var _persons = 0;

	// Öffentliche Deklarationen für D3.
	this.parent = null;
	this.children = [];
	this.value = 0;
	this.depth;

	// Fügt dem Raum einen Verbraucher hinzu.
	this.addConsumer = function (consumer) {
		_children.push(consumer);
	}

	// Fügt dem Raum eine Verbrauchergruppe hinzu.
	this.addCategory = function (category) {
		_children.push(category);
	}

	this.getChildren = function () {
		return _children;
	}

	// Gibt den Stromverbrauch in dem Raum zurück.
	this.getConsumption = function () {
		var consumption = 0;
		for (var i = 0; i < _children.length; i++) {
			consumption += _children[i].getConsumption();
		}
		return consumption;
	}

	// Gibt den vollen Namen des Geschosses zurück.
	this.getFullName = function () {
		return _parent.getFullName() + " -> " + _name;
	}

	// Gibt den Name des Geschosses zurück.
	this.getName = function () {
		return _name;
	}

	// Gibt den Elternknoten zurück.
	this.getParent = function () {
		return _parent;
	}

	// Gibt die Anzahl der Personen zurück, die sich im Raum befinden.
	this.getPersons = function () {
		return _persons;
	}
}

function Category (__name, __parent) {
	// Private Deklarationen
	var _name = __name;
	var _parent = __parent;
	var _children = [];

	// Öffentliche Deklarationen für D3.
	this.parent = null;
	this.children = [];
	this.value = 0;
	this.depth;

	// ###################################
	// Öffentliche Methoden und Funktionen
	// ###################################

	// Fügt der Verbrauchergruppe einen Verbraucher hinzu.
	this.addConsumer = function (consumer) {
		_children.push(consumer);
	}

	this.getChildren = function () {
		return _children;
	}

	// Ermittelt den Energieverbauch der Verbrauchergruppe.
	this.getConsumption = function () {
		var consumption = 0;
		for (var i = 0; i < _children.length; i++) {
			consumption += _children[i].getConsumption();
		}
		return consumption;
	}

	// Gibt den vollen Namen des Geschosses zurück.
	this.getFullName = function () {
		return _parent.getFullName() + " -> " + _name;
	}

	// Gibt den Namen des Geschosses zurück.
	this.getName = function () {
		return _name;
	}

	// Gibt den Elternknoten zurück.
	this.getParent = function () {
		return _parent;
	}
}

function Consumer (__name, __parent, __consumption) {
	var _name = __name;
	var _parent = __parent;
	var _consumption = __consumption;
	var _activeSince = 0;

	// Öffentliche Deklarationen für D3.
	this.parent = null;
	this.children = [];
	this.value = 0;
	this.depth;

	// ###################################
	// Öffentliche Methoden und Funktionen
	// ###################################

	// Ermittelt den Energieverbauch des Verbauchers.
	this.getConsumption = function () {
		return _consumption;
	}

	// Ein Verbraucher hat keine Kinder.
	this.getChildren = function () {
		return null;
	}

	// Gibt den vollen Namen des Geschosses zurück.
	this.getFullName = function () {
		return _parent.getFullName() + " -> " + _name;
	}

	// Gibt den Name des Geschosses zurück.
	this.getName = function () {
		return _name;
	}

	// Gibt den Elternknoten zurück.
	this.getParent = function () {
		return _parent;
	}
}

function Treemap (svg, data, width, height) {
	// Höhe der Kopfzeile, also der Position innerhalb der Treemap/des Baumes.
	var titlebarHeight = 20;
	// Methode zur Abfrage der Tiefe des Elternknotens.
	var depth = 0;

	this.getDepth = function () {
		return depth;
	}

	this.update = function (data) {
		d3.select(svg).text("");
		init( data);
	}

	var formatNumber = d3.format(",d");
    var transitioning;

	var x = d3.scale.linear()
		.domain([0, width])
		.range([0, width]);

	var y = d3.scale.linear()
		.domain([0, height])
		.range([0, height]);

	var treemap = d3.layout.treemap()
		.children(function(d, depth) {
			return depth ? null : d.children;
		})
		.sort(function(a, b) {
			return a.value - b.value;
		})
		.ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
		.round(false);

	svg.attr("width", width)
		.attr("height", height)
	  	.append("g")
		.attr("transform", "translate(" + 0 + "," + titlebarHeight + ")")
		.style("shape-rendering", "crispEdges");

	var grandparent = svg.append("g")
		.attr("class", "grandparent");

	grandparent.append("rect")
		.attr("y", 0)
		.attr("width", width)
		.attr("height", titlebarHeight);

	grandparent.append("text")
		.attr("x", 6)
		.attr("y", 6)
		.attr("dy", ".75em");

	init(data);

	function init (root) {
		initialize(root);
		accumulate(root, 0);
		layout(root);
		display(root);

		function initialize(root) {
			root.x = 0;
			root.y = titlebarHeight;
			root.dx = width;
			root.dy = height;
			console.log("Initialisiere Treemap: root.x: " + root.x + ", root.y: " + root.y + ", root.dx: " + root.dx + ", root.dy: " + root.dy + ", root.depth: " + root.depth);
		}

		// Aggregate the values for internal nodes. This is normally done by the
		// treemap layout, but not here because of our custom implementation.
		// We also take a snapshot of the original children (_children) to avoid
		// the children being overwritten when the layout is computed.
		function accumulate(d, depth) {
			d.value = d.getConsumption();
			d.parent = d.getParent();
			d.children = d.getChildren();
			d._children = d.children;
			d.depth = depth;
			console.log("Setze die öffentlichen D3-Werte für '" + d.getFullName() + "' wie folgt: d.value: " + d.value + ", d.parent: " + (d.parent == null ? "null" : d.parent.getName()) + ", d.children: " + d.children);
			if (d.children) {
				depth++;
				for (var i = 0; i < d.children.length; i++) {
					accumulate(d.children[i], depth);
				}
			}
		}

		// Compute the treemap layout recursively such that each group of siblings
		// uses the same size (1×1) rather than the dimensions of the parent cell.
		// This optimizes the layout for the current zoom state. Note that a wrapper
		// object is created for the parent node for each group of siblings so that
		// the parent’s dimensions are not discarded as we recurse. Since each group
		// of sibling was laid out in 1×1, we must rescale to fit using absolute
		// coordinates. This lets us use a viewport to zoom.
		function layout(d) {
			console.log("Layoute Knoten '" + d.getFullName());
			if (d._children) {
				treemap.nodes({children: d._children});
				d._children.forEach(function(c) {
					c.x = d.x + c.x * d.dx;
					c.y = d.y + c.y * d.dy;
					c.dx *= d.dx;
					c.dy *= d.dy;
					c.parent = d;
					layout(c);
				});
			}
		}

		function display(d) {
			grandparent
				.datum(d.parent)
				.on("click", transition)
				.select("text")
				.text(d.getFullName());

			var g1 = svg.insert("g", ".grandparent")
				.datum(d)
				.attr("class", "depth");

			var g = g1.selectAll("g")
				.data(d._children)
				.enter().append("g");

			g.filter(function(d) {
					return d._children;
				})
				.classed("children", true)
				.on("click", transition);

			g.selectAll(".child")
				.data(function(d) {
					return d._children || [d];
				})
				.enter().append("rect")
				.attr("class", "child")
				.attr("style", "fill: rgb(128, 128, 128)")
				.call(rect);

			g.append("rect")
				.attr("class", "parent")
				.call(rect)
				.append("title")
				.text(function(d) {
					return formatNumber(d.value);
				});

			g.append("text")
				.attr("dy", ".75em")
				.text(function(d) {
					return d.getName();
				})
				.call(text);

			function transition(d) {
				depth = d.depth;
				console.log(depth);
				if (transitioning || !d) {
					return;
				}
				transitioning = true;

				var g2 = display(d),
				t1 = g1.transition().duration(750),
				t2 = g2.transition().duration(750);


				// Update the domain only after entering new elements.
				x.domain([d.x, d.x + d.dx]);
				y.domain([d.y, d.y + d.dy]);

				// Enable anti-aliasing during the transition.
				svg.style("shape-rendering", null);

				// Draw child nodes on top of parent nodes.
				svg.selectAll(".depth").sort(function(a, b) {
					return a.depth - b.depth;
				});

				// Fade-in entering text.
				g2.selectAll("text").style("fill-opacity", 0);

				// Transition to the new view.
				t1.selectAll("text").call(text).style("fill-opacity", 0);
				t2.selectAll("text").call(text).style("fill-opacity", 1);
				t1.selectAll("rect").call(rect);
				t2.selectAll("rect").call(rect);

				// Remove the old node when the transition is finished.
				t1.remove().each("end", function() {
					svg.style("shape-rendering", "crispEdges");
					transitioning = false;
				});
			}

			return g;
		}

		// Legt Position des übergebenen Texts fest.
		function text(text) {
			text.attr("x", function(d) {
					return x(d.x) + 6;
				})
				.attr("y", function(d) {
					return y(d.y) + 6 + titlebarHeight;
				});
		}

		// Legt Größe und Position des übergebenen Rechtecks fest.
		function rect(rect) {
			rect.attr("x", function(d) {
					return x(d.x);
				})
				.attr("y", function(d) {
					return y(d.y);
				})
				.attr("width", function(d) {
					return x(d.x + d.dx) - x(d.x);
				})
				.attr("height", function(d) {
					return y(d.y + d.dy) - y(d.y);
				})
		}

		function GetPersonCoefficient(persons) {
			return 1 / persons;
		}

		// Berechnet den anteiligen Verbauch eines Gerätes im Verhältnis zum gesamten Raum.
		// Wenn es einen übergeordneten Knoten gibt, Prozentsatz berechnen, andernfalls 1 zurückgeben.
		function GetPercentageOfTotal(children) {
			var values = new Array(children.length);

			for (var i = 0; i < children.length; i++) {
				if (children[i].parent) {
					values[i] = (children[i].value / children[i].parent.value).toFixed(2);
				}
				else {
					values[i] = 1;
				}
			}

			return values;
		}
	}
}
