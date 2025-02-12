import { Axios } from "./Axios";

export const createRoomApi = async (roomId) => {
  let room = { roomId: roomId };
  const res = await Axios.post(`/api/v1/rooms`, room);
  return res.data;
};

export const joinChatApi = async (roomId) => {
  const res = await Axios.get(`/api/v1/rooms/${roomId}`);
  return res.data;
};

export const getMessages = async (roomId) => {
  const res = await Axios.get(`/api/v1/rooms/${roomId}/messages`);
  return res.data;
};
