import { swatches } from './data/farrow-and-ball'

const swatchData = swatches.map(({ name, link, hex }) => ({ name, data: { name, link, hex }, icon: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="${hex}"/></svg>` }))

figma.parameters.on(
  'input',
  ({ parameters, key, query, result }: ParameterInputEvent) => {
    switch (key) {
      case 'swatch':
        result.setSuggestions(
          swatchData.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
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
    link: string
    hex: string
  }

  const shape = figma.createShapeWithText();
  shape.shapeType = 'SQUARE'
  shape.fills = [{ type: 'SOLID', color: figma.util.rgb(swatch.hex) }];
  shape.resize(600, 600)
  shape.x = figma.viewport.center.x - shape.width / 2
  shape.y = figma.viewport.center.y - shape.height / 2

  await figma.loadFontAsync({ family: "Inter", style: "Medium" })
  shape.text.characters = swatch.name;
  shape.text.hyperlink = {
    type: 'URL',
    value: swatch.link,
  }
  shape.text.fontSize = 24 // medium
  shape.text.textDecoration = 'UNDERLINE'

  figma.currentPage.appendChild(shape);
  figma.currentPage.selection = [shape];

  figma.closePlugin();
});
