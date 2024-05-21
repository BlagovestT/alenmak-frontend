"use client";
import { useEffect, useState } from "react";
import Button from "@/components/MUIComponents/Button";
import Table from "@/components/SmallComponents/Table/Table";
import { IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { callApi } from "@/services/callApi";
import { getQueryPatients } from "@/services/Patients/apiPatientsGetQueries";
import {
  GetQueryPatientsSnippet,
  Patient,
  PostQueryDeletePatientSnippet,
} from "@/services/Patients/apiPatientsSnippets";
import Modal from "@/components/MUIComponents/Modal";
import PatientsForm from "@/components/PageComponents/Patients/PatientsForm";
import Dialog from "@/components/MUIComponents/Dialog";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { postQueryDeletePatient } from "@/services/Patients/apiPatientsPostQueries";
import ArchiveIcon from "@mui/icons-material/Archive";
import GroupsIcon from "@mui/icons-material/Groups";
import FolderIcon from "@mui/icons-material/Folder";
import PatientDocumentModal from "@/components/PageComponents/Patients/PatientDocuments/PatientDocumentsModal";

const PatientsPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientsModalData, setPatientsModalData] = useState<Patient | null>(
    null
  );
  const [openPatientsModal, setOpenPatientsModal] = useState<boolean>(false);
  const [tableView, setTableView] = useState<
    "ActivePatients" | "OtherPatients"
  >("ActivePatients");
  const [modalType, setModalType] = useState<"form" | "documents">();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const patients = await callApi<GetQueryPatientsSnippet>({
          query: getQueryPatients,
        });

        if (patients) {
          setPatients(patients);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Stack
      width="100%"
      minHeight="85vh"
      bgcolor="#fff"
      mt={8}
      p="1rem"
      borderRadius="5px"
    >
      <Stack
        width="100%"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography component="h2" variant="h3">
          Пациенти
        </Typography>

        <Stack
          justifyContent="center"
          alignItems="center"
          direction="row"
          gap={1}
        >
          <Tooltip
            title={tableView === "ActivePatients" ? "Архив" : "Пациенти"}
          >
            <IconButton
              onClick={() =>
                setTableView(
                  tableView === "ActivePatients"
                    ? "OtherPatients"
                    : "ActivePatients"
                )
              }
            >
              {tableView === "ActivePatients" ? (
                <ArchiveIcon sx={{ fontSize: "2rem" }} />
              ) : (
                <GroupsIcon sx={{ fontSize: "2rem" }} />
              )}
            </IconButton>
          </Tooltip>

          <Button
            message="+ Добави"
            onClick={() => {
              setModalType("form");
              setPatientsModalData(null);
              setOpenPatientsModal(true);
            }}
            disabled={loading}
          />
        </Stack>
      </Stack>

      <Table
        getRowId={(row) => row._id}
        rows={patients.filter((patient: Patient) =>
          tableView === "ActivePatients"
            ? patient.status === "active"
            : patient.status !== "active"
        )}
        columns={columns(
          setPatients,
          setOpenPatientsModal,
          setPatientsModalData,
          setLoading,
          setModalType
        )}
        loading={loading}
      />

      <Modal
        modalTitle={
          patientsModalData && modalType === "form"
            ? `${patientsModalData.first_name} ${patientsModalData.last_name}`
            : !patientsModalData && modalType === "form"
            ? "Добави Пациент"
            : `${patientsModalData?.first_name} ${patientsModalData?.last_name} Документи `
        }
        open={openPatientsModal}
        setOpen={setOpenPatientsModal}
      >
        <>
          {modalType === "form" && (
            <PatientsForm
              patientsModalData={patientsModalData}
              setPatients={setPatients}
              setOpenPatientsModal={setOpenPatientsModal}
            />
          )}

          {modalType === "documents" && (
            <PatientDocumentModal patientsModalData={patientsModalData} />
          )}
        </>
      </Modal>
    </Stack>
  );
};

export default PatientsPage;

const columns = (
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>,
  setOpenPatientModal: React.Dispatch<React.SetStateAction<boolean>>,
  setPatientModalData: React.Dispatch<React.SetStateAction<Patient | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setModalType: React.Dispatch<
    React.SetStateAction<"form" | "documents" | undefined>
  >
): GridColDef[] => {
  return [
    {
      field: "first_name",
      headerName: "Име",
      flex: 1,
    },
    {
      field: "last_name",
      headerName: "Фамилия",
      flex: 1,
    },
    {
      field: "gender",
      headerName: "Пол",
      flex: 1,
      renderCell: (params: any) => {
        return params.row.gender === "male" ? "Мъж" : "Жена";
      },
    },
    {
      field: "age",
      headerName: "Години",
      flex: 1,
    },
    {
      field: "group",
      headerName: "Група",
      flex: 1,
      renderCell: (params: any) => {
        return (
          params.row.group.charAt(0).toUpperCase() + params.row.group.slice(1)
        );
      },
    },
    {
      field: "status",
      headerName: "Статус",
      flex: 1,
      renderCell: (params: any) => {
        switch (params.row.status) {
          case "active":
            return "Активен";
          case "inactive":
            return "Неактивен";
          case "released":
            return "Изписан";
          case "deceased":
            return "Починал";
          default:
            return "Няма статус";
        }
      },
    },
    {
      field: "paid",
      headerName: "Платено",
      flex: 1,
      renderCell: (params: any) => {
        return (
          <Stack height="100%" justifyContent="center" alignItems="flex-start">
            <Typography
              component="p"
              variant="body1"
              color={params.row.paid === "paid" ? "primary.main" : "error"}
            >
              {params.row.paid === "paid" ? "Платено" : "Неплатено"}
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Дата",
      flex: 1,
      renderCell: (params: any) => {
        return new Date(params.row.createdAt).toLocaleDateString("bg-BG");
      },
    },
    {
      field: "actions",
      headerName: "Действия",
      flex: 1,
      renderCell: (params: any) => {
        return (
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            {/* Edit */}
            <Tooltip title="Документи">
              <IconButton
                onClick={() => {
                  setModalType("documents");
                  setPatientModalData(params.row);
                  setOpenPatientModal(true);
                }}
              >
                <FolderIcon color="info" />
              </IconButton>
            </Tooltip>

            {/* Edit */}
            <Tooltip title="Промени">
              <IconButton
                onClick={() => {
                  setModalType("form");
                  setPatientModalData(params.row);
                  setOpenPatientModal(true);
                }}
              >
                <EditIcon sx={{ color: "#FFA319" }} />
              </IconButton>
            </Tooltip>

            {/* Delete */}
            <Tooltip title="Изтрий">
              <Dialog
                icon={<DeleteIcon sx={{ color: "#FF1943" }} />}
                buttonText="Изтрий"
                dialogTitle={`Изтриване на пациент ${params.row.first_name} ${params.row.last_name}`}
                dialogDescription="Сигурни ли сте, че искате да изтриете този пациент?"
                onConfirm={() =>
                  handleDeletePatient(params.row._id, setPatients, setLoading)
                }
              />
            </Tooltip>
          </Stack>
        );
      },
    },
  ];
};

const handleDeletePatient = async (
  patientID: string,
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    setLoading(true);
    const deletedPatient = await callApi<PostQueryDeletePatientSnippet>({
      query: postQueryDeletePatient(patientID),
    });

    if (deletedPatient.message === "Patient removed") {
      setPatients((prevPatients) =>
        prevPatients.filter((patient) => patient._id !== patientID)
      );
      setLoading(false);
    }
  } catch (error) {
    console.error(error);
    setLoading(false);
  }
};
