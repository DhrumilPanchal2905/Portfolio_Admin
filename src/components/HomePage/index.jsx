"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import DataForm from "@/components/DataForm";
import { RingLoader } from "react-spinners";
import styled from "styled-components";
import { FiEdit, FiTrash2, FiInfo, FiX } from "react-icons/fi";

Modal.setAppElement("#modal-root");

const DataTable = () => {
  const [data, setData] = useState([]);
  const [editingData, setEditingData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [selectedContent, setSelectedContent] = useState("");
  const [modalContent, setModalContent] = useState({ type: "", content: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await axios.get(
        `${process.env.NEXT_APP_BASE_URL}/api/data`
      );
      setData(result.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoginModalOpen(true); // Show login modal if no token found
    } else {
      fetchData(); // Fetch data if logged in
    }
  }, []);

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
            <ActionButton
              style={{
                marginTop: "50px",
                padding: "10px 20px",
                background: "#000",
              }}
              onClick={handleAddNew}
            >
              Add New Entry
            </ActionButton>
            <StyledTableWrapper>
              <StyledTable>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Image</th>
                    <th>Description</th>
                    <th>Data Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item._id}>
                      <td>{item.id}</td>
                      <td>{item.title}</td>
                      <td>
                        <FiInfo
                          onClick={() => openImageModal(item.img)}
                          style={{ cursor: "pointer" }}
                        />
                      </td>
                      <td>
                        <FiInfo
                          onClick={() =>
                            openContentModal(`<p>${item.desc}</p>`)
                          } // Wrapping `item.desc` in `<p>` for simplicity
                          style={{ cursor: "pointer" }}
                        />
                      </td>

                      {/* <td>{item.desc}</td> */}
                      <td >
                        <FiInfo
                          onClick={() => openImageModal(item.data_img)}
                          style={{ cursor: "pointer" }}
                        />
                      </td>
                      <td>
                        <ButtonContainer>
                          <ActionButton onClick={() => handleEdit(item)}>
                            <FiEdit /> Edit
                          </ActionButton>
                          <ActionButton
                            onClick={() => handleDelete(item._id)}
                            danger
                          >
                            <FiTrash2 /> Delete
                          </ActionButton>
                        </ButtonContainer>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </StyledTable>
            </StyledTableWrapper>
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
        <Modal
          isOpen={isLoginModalOpen}
          contentLabel="Login"
          style={modalStyles}
          ariaHideApp={false}
          shouldCloseOnOverlayClick={false} // Prevents closing the modal by clicking outside it
          onRequestClose={() => {}} // Overrides the default close behavior
        >
          {/* <LoginModalContent> */}
          <StyledForm onSubmit={handleLogin}>
            <h2>Admin Registration</h2>
            <FormGroup>
              <StyledInput
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <StyledInput
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormGroup>
            <SubmitButton type="submit">Register</SubmitButton>
          </StyledForm>
          {/* </LoginModalContent> */}
        </Modal>
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

const CloseIcon = styled(FiX)`
  cursor: pointer;
  position: absolute;
  top: 16px; // Adjust the position as needed
  right: 16px; // Adjust the position as needed
  font-size: 24px; // Adjust the size as needed
  color: #fff; // Adjust the color as needed

  &:hover {
    color: red; // Adjust hover color as needed
  }
`;

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

const LoginModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: white;
  max-width: 400px;
  margin: auto;
`;

const LoginInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

// const LoginButton = styled.button`
//   padding: 10px 20px;
//   background-color: #007bff;
//   color: white;
//   border: none;
//   border-radius: 5px;
//   cursor: pointer;
// `;

// Styled-components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: rgba(0, 0, 0, 0.1);
  height: 100vh;
`;

// const modalStyles = {
//   content: {
//     top: "50%",
//     left: "50%",
//     right: "auto",
//     bottom: "auto",
//     marginRight: "-50%",
//     transform: "translate(-50%, -50%)",
//     width: "80%",
//     maxWidth: "600px",
//   },
// };

const LoaderContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const StyledTableWrapper = styled.div`
  overflow-y: auto;
  max-height: 500px;
  width: 100%;
  max-width: 960px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  margin: 30px auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  td {
    text-align: left;
    padding: 12px;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }

  th {
    text-align: center;
    padding: 12px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    position: sticky;
    top: 0;
    background-color: #fff;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
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
