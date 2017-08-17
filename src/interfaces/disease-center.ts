export interface IDiseaseCenterEntranceData extends IDiseaseCenterMainInfo {
  name: string | null;
  code: number | null;
  linkUrl: string | null;
  icon: string | null;
  poster: string | null;
  sortFactor: number | null;
  channels: number[];
}

export interface IDiseaseCenterServiceData extends IDiseaseCenterMainInfo {
  linkUrl: string | null;
  icon: string | null;
  sortFactor: number | null;
  name: string | null;
}

export interface IDiseaseCenterLabelData extends IDiseaseCenterMainInfo {
  code: number | null;
  sortFactor: number | null;
  name: string | null;
}

export interface IDiseaseCenterMainInfo {
  id: string | number;
}
