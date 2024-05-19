export type PostQueryCreateDocumentInput = FormData;

export type PostQueryUpdateDocumentInput = {
  title: string;
};

export type PostQueryCreateDocumentFromTemplateInput = {
  template: string;
  owner: string;
};
