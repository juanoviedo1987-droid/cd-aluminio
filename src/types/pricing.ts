export type SerieAluminio = 'S20' | 'S25' | 'S30' | 'A82' | 'PROBBA' | 'GALA_CR' | 'ESPECIAL';
export type ColorAluminio = 'natural' | 'blanco' | 'negro' | 'anolok' | 'electrostatica';
export type TipoVidrio = 'c4mm' | 'c5mm' | 'c6mm' | 'c8mm' | 'dvh' | 'polic_alveolar' | 'polic_compacto' | 'ninguno';

export interface QuoteConfig {
  ancho: string; // en cm
  alto: string;  // en cm
  serie: SerieAluminio;
  color: ColorAluminio;
  vidrio: TipoVidrio;
  conColocacion: boolean;
}

export interface QuoteBreakdown {
  medidaTexto: string;
  ancho: string;
  alto: string;
  serieNombre: string;
  colorNombre: string;
  vidrioNombre: string;
  conColocacion: boolean;
  costoColocacionTexto: string;
  precioTexto: string;
  vigenciaDias: number;
}
