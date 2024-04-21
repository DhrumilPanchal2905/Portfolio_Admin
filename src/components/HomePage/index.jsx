"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import DataForm from "@/components/DataForm";
import { RingLoader } from "react-spinners";
import styled from "styled-components";
import { FiEdit, FiTrash2, FiInfo } from "react-icons/fi";

Modal.setAppElement("#modal-root");

const DataTable = () => {
  const [data, setData] = useState([]);
  const [editingData, setEditingData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
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

  const openImageModal = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImageUrl("");
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
                    <td>{item.desc}</td>
                    <td>
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
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Data Form"
            style={{
              content: {
                top: "50%",
                left: "50%",
                right: "auto",
                bottom: "auto",
                marginRight: "-50%",
                transform: "translate(-50%, -50%)",
                width: "80%",
                maxWidth: "600px",
              },
            }}
          >
            <DataForm
              initialData={editingData}
              onClose={closeModal}
              refreshData={fetchData}
            />
          </Modal>
          <Modal
            isOpen={isImageModalOpen}
            onRequestClose={closeImageModal}
            contentLabel="Image Viewer"
            style={modalStyles}
          >
            <img
              src={selectedImageUrl}
              alt="Modal Content"
              style={{ width: "100%" }}
            />
          </Modal>
        </>
      )}
      <Modal
        isOpen={isLoginModalOpen}
        contentLabel="Login"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "300px",
          },
        }}
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
  );
};

export default DataTable;

// New styled component for the Login Modal
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 500px;
  margin: auto;
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
`;

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxWidth: "600px",
  },
};

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
