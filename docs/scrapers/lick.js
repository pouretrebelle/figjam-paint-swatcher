// run in https://www.lick.com/uk/content/colour-chart

// Helper to convert "rgb(242, 242, 235)" to "#f2f2eb"
const rgbToHex = (rgbStr) => {
  if (!rgbStr) return '#000000';
  const rgbValues = rgbStr.match(/\d+/g);
  if (!rgbValues || rgbValues.length < 3) return '#000000';
  return '#' + rgbValues.slice(0, 3).map(x => {
    const hex = parseInt(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

// Helper to convert a string to Sentence case (e.g., "WHITE 01" -> "White 01")
const toSentenceCase = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Target all list item containers
const tiles = document.querySelectorAll('ul.ui-grid li.ui-h-max');
const colors = [];

tiles.forEach((tile) => {
  // Grab the name from the h3 tag and apply sentence case
  const nameEl = tile.querySelector('h3');
  const rawName = nameEl ? nameEl.innerText.trim() : '';
  const name = toSentenceCase(rawName);

  // Grab the relative link and format it into an absolute URL
  const linkEl = tile.querySelector('a[href*="/product/"]');
  const link = linkEl ? window.location.origin + linkEl.getAttribute('href') : '';

  // Extract the RGB color from the style attribute and convert to Hex
  const colorEl = tile.querySelector('a[data-hex="true"]');
  const rgbString = colorEl ? colorEl.style.backgroundColor : '';
  const hex = rgbToHex(rgbString);

  colors.push({ name, link, hex });
});

console.log(colors);
