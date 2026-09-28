export interface NegociacionOpcion {
  id: string
  canal: 'Distribuidores' | 'Bares' | 'Vinotecas'
  titulo: string
  resumen: string
  detalle: string
  textoCopia: string
}

export const NEGOCIACION: NegociacionOpcion[] = [
  {
    id: 'dist-10mas1',
    canal: 'Distribuidores',
    titulo: '10+1 por incorporación',
    resumen: 'Solo en la primera venta, para que tengan de muestras.',
    detalle:
      'Ofrecemos 10+1 únicamente al incorporar al distribuidor: la primera venta. El objetivo es que tengan botellas de muestra para trabajar el canal. No aplica a recompras ni a pedidos siguientes.',
    textoCopia: `Sobre la incorporación: te ofrecemos 10+1 solo en la primera venta, para que tengan botellas de muestra y puedan probar el producto con sus clientes. Después se trabaja a lista normal.`,
  },
  {
    id: 'bares-5mas1',
    canal: 'Bares',
    titulo: '5+1 en cajas',
    resumen: 'Para acciones y posicionamiento en barra.',
    detalle:
      'Podemos negociar 5+1 en cajas a cambio de acciones (degustaciones, posts, menú) y posicionamiento visible en barra. Es el marco estándar para entrar bien sin regalar margen.',
    textoCopia: `Podemos trabajar 5+1 en cajas si lo cruzamos con acciones (degustación / contenido) y un buen lugar en la barra. Nos interesa que Guaina se vea y se pida.`,
  },
  {
    id: 'bares-4mas1',
    canal: 'Bares',
    titulo: '4+1 (agresivo)',
    resumen: 'Solo cuando queremos entrar fuerte en un local clave.',
    detalle:
      'Hasta 4+1 en casos más agresivos: locales estratégicos donde nos conviene entrar ya. Usarlo con criterio, no como default.',
    textoCopia: `Para este local podemos ir hasta 4+1 si cerramos acciones claras y un lugar fijo en barra. Es una excepción para priorizar el ingreso.`,
  },
  {
    id: 'vino-combos',
    canal: 'Vinotecas',
    titulo: 'Acciones en fechas + mixers',
    resumen: 'Combos con soda (o pomelo) y costo de mixers a cargo nuestro.',
    detalle:
      'En vinotecas negociamos acciones en fechas puntuales: combos Guaina + soda (o pomelo). Podemos cubrir el costo de los mixers para que la promo sea fácil de armar y vender.',
    textoCopia: `Para fechas clave podemos armar un combo Guaina + soda (o pomelo). Nosotros cubrimos el costo de los mixers; ustedes ponen el espacio y la acción en el local.`,
  },
]

export const CANALES_NEGOCIACION = ['Distribuidores', 'Bares', 'Vinotecas'] as const
