"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import axios from "axios";
import Modal from "react-modal";
import DataForm from "@/components/DataForm";
import { RingLoader } from "react-spinners";
import styled from "styled-components";
import { AgGridReact } from "ag-grid-react";
import {
  // ClientSideRowModelModule,
  // ModuleRegistry,
  AllCommunityModule,
  ModuleRegistry,
} from "ag-grid-community";
// import { MultiFilterModule } from "@ag-grid-community/multi-filter";
// import { ModuleRegistry } from "@ag-grid-community/core"; // ✅ Correct import
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
import { FiEdit, FiTrash2, FiInfo, FiX } from "react-icons/fi";
import { Button } from "@mui/material";

// Modal.setAppElement("#modal-root");

// ✅ Register AG Grid Modules
// ModuleRegistry.registerModules([ClientSideRowModelModule]);
ModuleRegistry.registerModules([AllCommunityModule]);

const DataTable = ({ data, fetchData, isLoading, setIsLoading }) => {
  // const [data, setData] = useState([]);
  const [editingData, setEditingData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [selectedContent, setSelectedContent] = useState("");
  const [modalContent, setModalContent] = useState({ type: "", content: "" });
  // const [isLoading, setIsLoading] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const gridRef = useRef();

  // const fetchData = async () => {
  //   setIsLoading(true);
  //   try {
  //     const result = await axios.get(
  //       `${process.env.NEXT_APP_BASE_URL}/api/data`
  //     );
  //     console.log("result:", result);
  //     setData(result.data);
  //   } catch (error) {
  //     console.error("Error fetching data: ", error);
  //   }
  //   setIsLoading(false);
  // };

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     setIsLoginModalOpen(true); // Show login modal if no token found
  //   } else {
  //     fetchData(); // Fetch data if logged in
  //   }
  // }, []);

  const handleDelete = async (_id) => {
    setIsLoading(true);
    try {
      await axios.delete(`${process.env.NEXT_APP_BASE_URL}/api/data`, {
        data: { _id },
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting data: ", error);
    }
    setIsLoading(false);
  };

  const handleEdit = (data) => {
    setEditingData(data);
    setIsModalOpen(true);
  };

  const [coldefs, setColDefs] = useState([
    { headerName: "Sr.", field: "id", sortable: true, filter: true, width: 50 },
    {
      headerName: "Title",
      field: "title",
      sortable: true,
      filter: "agTextColumnFilter",
      width: 150,
      cellStyle: { whiteSpace: "pre-wrap", lineHeight: "1.5" },
    },
    {
      headerName: "Image",
      field: "img",
      width: 100,
      cellRenderer: (params) => (
        <Button
          onClick={() => openImageModal(params.value)}
          variant="destructive"
        >
          <FiInfo size={20} />
        </Button>
      ),
    },
    {
      headerName: "Description",
      field: "desc",
      sortable: true,
      filter: "agTextColumnFilter",
      width: 550,
      cellStyle: { whiteSpace: "pre-wrap", lineHeight: "1.5" }, // ✅ Multi-line text
    },
    {
      headerName: "Data Image",
      field: "data_img",
      width: 150,
      cellRenderer: (params) => (
        <Button
          onClick={() => openImageModal(params.value)}
          variant="destructive"
        >
          <FiInfo size={20} />
        </Button>
      ),
    },
    {
      headerName: "Actions",
      field: "_id",
      cellRenderer: (params) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button onClick={() => handleEdit(params.data)} variant="outline">
            <FiEdit size={20} color="#3498db" />
          </Button>
          <Button
            onClick={() => handleDelete(params.value)}
            variant="destructive"
          >
            <FiTrash2 size={20} color="red" />
          </Button>
        </div>
      ),
    },
  ]);
  //   ],
  //   []
  // );

  // ✅ Default Column Definitions
  const defaultColDef = useMemo(
    () => ({
      floatingFilter: true,
      menuTabs: ["filterMenuTab"],
      autoHeight: true, // ✅ Adjust height automatically
    }),
    []
  );

  // ✅ Increase Row Height
  const getRowHeight = useCallback(() => 60, []);
  const handleAddNew = () => {
    setEditingData({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingData(null);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImageUrl("");
  };

  const openImageModal = (imageUrl) => {
    setModalContent({ type: "image", content: imageUrl });
    setIsImageModalOpen(true);
  };

  const openContentModal = (content) => {
    setModalContent({ type: "text", content: `<p>${content}</p>` });
    setIsImageModalOpen(true);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    // Simplified login check for demonstration
    if (
      email === process.env.NEXT_APP_EMAIL &&
      password === process.env.NEXT_APP_PASSWORD
    ) {
      localStorage.setItem("token", "fake_token"); // Set a fake token
      setIsLoginModalOpen(false);
      fetchData(); // Fetch data after login
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <>
      <Container>
        {isLoading ? (
          <LoaderContainer>
            <RingLoader color="#000" size={100} />
          </LoaderContainer>
        ) : (
          <>
            {data.length > 0 && (
              <>
                <ActionButton
                  style={{
                    padding: "10px 20px",
                    background: "#000",
                  }}
                  onClick={handleAddNew}
                >
                  Add New Entry
                </ActionButton>
                <div
                  className="ag-theme-alpine"
                  style={{ height: 500, width: "100%", padding: "10px" }}
                >
                  <AgGridReact
                    ref={gridRef}
                    rowData={data}
                    columnDefs={coldefs}
                    defaultColDef={defaultColDef}
                    // pagination={true}
                    getRowHeight={getRowHeight} // ✅ Increase row height
                  />
                </div>

                <Modal
                  className="z-20"
                  isOpen={isModalOpen}
                  onRequestClose={closeModal}
                  contentLabel="Data Form"
                  style={modalStyles}
                >
                  {/* <CloseIcon onClick={closeModal} /> */}
                  <DataForm
                    initialData={editingData}
                    onClose={closeModal}
                    refreshData={fetchData}
                  />
                </Modal>
                <Modal
                  isOpen={isImageModalOpen}
                  onRequestClose={closeImageModal}
                  contentLabel="Content Viewer"
                  style={modalStyles}
                >
                  {modalContent.type === "text" ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: modalContent.content }}
                      style={{
                        width: "100%",
                        maxHeight: "80vh",
                        overflowY: "auto",
                      }}
                    ></div>
                  ) : modalContent.type === "image" ? (
                    <img
                      src={modalContent.content}
                      alt="Content"
                      style={{ width: "100%", maxHeight: "80vh" }}
                    />
                  ) : null}
                </Modal>
              </>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default DataTable;

// New styled component for the Login Modal

const modalStyles = {
  content: {
    position: "absolute",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "10px", // Round the corners of the modal
    maxWidth: "600px", // Limit the maximum width for better appearance on large screens
    width: "90%", // Use a percentage width for better responsivenes
    zIndex: 1050, // Ensure it's on top of other items
    display: "flex", // Use flex to help with the inner alignment
    flexDirection: "column", // Stack content vertically
    alignItems: "center", // Center align the items
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 1040,
  },
};

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 90%; /* Adjust width to be auto for responsiveness */
  max-width: 500px; /* Max width to ensure it doesn't stretch too far on larger screens */
  height: auto; /* Height set to auto to adjust based on content */
  max-height: 80vh; /* Max height to ensure form doesn't take up the entire screen height */
  margin: 2vh auto; /* Center the form vertically and horizontally with margin */
  background: #fff;
  border-radius: 8px; /* Optional: rounded corners for aesthetic */
  padding: 20px; /* Padding inside the form */
  overflow-y: auto; /* Enable vertical scrolling for overflow content */
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const StyledInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;

  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: rgba(0, 0, 0, 0.1);
  height: 100vh;
`;

const LoaderContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: ${(props) => (props.danger ? "#e74c3c" : "#3498db")};
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;
