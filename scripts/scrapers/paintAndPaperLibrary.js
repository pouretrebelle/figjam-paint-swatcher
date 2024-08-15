// Run in console on https://www.paintandpaperlibrary.com/paint

let links = document.body.querySelectorAll('.product-image-aspect-inner');

let colors = [];

Array.from(links).forEach((link) => {
  const href = link.getAttribute('href');
  const name = link.getAttribute('title')
  const svgString = link.children[0].getAttribute('data-src');
  const match = svgString.match(/fill:%23([0-9A-Fa-f]{6})/);
  const hex = '#' + match[1];

  colors.push({ name, link: href, hex });
});

console.log(colors);
