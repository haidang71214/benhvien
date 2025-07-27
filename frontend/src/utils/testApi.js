import { axiosInstance } from './axiosInstance';

export const getAllTests = async () => {
  const res = await axiosInstance.get('/api/v1/test/getAll');
  return res.data.data;
};

export const createTest = async (test) => {
  const res = await axiosInstance.post('/api/v1/test/create', test);
  return res.data.data;
};

export const updateTest = async (id, test) => {
  const res = await axiosInstance.put(`/api/v1/test/${id}`, test);
  return res.data.data;
};

export const deleteTest = async (id) => {
  const res = await axiosInstance.delete(`/api/v1/test/${id}`);
  return res.data;
};
