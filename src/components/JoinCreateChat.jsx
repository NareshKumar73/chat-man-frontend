import { useState } from "react";
import chatIcon from "../assets/chat.png";
import toast from "react-hot-toast";
import { createRoomApi, joinChatApi } from "../services/RoomService";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";

const JoinCreateChat = () => {

  const navigate = useNavigate();

  const {
    roomId,
    setRoomId,
    currentUser,
    setCurrentUser,
    connected,
    setConnected,
  } = useChatContext();

  const [detail, setDetail] = useState({
    roomId: "",
    userName: "",
  });

  function handleFormInputChange(event) {
    setDetail({
      ...detail,
      [event.target.name]: event.target.value,
    });
  }

  async function joinChat() {
    if (validForm()) {
      console.log(detail);
      try {
        const room = await joinChatApi(detail.roomId);
        console.log(room);
        toast.success("Chat joined successfully!!");

        setCurrentUser(detail.userName);
        setRoomId(room.roomId);
        setConnected(true);
        navigate("/chat");
      } catch (error) {
        if (error.status == 400) {
          console.log(error.status);
          console.log(error.response.data);
          toast.error(error.response.data);
        } else console.error(error);
        console.log("Error in joinChat");
      }
    }
  }

  async function createRoom() {
    if (validForm()) {
      console.log(detail);
      try {
        const room = await createRoomApi(detail.roomId);
        console.log(room);
        toast.success("Room created successfully!!");

        setCurrentUser(detail.userName);
        setRoomId(room.roomId);
        setConnected(true);
        navigate("/chat");
      } catch (error) {
        if (error.status == 400) {
          console.log(error.status);
          console.log(error.response.data);
          toast.error(error.response.data);
        } else console.error(error);
        console.log("Error in createRoom");
      }
    }
  }

  function validForm() {
    if (detail.userName === "" || detail.roomId === "") {
      toast.error("Invalid Input");
      return false;
    }
    return true;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-10 dark:border-gray-700 border w-full flex flex-col gap-5 max-w-md rounded dark:bg-gray-900 shadow">
        <div>
          <img src={chatIcon} className="w-24 mx-auto" alt="chat icon" />
          {/* <a href="https://www.flaticon.com/free-icons/question" title="question icons">Question icons created by dmitri13 - Flaticon</a> */}
        </div>
        <h1 className="text-2xl font-semibold text-center">
          Join Room / Create Room
        </h1>
        <div className="">
          <label htmlFor="name" className="block font-medium mb-2">
            Your Name
          </label>
          <input
            type="text"
            name="userName"
            placeholder="Enter your Name"
            onChange={handleFormInputChange}
            value={detail.userName}
            className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="">
          <label htmlFor="roomId" className="block font-medium mb-2">
            Room ID
          </label>
          <input
            type="text"
            name="roomId"
            placeholder="Enter a Room ID"
            onChange={handleFormInputChange}
            value={detail.roomId}
            className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className=" flex justify-center gap-2 mt-2">
          {/* <button
            onClick={createRoom}
            className="px-3 py-2 dark:bg-blue-500 hover:dark:bg-blue-800 rounded-full"
          >
            Create Room
          </button> */}
          <button 
            onClick={createRoom}
          type="button" className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
          Create Room
          </button>
          <button 
          onClick={joinChat}
          type="button" className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
          Join Room
          </button>
          {/* <button
            className="px-3 py-2 dark:bg-orange-500 hover:dark:bg-orange-800 rounded-full"
            >
              Teal
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default JoinCreateChat;
