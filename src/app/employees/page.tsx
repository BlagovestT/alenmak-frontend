"use client";
import { useEffect, useState } from "react";
import Button from "@/components/MUIComponents/Button";
import Table from "@/components/SmallComponents/Table/Table";
import { IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { callApi } from "@/services/callApi";
import { getQueryEmployees } from "@/services/Employees/apiEmployeesGetQueries";
import {
  Employee,
  GetQueryEmployeesSnippet,
  PostQueryDeleteEmployeeSnippet,
} from "@/services/Employees/apiEmployeesSnippets";
import Modal from "@/components/MUIComponents/Modal";
import EmployeeForm from "@/components/PageComponents/Employees/EmployeesForm";
import Dialog from "@/components/MUIComponents/Dialog";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { postQueryDeleteEmployee } from "@/services/Employees/apiEmployeesPostQueries";

const EmployeesPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeModalData, setEmployeeModalData] = useState<Employee | null>(
    null
  );
  const [openEmployeeModal, setOpenEmployeeModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const employees = await callApi<GetQueryEmployeesSnippet>({
          query: getQueryEmployees,
        });

        if (employees) {
          setEmployees(employees);
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
          Персонал
        </Typography>
        <Button
          message="+ Добави"
          onClick={() => {
            setEmployeeModalData(null);
            setOpenEmployeeModal(true);
          }}
          disabled={loading}
        />
      </Stack>

      <Table
        getRowId={(row) => row._id}
        rows={employees}
        columns={columns(
          setEmployees,
          setOpenEmployeeModal,
          setEmployeeModalData,
          setLoading
        )}
        loading={loading}
      />

      <Modal
        modalTitle={
          employeeModalData
            ? `${employeeModalData.first_name} ${employeeModalData.last_name}`
            : "Добави Работник"
        }
        open={openEmployeeModal}
        setOpen={setOpenEmployeeModal}
      >
        <EmployeeForm
          employeeModalData={employeeModalData}
          setEmployees={setEmployees}
          setOpenEmployeeModal={setOpenEmployeeModal}
        />
      </Modal>
    </Stack>
  );
};

export default EmployeesPage;

const columns = (
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>,
  setOpenEmployeeModal: React.Dispatch<React.SetStateAction<boolean>>,
  setEmployeeModalData: React.Dispatch<React.SetStateAction<Employee | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
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
      field: "occupation",
      headerName: "Длъжност",
      flex: 1,
    },
    {
      field: "salary",
      headerName: "Заплата",
      flex: 1,
      renderCell: (params: any) => {
        return params.row.salary + " лв.";
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
            <Tooltip title="Промени">
              <IconButton
                onClick={() => {
                  setEmployeeModalData(params.row);
                  setOpenEmployeeModal(true);
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
                dialogTitle={`Изтриване на работник ${params.row.first_name} ${params.row.last_name}`}
                dialogDescription="Сигурни ли сте, че искате да изтриете този работник?"
                onConfirm={() =>
                  handleDeleteStaff(params.row._id, setEmployees, setLoading)
                }
              />
            </Tooltip>
          </Stack>
        );
      },
    },
  ];
};

const handleDeleteStaff = async (
  employeeID: string,
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    setLoading(true);
    const deletedEmployee = await callApi<PostQueryDeleteEmployeeSnippet>({
      query: postQueryDeleteEmployee(employeeID),
    });

    if (deletedEmployee.message === "Employee deleted") {
      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee._id !== employeeID)
      );
      setLoading(false);
    }
  } catch (error) {
    console.error(error);
    setLoading(false);
  }
};
