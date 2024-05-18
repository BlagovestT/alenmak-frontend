import { Query } from "../apiTypes";

export const getQueryDocumentById = (documentID: string): Query => ({
  endpoint: `/documents/${documentID}`,
  method: "GET",
});

export const getQueryDocumentsByOwnerId = (ownerID: string): Query => ({
  endpoint: `/documents/owner/${ownerID}`,
  method: "GET",
});

export const getQueryDownloadDocument = (documentID: string): Query => ({
  endpoint: `/documents/download/${documentID}`,
  method: "GET",
  blob: true,
});
