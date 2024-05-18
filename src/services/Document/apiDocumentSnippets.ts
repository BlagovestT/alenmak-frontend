export type Document = {
  _id: string;
  title: string;
  owner: string;
  type: string;
  file_drive_id: string;
  file_preview_link: string;
  createdAt: Date;
  updatedAt: Date;
};

export type GetQueryDocumentsSnippet = Document[];

export type GetQueryDocumentByIdSnippet = Document;

export type GetQueryDocumentsByOwnerIdSnippet = Document[];

export type PostQueryCreateDocumentSnippet = Document;

export type PostQueryUpdatedDocumentSnippet = Document;

export type PostQueryDeleteDocumentSnippet = { message: "Document removed" };

export type GetQueryDownloadDocumentSnippet = File;
