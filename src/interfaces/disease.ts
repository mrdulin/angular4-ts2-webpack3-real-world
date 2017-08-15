export interface IDiseaseTagId {
  tagId: string;
}

export interface IDiseaseTagName {
  tagName: string;
}

export interface IDiseaseTagBase extends IDiseaseTagId, IDiseaseTagName { }

export interface IDiseaseTag extends IDiseaseTagBase{
  tagLevel: null | number;
  tagType: string;
  parentId: null | string;
  parentName: null | string;
  icon: null | string;
  configInfo: null | string;
}

export interface IDiseaseTagWithChildren extends IDiseaseTag{
  children: any[];
}

export interface IDisease<Tag> extends IDiseaseTag{
  aliasName: string | null;
  extraCode: string | null;
  relatedTags: Tag[];
  standardCode: string;
}

export interface IDiseaseConfig extends IDiseaseTagId {
  description: string;
  inspection: string;
  preventive: string;
  symptom: string;
  treatment: string;
}

export interface IDiseaseSavePostBody extends IDiseaseTagBase {
  aliasName?: string;
  standardCode?: string;
  relatedTags?: IDiseaseTagBase[];
}
