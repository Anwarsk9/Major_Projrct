const coordinates = [Number(longitude),Number(lattitude)];
maptilersdk.config.apiKey = mapToken;
const map = new maptilersdk.Map({
  container: "map", // container's id or the HTML element to render the map
  style: "streets-v2",
  center: coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

const marker = new maptilersdk.Marker({ color: "red" })
  .setLngLat(coordinates)
  .addTo(map)
  .setPopup(new maptilersdk.Popup({offset: 25})
  .setLngLat(coordinates)
  .setHTML(`<h4>${listingLocation}</h4><b>Exact location will be provided after booking</b>`)
  // .setMaxWidth("300px")
  .addTo(map)
  );