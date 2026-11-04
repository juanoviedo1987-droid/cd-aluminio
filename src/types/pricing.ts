export type SerieAluminio = 'S20';
export type ColorAluminio = 'natural' | 'blanco' | 'negro' | 'anolok' | 'electrostatica';

export interface QuoteConfig {
  modoMedida: 'estandar' | 'personalizada';
  ancho: string; // en cm
  alto: string;  // en cm
  serie: SerieAluminio;
  color: ColorAluminio;
  conColocacion: boolean;
  descuento: string; // % opcional de descuento manual
}

export interface QuoteBreakdown {
  medidaTexto: string;
  moduloEstandarTexto?: string;
  fueraDeRango?: boolean;
  ancho: string;
  alto: string;
  serieNombre: string;
  colorNombre: string;
  vidrioNombre: string;
  conColocacion: boolean;
  costoColocacionTexto: string;
  precioTexto: string;
  tieneDescuento: boolean;
  descuentoPorcentaje: number;
  descuentoMontoTexto: string;
  precioListaTexto: string;
  vigenciaDias: number;
}
