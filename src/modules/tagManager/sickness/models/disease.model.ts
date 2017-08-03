export interface IDisease {
  aliasName: string | null;
  configInfo: string | null;
  extraCode: string | null;
  icon: string | null;
  parentId: number | null;
  parentName: string | null;
  relatedTags: string[];
  standardCode: string;
  tagId: number;
  tagLevel: number;
  tagName: string;
  tagType: string;
}

export class Disease {
  constructor(public model: IDisease) {
    Object.assign(this, model);
  }
}





