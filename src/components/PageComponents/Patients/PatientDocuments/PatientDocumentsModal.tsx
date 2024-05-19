import { useEffect, useState } from "react";
import { Patient } from "@/services/Patients/apiPatientsSnippets";
import {
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
} from "@mui/material";
import { DropzoneDialog } from "mui-file-dropzone";
import Button from "@/components/MUIComponents/Button";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import PatientDocumentsList from "./PatientDocumentsList";
import {
  Document,
  GetQueryDocumentsByOwnerIdSnippet,
  PostQueryCreateDocumentFromTemplateSnippet,
  PostQueryCreateDocumentSnippet,
} from "@/services/Document/apiDocumentSnippets";
import {
  postQueryCreateDocument,
  postQueryCreateDocumentFromTemplate,
} from "@/services/Document/apiDocumentPostQueries";
import { callApi } from "@/services/callApi";
import Alert, { AlertStatuses } from "@/components/MUIComponents/Alert";
import { getQueryDocumentsByOwnerId } from "@/services/Document/apiDocumentGetQueries";
import { PostQueryCreateDocumentFromTemplateInput } from "@/services/Document/apiDocumentInputs";

const DOCUMENTS_MENU_OPTIONS = [
  {
    title: "Досие",
  },
  {
    title: "Допълнителен Лист",
  },
  {
    title: "Състояние 1",
  },
  {
    title: "Лично Дело",
  },
  {
    title: "Заявление",
  },
  {
    title: "Декларация За Лични Данни",
  },
  {
    title: "Правилник За Вътрешния Ред",
  },
  {
    title: "Анкетен Лист",
  },
  {
    title: "Семейни Фактори",
  },
  {
    title: "Индивидуален План За Подкрепа",
  },
  {
    title: "Индивидуална Оценка На Потребностите От Подкрепа",
  },
  {
    title: "Анекс Прекратяване",
  },
  {
    title: "Анекс Продължаване",
  },
  {
    title: "Въглехидратен Лист",
  },
  {
    title: "Договор",
  },
  {
    title: "Молба За Отпуск - Резидент",
  },
  {
    title: "Състояние - Подробно",
  },
];

interface PatientsDocumentModalProps {
  patientsModalData: Patient | null;
}

const PatientsDocumentModal: React.FC<PatientsDocumentModalProps> = ({
  patientsModalData,
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [openUploadModal, setOpenUploadModal] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [formStatus, setFormStatus] = useState<AlertStatuses>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        if (!patientsModalData) return;

        const documnets = await callApi<GetQueryDocumentsByOwnerIdSnippet>({
          query: getQueryDocumentsByOwnerId(patientsModalData?._id),
        });

        if (documnets) {
          setDocuments(documnets);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    })();
  }, [patientsModalData]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        if (!patientsModalData) return;

        if (file) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("owner", patientsModalData._id);

          const createdDocment = await callApi<PostQueryCreateDocumentSnippet>({
            query: postQueryCreateDocument(formData),
          });

          if (createdDocment) {
            setDocuments((prev) => [...prev, createdDocment]);
            setFormStatus("success");
            setAlertMessage("Документа е добавен успешно!");
            setLoading(false);
          }
        }
      } catch (err) {
        console.error(err);
        setFormStatus("error");
        setAlertMessage("Невалидни данни, моля опитайте отново!");
        setLoading(false);
        setFile(null);
      }
    })();
  }, [file, patientsModalData]);

  const handleTemplateMenuItemClick = async (templateName: string) => {
    try {
      setLoading(true);

      if (!patientsModalData) return;

      const body: PostQueryCreateDocumentFromTemplateInput = {
        template: templateName,
        owner: patientsModalData._id,
      };

      const createdDocmentFromTemplate =
        await callApi<PostQueryCreateDocumentFromTemplateSnippet>({
          query: postQueryCreateDocumentFromTemplate(body),
        });

      if (createdDocmentFromTemplate) {
        setDocuments((prev) => [...prev, createdDocmentFromTemplate]);
        setFormStatus("success");
        setAlertMessage("Документа е добавен успешно!");
        setAnchorEl(null);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setFormStatus("error");
      setAlertMessage(
        "Възникна проблем със създаването на документа, моля опитайте отново!"
      );
      setAnchorEl(null);
      setLoading(false);
    }
  };

  return (
    <Stack width="100%" my={2}>
      <Stack
        width="100%"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={4}
        my={1}
      >
        <Button message="Качи файл" onClick={() => setOpenUploadModal(true)} />

        <Tooltip title="Добави Файл">
          <IconButton
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={(e: any) => setAnchorEl(e.currentTarget)}
            aria-label="Open to show more"
            title="Open to show more"
          >
            <NoteAddIcon color="info" sx={{ fontSize: "2rem" }} />
          </IconButton>
        </Tooltip>

        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          {DOCUMENTS_MENU_OPTIONS.map((item) => (
            <MenuItem
              onClick={() => handleTemplateMenuItemClick(item.title)}
              key={item.title}
              value={item.title}
            >
              {item.title}
            </MenuItem>
          ))}
        </Menu>
      </Stack>

      <DropzoneDialog
        open={openUploadModal}
        onClose={() => setOpenUploadModal(false)}
        onSave={(files) => {
          setFile(files[0]);
          setOpenUploadModal(false);
        }}
        showPreviews={true}
        maxFileSize={5000000}
        filesLimit={1}
        showAlerts={true}
        dialogTitle={"Качи файл"}
        fileObjects={[]}
        previewText={"Прегледай"}
        alertSnackbarProps={{
          anchorOrigin: { vertical: "top", horizontal: "center" },
        }}
      />

      <Alert
        message={alertMessage}
        showAlert={!!alertMessage}
        severity={formStatus}
      />

      {!loading ? (
        <PatientDocumentsList
          documents={documents}
          setDocuments={setDocuments}
          setLoading={setLoading}
        />
      ) : (
        <Stack width="100%" justifyContent="center" alignItems="center" my={2}>
          <CircularProgress />
        </Stack>
      )}
    </Stack>
  );
};

export default PatientsDocumentModal;

/* 
  Досие
  Допълнителен Лист
  Състояние 1
  Лично Дело
  Заявление
  Декларация За Лични Данни
  Правилник За Вътрешния Ред
  Анкетен Лист
  Семейни Фактори
  Индивидуален План За Подкрепа
  Индивидуална Оценка На Потребностите От Подкрепа
  Анекс Прекратяване
  Анекс Продължаване
  Въглехидратен Лист
  Договор
  Молба За Отпуск - Резидент
  Състояние - Подробно
*/
