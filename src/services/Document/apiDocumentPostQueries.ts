import { Query } from "../apiTypes";
import {
  PostQueryCreateDocumentInput,
  PostQueryUpdateDocumentInput,
} from "./apiDocumentInputs";

export const postQueryCreateDocument = (
  input: PostQueryCreateDocumentInput
): Query => ({
  endpoint: "/documents",
  method: "POST",
  variables: input,
  multipart: true,
});

export const postQueryUpdatedDocument = (
  documentID: string,
  input: PostQueryUpdateDocumentInput
): Query => ({
  endpoint: `/documents/${documentID}`,
  method: "PUT",
  variables: input,
});

export const postQueryDeleteDocument = (documentID: string): Query => ({
  endpoint: `/documents/${documentID}`,
  method: "DELETE",
});
