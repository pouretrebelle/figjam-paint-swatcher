import fBSwatches from './data/farrowAndBall'
import lGSwatches from './data/littleGreene'
import pPLSwatches from './data/paintAndPaperLibrary'

const swatchData = Object.entries({
  'F&B': fBSwatches,
  'LG': lGSwatches,
  'P&PL': pPLSwatches,
}).map(([brand, swatches]) => (
  swatches.map(({ name, hex, link }) => ({
    name: `${name} (${brand})`,
    data: {
      name,
      hex,
      link,
      brand,
    },
    icon: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="${hex}"/></svg>`
  })))
).flat()

figma.parameters.on(
  'input',
  ({ parameters, key, query, result }: ParameterInputEvent) => {
    let names: string[] = []
    switch (key) {
      case 'swatch':
        result.setSuggestions(
          swatchData.filter((s) => {
            const isDuplicate = names.includes(s.name)
            names.push(s.name)
            return !isDuplicate && s.name.toLowerCase().includes(query.toLowerCase())
          })
        )
        break
      default:
        return
    }
  }
)

figma.on('run', async ({ parameters }: RunEvent) => {
  if (!parameters) return

  const swatch = parameters.swatch as {
    name: string
    brand: string
    link: string
    hex: string
  }

  const shape = figma.createShapeWithText();
  shape.shapeType = 'SQUARE'
  shape.fills = [{ type: 'SOLID', color: figma.util.rgb(swatch.hex) }];
  shape.x = figma.viewport.center.x - shape.width / 2
  shape.y = figma.viewport.center.y - shape.height / 2

  await figma.loadFontAsync({ family: "Inter", style: "Medium" })
  shape.text.characters = swatch.brand + '\n' + swatch.name;
  shape.text.hyperlink = {
    type: 'URL',
    value: swatch.link,
  }
  shape.text.fontSize = 12
  shape.text.textDecoration = 'UNDERLINE'

  figma.currentPage.appendChild(shape);
  figma.currentPage.selection = [shape];

  figma.closePlugin();
});
