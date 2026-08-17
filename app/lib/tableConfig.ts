
export type FieldType = "string" | "number" | "boolean" | "select";

export type TableField = {
  key: string; 
  label: string;
  type: FieldType;
  options?: { value: any; label: string }[]; 
};


export type TableConfig = {
  title: string;
  // было: fields: TableField[];
  displayFields: TableField[];
  formFields: TableField[];    
};