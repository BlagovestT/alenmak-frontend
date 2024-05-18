import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Document,
  GetQueryDownloadDocumentSnippet,
  PostQueryDeleteDocumentSnippet,
} from "@/services/Document/apiDocumentSnippets";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Dialog from "@/components/MUIComponents/Dialog";
import { postQueryDeleteDocument } from "@/services/Document/apiDocumentPostQueries";
import { callApi } from "@/services/callApi";
import DownloadIcon from "@mui/icons-material/Download";
import { getQueryDownloadDocument } from "@/services/Document/apiDocumentGetQueries";

interface PatientDocumentsListProps {
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const PatientDocumentsList: React.FC<PatientDocumentsListProps> = ({
  documents,
  setDocuments,
  setLoading,
}) => {
  const handleDeletePatientDocument = async (
    documentID: string,
    setDocuments: React.Dispatch<React.SetStateAction<Document[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    try {
      setLoading(true);
      const deletedDocument = await callApi<PostQueryDeleteDocumentSnippet>({
        query: postQueryDeleteDocument(documentID),
      });

      if (deletedDocument.message === "Document removed") {
        setDocuments((prevDocuments) =>
          prevDocuments.filter((document) => document._id !== documentID)
        );
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <Stack mt={2} sx={{ borderTop: "2px solid", borderColor: "divider" }}>
      <List
        dense={true}
        sx={{ height: "100%", maxHeight: "400px", overflow: "auto" }}
      >
        {documents.length > 0 ? (
          documents.map((document) => (
            <ListItem
              key={document._id}
              secondaryAction={
                <Stack direction="row" gap={2}>
                  <Tooltip title="Прегледай">
                    <IconButton
                      edge="end"
                      aria-label="view"
                      onClick={() =>
                        window.open(document.file_preview_link, "_blank")
                      }
                    >
                      <VisibilityIcon color="info" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Изтегли">
                    <IconButton
                      edge="end"
                      aria-label="view"
                      onClick={() =>
                        handleDownloadDocument(
                          document._id,
                          document.title,
                          document.type,
                          setLoading
                        )
                      }
                    >
                      <DownloadIcon color="success" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Изтрий">
                    <Dialog
                      icon={<DeleteIcon sx={{ color: "#FF1943" }} />}
                      buttonText="Изтрий"
                      dialogTitle={`Изтриване на документ ${document.title}`}
                      dialogDescription="Сигурни ли сте, че искате да изтриете този документ?"
                      onConfirm={() =>
                        handleDeletePatientDocument(
                          document._id,
                          setDocuments,
                          setLoading
                        )
                      }
                    />
                  </Tooltip>
                </Stack>
              }
            >
              <ListItemText
                primary={document.title}
                secondary={`${document.type} | ${new Date(
                  document.createdAt
                ).toLocaleDateString("bg-BG")}`}
              />
            </ListItem>
          ))
        ) : (
          <Stack
            width="100%"
            justifyContent="center"
            alignItems="center"
            mt={2}
          >
            <Typography>Няма добавени документи</Typography>
          </Stack>
        )}
      </List>
    </Stack>
  );
};

export default PatientDocumentsList;

const handleDownloadDocument = async (
  documentId: string,
  documentTitle: string,
  documentType: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    setLoading(true);
    const downloadedDocument = await callApi<GetQueryDownloadDocumentSnippet>({
      query: getQueryDownloadDocument(documentId),
    });

    if (downloadedDocument) {
      const url = window.URL.createObjectURL(new Blob([downloadedDocument]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${documentTitle}.${documentType}`);
      document.body.appendChild(link);
      link.click();
      setLoading(false);
    }
  } catch (error) {
    console.error(error);
    setLoading(false);
  }
};
