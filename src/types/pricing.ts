export type SerieAluminio = 'S20' | 'S25' | 'S30' | 'A82' | 'PROBBA' | 'GALA_CR';
export type ColorAluminio = 'natural' | 'blanco' | 'negro' | 'anolok' | 'electrostatica';
export type TipoVidrio = 'c4mm' | 'c5mm' | 'c6mm' | 'c8mm' | 'dvh' | 'polic_alveolar' | 'polic_compacto';

export interface MedidaEstandar {
  id: string;
  ancho: number; // en mm
  alto: number;  // en mm
  label: string; // ej: "1000 x 1000 mm (1.00 m Ancho x 1.00 m Alto)"
}

export interface QuoteConfig {
  medidaId: string;
  serie: SerieAluminio;
  color: ColorAluminio;
  vidrio: TipoVidrio;
  conColocacion: boolean;
}

export interface QuoteBreakdown {
  medida: MedidaEstandar;
  serieNombre: string;
  colorNombre: string;
  vidrioNombre: string;
  conColocacion: boolean;
  costoColocacionTexto: string;
  precioTexto: string;
  vigenciaDias: number;
}

