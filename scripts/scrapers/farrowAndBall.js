// Run in console on https://www.farrow-ball.com/paint-colours

let tiles = document.body.querySelectorAll('.product-tile--paint');

let colors = [];

var matchRGB = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/;
function rgbToHex(r, g, b) {
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

Array.from(tiles).forEach((tile) => {
  const link = tile.children[0].getAttribute('href');
  let [name, number] = tile
    .querySelector('.product-tile__title')
    .innerText.split('\n');
  number = number.slice(4);
  let color = tile.querySelector('.product-tile__inner').style.backgroundColor;
  console.log(matchRGB.exec(color));
  const hex = rgbToHex(...matchRGB.exec(color).slice(1));

  colors.push({ name, number, link, hex });
});

console.log(colors);
