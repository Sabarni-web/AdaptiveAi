import axios from 'axios';
// No extra imports needed

const API_URL = 'http://localhost:5000/api/v1/certificates';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getMyCertificates = async () => {
  const response = await axios.get(`${API_URL}/my-certificates`, getHeaders());
  return response.data;
};

export const getCertificateById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getHeaders());
  return response.data;
};

export const verifyCertificate = async (certificateId) => {
  const response = await axios.get(`${API_URL}/verify/${certificateId}`);
  return response.data;
};

export const getAdminCertificates = async (search = '') => {
  const response = await axios.get(`${API_URL}/admin/all?search=${search}`, getHeaders());
  return response.data;
};

export const deleteCertificate = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getHeaders());
  return response.data;
};
