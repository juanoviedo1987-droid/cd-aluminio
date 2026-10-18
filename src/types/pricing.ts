export type SerieAluminio = 'S20' | 'S25' | 'S30';
export type ColorAluminio = 'natural' | 'anolok';
export type TipoVidrio = 'simple' | 'dvh';

export interface MedidaEstandar {
  id: string;
  ancho: number; // en mm
  alto: number;  // en mm
  label: string; // ej: "1000 x 1000"
  precioBaseNatural: number; // para Serie 25
  precioBaseAnolok: number;  // para Serie 25
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
  precioBaseS25: number;
  adicionalSerie: number;
  subtotalPerfileria: number;
  adicionalVidrioDVH: number;
  subtotalAbertura: number;
  costoColocacion: number;
  totalFinal: number;
  vigenciaDias: number;
}
