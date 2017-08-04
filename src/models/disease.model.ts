export interface IDisease extends IDiseaseMainInfo {
  aliasName: string | null;
  configInfo: string | null;
  extraCode: string | null;
  icon: string | null;
  parentId: number | null;
  parentName: string | null;
  relatedTags: string[];
  standardCode: string;
  tagLevel: number;
  tagType: string;
}

export interface IDiseaseMainInfo {
  tagId: string;
  tagName: string;
}

export interface IDiseaseConfig{
  description: string;
  inspection: string;
  preventive: string;
  symptom: string;
  treatment: string;
}

export class Disease {
  constructor(public model: IDisease) {
    Object.assign(this, model);
  }
}





