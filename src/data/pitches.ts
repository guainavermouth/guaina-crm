export interface Pitch {
  id: number
  title: string
  subtitle: string
  placeholderName: string
  text: string
  categorias: string[]
}

export const PITCHES: Pitch[] = [
  {
    id: 1,
    title: 'Almacenes Boutique y Delis',
    subtitle: 'Ideal para tiendas de productos gourmet y delicatessen',
    placeholderName: '',
    categorias: ['Almacen Boutique'],
    text: `Buenas! Cómo están?

Les queríamos presentar Guaina, un vermut argentino tipo Torino de Mendoza, con base de Malbec de Agrelo.

Es fresco, cítrico y equilibrado, con un amargor elegante. Ideal para picadas, tardeo y góndola.

Nace de una mesa familiar: queríamos el vermut fresco que nosotros mismos disfrutábamos en esas tardes.

Nos gustaría que lo conozcan. Si les interesa, les acercamos una muestra.

Saludos!`,
  },
  {
    id: 2,
    title: 'Wine Bars y Vermuterías/Bares',
    subtitle: 'Para bares de vinos, vermuterías y cocktail bars',
    placeholderName: '',
    categorias: ['Wine Bar', 'Vermuteria', 'Cocktail Bar', 'Vinoteca', 'Hotel Bar'],
    text: `Buenas! Cómo están?

Les queríamos presentar Guaina, un vermut argentino tipo Torino (17% vol.) de Mendoza, base Malbec de Agrelo.

Es fresco, cítrico y equilibrado, con un amargor elegante. Se sirve fácil con hielo, soda y naranja, y también va bien en Negronis suaves.

Nace de una mesa familiar: buscábamos un vermut fresco para compartir sin vueltas.

Nos gustaría que el equipo de barra lo conozca. Si les interesa, les acercamos una muestra.

Saludos!`,
  },
  {
    id: 3,
    title: 'Restaurantes',
    subtitle: 'Para sumar Guaina a la carta de aperitivos',
    placeholderName: '',
    categorias: ['Restaurante'],
    text: `Buenas! Cómo están?

Les queríamos presentar Guaina, un vermut argentino tipo Torino (17% vol.) de Mendoza, base Malbec de Agrelo.

Es fresco, cítrico y equilibrado, con un amargor elegante. Funciona muy bien como aperitivo antes de comer, con hielo, soda y naranja, y acompaña quesos, fiambres y entradas.

Nace de una mesa familiar: queríamos un vermut fresco para compartir alrededor de la comida.

Nos encantaría que lo prueben y ver si puede sumarse a su carta. Si les interesa, les acercamos una muestra.

Saludos!`,
  },
  {
    id: 4,
    title: 'Distribuidores Boutique',
    subtitle: 'Para distribuidores y representantes comerciales',
    placeholderName: '[Nombre]',
    categorias: ['Distribuidor'],
    text: `Buenas [Nombre]! Cómo va?

Te quería presentar Guaina, un vermut argentino tipo Torino de Mendoza (base Malbec de Agrelo, 17% vol.).

Es fresco, cítrico y equilibrado, con un amargor elegante. Pensado para vinotecas boutique, almacenes gourmet y gastronomía joven.

Nace de una mesa familiar: queríamos crear el vermut fresco que nosotros mismos tomábamos.

A nivel comercial:
- Margen de contribución ~38,5%
- Promo de lanzamiento 10+1
- Bonificaciones por recompra

Nos gustaría que lo conozcas. Si te interesa, te acerco una muestra + ficha comercial.

Saludos,`,
  },
]

export function suggestedPitchId(categoria: string): number {
  const match = PITCHES.find((p) => p.categorias.includes(categoria))
  return match?.id ?? 1
}

export function customizePitch(pitch: Pitch, contactName?: string): string {
  let text = pitch.text
  if (pitch.placeholderName && contactName?.trim()) {
    text = text.replaceAll(pitch.placeholderName, contactName.trim())
  }
  return text
}
