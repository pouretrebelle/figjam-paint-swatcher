// Run in console on each page in https://www.edwardbulmerpaint.co.uk/shop/

let links = document.body.querySelectorAll('.product > a');

let colors = [];

Array.from(links).forEach((link) => {
  const href = link.getAttribute('href');
  const name = link.children[1].innerText;
  const img = link.querySelector('.attachment-woocommerce_thumbnail');
  const encodedSvg = img.getAttribute('src')

  // remove gift card and bestsellers
  if (!name || !encodedSvg.startsWith('data:image/svg+xml;')) return

  const svgString = window.atob(encodedSvg.slice(26));

  const match = svgString.match(/fill: #([0-9A-Fa-f]{6})/);
  const hex = '#' + match[1];

  colors.push({ name, link: href, hex });
});

console.log(colors);
