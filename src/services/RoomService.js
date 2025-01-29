import { Axios } from "./Axios";

export const createRoomApi = async (roomId) => {
  const res = await Axios.post(`/api/v1/rooms`, roomId, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
  return res.data;
};

export const joinChatApi = async (roomId) => {
  const res = await Axios.get(`/api/v1/rooms/${roomId}`, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
  return res.data;
};

export const getMessages = async (roomId) => {
  const res = await Axios.get(`/api/v1/rooms/${roomId}/messages`);
  return res.data;
};
