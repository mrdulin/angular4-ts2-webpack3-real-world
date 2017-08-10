export interface IDiseaseCenterEntranceData extends IDiseaseCenterMainInfo {
  name: string | null;
  code: number | null;
  linkUrl: string | null;
  icon: string | null;
  poster: string | null;
  sortFactor: number | null;
  channels: number[];
}

export interface IDiseaseCenterMainInfo {
  id: string | number;
}

export class DiseaseCenter {
  constructor(public model: IDiseaseCenterEntranceData) {
    Object.assign(this, model);
  }
}





