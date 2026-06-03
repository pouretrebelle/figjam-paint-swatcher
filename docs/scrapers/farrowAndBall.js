// Run in console on https://www.farrow-ball.com/paint/signature-palette

let tiles = document.body.querySelectorAll('.product-item');

let colors = [];

Array.from(tiles).forEach((tile) => {
  const link = tile.children[0].children[0].getAttribute('href');

  const name = tile.querySelector('.product-item-link').innerText
  const number = tile.querySelector('.product-item-code').innerText.slice(4)

  // need to grab colour from item page
  const hex = '#000000'

  colors.push({ name, number, link, hex });
});

console.log(colors);
