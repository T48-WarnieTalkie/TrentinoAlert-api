var addDangerMap = L.map('addDangerMap');

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(addDangerMap);

addDangerMap.setView([46.064638, 11.150307], 16);

const latInput = document.getElementById("latitude")
const lonInput = document.getElementById("longitude")

function onMapMove() {
    latInput.setAttribute('value', addDangerMap.getCenter().lat);
    lonInput.setAttribute('value', addDangerMap.getCenter().lng);
}

addDangerMap.on('move', onMapMove);

onMapMove();