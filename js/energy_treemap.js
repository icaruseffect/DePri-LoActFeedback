// Höhe der Kopfzeile, also der Position innerhalb der Treemap/des Baumes.
var titlebarHeight = 20;
// Weite der Treemap, dazu Weite des Elternelements abfragen und jeweils 1 px rechts und links wegen Paddings abziehen plus je 1 px für den Rand.
var width = document.getElementById('box_treemap').offsetWidth - 4;
// Genau wie Weite
var height = document.getElementById('box_treemap').offsetHeight - titlebarHeight - 31;

var formatNumber = d3.format(',d');
var transitioning;

var x = d3.scale.linear()
  .domain([0, width])
  .range([0, width]);

var y = d3.scale.linear()
  .domain([0, height])
  .range([0, height]);

var treemap = d3.layout.treemap()
  .children(function (d, depth) {
    return depth ? null : d._children;
  })
  .sort(function (a, b) {
    return a.value - b.value;
  })
  .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
  .round(false);

var svg = d3.select('#chart').append('svg')
  .attr('width', width)
  .attr('height', height + titlebarHeight)
  .append('g')
  .attr('transform', 'translate(' + 0 + ',' + titlebarHeight + ')')
  .style('shape-rendering', 'crispEdges');

var grandparent = svg.append('g')
  .attr('class', 'grandparent');

grandparent.append('rect')
  .attr('y', -titlebarHeight)
  .attr('width', width)
  .attr('height', titlebarHeight);

grandparent.append('text')
  .attr('x', 6)
  .attr('y', 6 - titlebarHeight)
  .attr('dy', '.75em');

d3.json('js/data.json', function (root) {
  initialize(root);
  accumulate(root);
  layout(root);
  display(root);

  function initialize(root) {
    root.x = root.y = 0;
    root.dx = width;
    root.dy = height;
    root.depth = 0;
  }

  // Aggregate the values for internal nodes. This is normally done by the
  // treemap layout, but not here because of our custom implementation.
  // We also take a snapshot of the original children (_children) to avoid
  // the children being overwritten when the layout is computed.
  function accumulate(d) {
    return (d._children = d.children) ? d.value = d.children.reduce(function (p, v) {
      return p + accumulate(v);
    }, 0) : d.value;
  }

  // Compute the treemap layout recursively such that each group of siblings
  // uses the same size (1×1) rather than the dimensions of the parent cell.
  // This optimizes the layout for the current zoom state. Note that a wrapper
  // object is created for the parent node for each group of siblings so that
  // the parent’s dimensions are not discarded as we recurse. Since each group
  // of sibling was laid out in 1×1, we must rescale to fit using absolute
  // coordinates. This lets us use a viewport to zoom.
  function layout(d) {
    if (d._children) {
      treemap.nodes({
        _children: d._children
      });
      d._children.forEach(function (c) {
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
    // KONSTANTEN
    // Maximaler Stromverbrauch, damit Quadrant grün angezeigt wird.
    const GREEN = 3000;
    // Maximaler Stromverbrauch, damit Quadrant gelb angezeigt wird.
    const YELLOW = 7500;

    grandparent
      .datum(d.parent)
      .on('click', transition)
      .select('text')
      .text(name(d));

    var g1 = svg.insert('g', '.grandparent')
      .datum(d)
      .attr('class', 'depth');

    var g = g1.selectAll('g')
      .data(d._children)
      .enter().append('g');

    g.filter(function (d) {
        return d._children;
      })
      .classed('children', true)
      .on('click', transition);

    g.selectAll('.child')
      .data(function (d) {
        return d._children || [d];
      })
      .enter().append('rect')
      .attr('class', 'child')
      // Diese Funktion füllt die Kindelemente in der entsprechenden Farbe aus.
      .attr('style', function (d) {
        //var rgb = GetRectColor(d);
        //return 'fill: rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')';
        if (d.value === 0) {
          return 'fill: rgb(144, 144, 144)';
        } else if (d.value <= GREEN) {
          return 'fill: rgb(0, 255, 0)';
        } else if (d.value <= YELLOW) {
          return 'fill: rgb(255, 255, 0)';
        } else {
          return 'fill: rgb(255, 0, 0)';
        }
      })
      .call(rect);

    g.append('rect')
      .attr('class', 'parent')
      .call(rect)
      .append('title')
      .text(function (d) {
        return formatNumber(d.value);
      });

    g.append('text')
      .attr('dy', '.75em')
      .text(function (d) {
        return d.name;
      })
      .call(text);

    function transition(d) {
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
      svg.style('shape-rendering', null);

      // Draw child nodes on top of parent nodes.
      svg.selectAll('.depth').sort(function (a, b) {
        return a.depth - b.depth;
      });

      // Fade-in entering text.
      g2.selectAll('text').style('fill-opacity', 0);

      // Transition to the new view.
      t1.selectAll('text').call(text).style('fill-opacity', 0);
      t2.selectAll('text').call(text).style('fill-opacity', 1);
      t1.selectAll('rect').call(rect);
      t2.selectAll('rect').call(rect);

      // Remove the old node when the transition is finished.
      t1.remove().each('end', function () {
        svg.style('shape-rendering', 'crispEdges');
        transitioning = false;
      });
    }

    return g;
  }

  // Legt Position des übergebenen Texts fest.
  function text(text) {
    text.attr('x', function (d) {
        return x(d.x) + 6;
      })
      .attr('y', function (d) {
        return y(d.y) + 6;
      });
  }

  // Legt Größe und Position des übergebenen Rechtecks fest.
  function rect(rect) {
    rect.attr('x', function (d) {
        return x(d.x);
      })
      .attr('y', function (d) {
        return y(d.y);
      })
      .attr('width', function (d) {
        return x(d.x + d.dx) - x(d.x);
      })
      .attr('height', function (d) {
        return y(d.y + d.dy) - y(d.y);
      });
  }

  // Zeigt den Pfad zum aktuell ausgewählten Quadranten in der Kopfleiste an. Dazu wird die Funktion, sofern das übergebene Element einen
  // übergeordneten Knoten hat, mit diesem rekursiv aufgerufen. Sollte es sich um einen Raum handeln, der Personen beinhaltet, so werden
  // diese hinter dem Raumnamen in Klammern ausgegeben.
  function name(d) {
    return d.parent ? name(d.parent) + ' -> ' + d.name + ' (' + GetPersons(d) + ')' : d.name + ' (' + GetPersons(d) + ')';
  }

  // Ermittelt die Anzahl der Personen eines Knotens durch die Anzahl der Personen der untergeordneten Knoten. Sollten einige Knoten keine
  // Personen 'besitzen', weil sie Gegenstände sind (Licht, Kaffeemaschine, ...), wird dafür 0 angenommen.
  function GetPersons(d) {
    var persons = 0;

    if (d._children) {
      for (var i = 0; i < d._children.length; i++) {
        persons += GetPersons(d._children[i]);
      }
    }
    if (d.persons) {
      persons += d.persons;
    }
    return persons;
  }

  function GetConsumption(d) {
    var consumption = 0;

    if (d._children) {
      for (var i = 0; i < d._children.length; i++) {
        consumption += GetPersons(d._children[i]);
      }
    }
    if (d.value) {
      consumption += d.value;
    }
    return consumption;
  }

  function GetPersonCoefficient(persons) {
    return 1 / persons;
  }

  function GetRectColor(d) {
    var percentages = GetPercentageOfTotal(d._children);
    var minValue = 449;
    var maxValue = 17010;
    var avgValue = (minValue + maxValue) / 2;

    var red = 0;
    var green = 0;

    if (d.value < avgValue) {
      // Grüner Farbbereich liegt zwischen (0, 0, 0) und (0, 255, 0). Anpassung der R-Komponente (aufsteigend) schafft Verlauf zwischen grün und gelb.
      red = 255 * math.abs((d.value / avgValue));
      green = 255;
    } else if (d.value > avgValue) {
      // Roter Farbbereich liegt zwischen (0, 0, 0) und (255, 0, 0). Anpassung der G-Komponente (absteigend) schafft Verlauf zwischen gelb und rot.
      red = 255;
      green = 255 * math.abs((d.value / avgValue - 1));
    } else {
      red = 255;
      green = 255;
    }

    return 'fill: rgb(' + red + ', ' + green + ', 0)';
  }

  // Berechnet den anteiligen Verbauch eines Gerätes im Verhältnis zum gesamten Raum.
  // Wenn es einen übergeordneten Knoten gibt, Prozentsatz berechnen, andernfalls 1 zurückgeben.
  function GetPercentageOfTotal(children) {
    var values = new Array(children.length);

    for (var i = 0; i < children.length; i++) {
      if (children[i].parent) {
        values[i] = (children[i].value / children[i].parent.value).toFixed(2);
      } else {
        values[i] = 1;
      }
    }

    return values;
  }
});
