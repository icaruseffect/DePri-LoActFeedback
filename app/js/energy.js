function showEnergyConsumption() {
	const PRICE = 0.23875;
	var consumption = Math.round((Math.random() * 1000) + 1) / 1000;
	var costs = (consumption * PRICE).toFixed(2);
	var date = new Date();
	
	document.getElementsByName("consumption").item(0).innerHTML = consumption;
	if (consumption >= 0.5) {
		document.getElementsByName("consumption").item(0).style.color = "#f00";
	}
	else {
		document.getElementsByName("consumption").item(0).style.color = "#41b90d";
	}
	document.getElementsByName("costs").item(0).innerHTML = costs;
	document.getElementsByName("lastUpdate").item(0).innerHTML = date.toLocaleTimeString();
}