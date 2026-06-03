// Run in console on mobile version of https://coatpaints.com/collections/digital-colour-chart

// Target all the paint tile divs
const tiles = document.querySelectorAll('.paint-colours .paint-tile');
const colors = [];

tiles.forEach((tile) => {
  const titleEl = tile.querySelector('.title');
  const name = titleEl ? titleEl.innerText.trim() : '';

  // Parse the Alpine.js @click attribute to extract the product ID and handle
  const clickAttr = tile.getAttribute('@click') || '';

  // Extract the product handle (e.g., 'margot-flat-matt') to build a clean link
  const handleMatch = clickAttr.match(/,\s*['"`]([^'"`]+)['"`]\s*,/);
  const link = handleMatch
    ? `${window.location.origin}/products/${handleMatch[1]}`
    : '';

  // Extract the Hex code directly from the inline style attribute
  const hexString = tile.style.backgroundColor;
  // If browser resolves tile.style.backgroundColor to RGB, fallback to extracting raw text
  let hex = hexString.startsWith('#') ? hexString : '';

  if (!hex) {
    const styleAttr = tile.getAttribute('style') || '';
    const hexMatch = styleAttr.match(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/);
    hex = hexMatch ? hexMatch[0] : '#000000';
  }

  colors.push({ name, link, hex });
});

console.log(colors);
