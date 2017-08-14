export interface IProperty {
  choice: string;
  parentId: null | string | number;
  parentName: string | null;
  propertyId: number;
  propertyName: string;
  propertyValues: null | any[];
}
