import { axiosInstance } from './axiosInstance';

export const getAllTests = async () => {
  const res = await axiosInstance.get('/test/getAll');
  return res.data.data;
};

export const createTest = async (test) => {
  const res = await axiosInstance.post('/test/create', test);
  return res.data.data;
};

export const updateTest = async (id, test) => {
  const res = await axiosInstance.put(`/test/${id}`, test);
  return res.data.data;
};

export const deleteTest = async (id) => {
  const res = await axiosInstance.delete(`/test/${id}`);
  return res.data;
};
