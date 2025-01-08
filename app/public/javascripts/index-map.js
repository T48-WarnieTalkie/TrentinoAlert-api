var indexMap = L.map('indexMap');

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(indexMap);

function onMapMoveEnd() {
    localStorage.setItem("indexMap_lastCenter", JSON.stringify(indexMap.getCenter()));
    localStorage.setItem("indexMap_lastZoom", indexMap.getZoom());
}

indexMap.on('moveend', onMapMoveEnd);

var indexMap_lastCenter_json = localStorage.getItem("indexMap_lastCenter");
if(indexMap_lastCenter_json != null) {
    var indexMap_lastCenter = JSON.parse(indexMap_lastCenter_json);
    indexMap.setView([indexMap_lastCenter.lat, indexMap_lastCenter.lng], localStorage.getItem("indexMap_lastZoom"));
} else {
    //povo
    indexMap.setView([46.064638, 11.150307], 16);
}

//request dangers
const xhttp = new XMLHttpRequest();

xhttp.open("GET", "/api/danger/getActive", false);
xhttp.send();

const dangerRes = JSON.parse(xhttp.responseText);

dangerRes.data.forEach(function(d) {
    var marker = L.marker([d.coordinates[0], d.coordinates[1]]).addTo(indexMap);
    var sendTimestamp = new Date(d.sendTimestamp);
    marker.bindPopup(popupTemplate({
        id: d._id,
        category: categoryConverter(d.category),
        timeAgo: timestampToTimeAgo(sendTimestamp)
        //TODO: add image?
    }));
});



    