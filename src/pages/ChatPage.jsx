import toast from "react-hot-toast";
import mimeIcon from "../assets/attachment.png";
import sendIcon from "../assets/send.png";
import { useEffect, useRef, useState } from "react";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import { baseURL } from "../services/Axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getMessages } from "../services/RoomService";
import timeAgo from "../services/TimeUtil";

function ChatPage() {
  const {
    roomId,
    setRoomId,
    currentUser,
    setCurrentUser,
    connected,
    setConnected,
  } = useChatContext();

  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");

  // const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const stompClient = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!connected) navigate("/room");

    return () => {};
  }, [connected, currentUser, roomId]);

  useEffect(() => {
    // Initialize STOMP client
    stompClient.current = new Client({
      reconnectDelay: 5000,
      heartbeatOutgoing: 4000,
      debug: (msg) => console.log(msg),
    });

    stompClient.current.webSocketFactory = function () {
      return new SockJS(`${baseURL}/chat`);
    };

    // Handle connection
    stompClient.current.onConnect = () => {
      console.log("Connected to WebSocket");
      setConnected(true);

      // Subscribe to a topic
      stompClient.current.subscribe(`/topic/room/${roomId}`, (message) => {
        console.log(message);

        if (message.body) {
          const newMsg = JSON.parse(message.body);

          setMessages((prev) => [...prev, newMsg]);
        }
      });
    };

    // Handle disconnection
    stompClient.current.onDisconnect = () => {
      console.log("Disconnected from WebSocket");
      setConnected(false);
    };

    // Activate the client
    stompClient.current.activate();

    // Cleanup on component unmount
    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [roomId, setConnected]);

  useEffect(() => {
    async function loadMessages() {
      try {
        console.log("LOAD MESSAGES");
        const messageHistory = await getMessages(roomId);
        console.log(messageHistory);
        setMessages(messageHistory);
      } catch (error) {
        if (error.status == 400) {
          console.log(error.status);
          console.log(error.response.data);
        } else console.error(error);
        console.log("Error while loading previous messages");
      }
    }

    if (connected) loadMessages();

    return () => {};
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }

    return () => {};
  }, [messages]);

  const sendMessage = async () => {
    if (stompClient.current && connected && input.trim()) {
      console.log(input);
      toast.success("Message Sent")

      const m = {
        sender: currentUser,
        content: input,
        roomId: roomId,
      };

      stompClient.current.publish({
        destination: `/app/sendMessage/${roomId}`,
        body: JSON.stringify(m),
      });

      setInput("");
      // setMessages((prev) => [...prev,m]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="">
      {/* Nav Bar */}
      <header className="dark:border-gray-700 dark:bg-gray-900 h-20 fixed w-full py-5 shadow flex justify-around items-center">
        <div className="">
          <h1 className="text-xl font-semibold">
            Room : <span>{roomId}</span>
          </h1>
        </div>
        <div className="">
          <h1 className="text-xl font-semibold">
            User : <span>{currentUser}</span>
          </h1>
        </div>
        <div className="">
          <button
            onClick={() => {
              setRoomId("");
              setCurrentUser("");
              navigate("/room");
              toast.success("Logout Successfull");
            }}
            className="dark:bg-red-500 dark:hover:bg-red-700 px-3 py-2 rounded-full"
          >
            Leave Room
          </button>
        </div>
      </header>
      <main
        ref={chatBoxRef}
        className="py-20 px-2 w-2/3 dark:bg-slate-600 mx-auto h-screen overflow-auto"
      >
        <div className="message-container">
          {messages.map((m, index) => (
            <div
              key={index}
              className={`flex ${
                m.sender == currentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`my-2 ${
                  m.sender == currentUser ? " bg-green-800" : " bg-gray-800"
                } p-2 max-w-xs rounded`}
              >
                <div className="flex flex-row gap-2">
                  <img
                    className="h-10 w-10"
                    src="https://avatar.iran.liara.run/public"
                    alt="avatar"
                  />
                  <div className="flex flex-col gap-1">
                    <p>{m.sender}</p>
                    <p>{m.content}</p>
                    <p className="text-xs text-gray-400">
                      {timeAgo(m.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      {/* Chat Bar */}
      <div className="fixed bottom-2 w-full h-16">
        <div className="dark:bg-gray-900 h-full flex justify-between items-center px-2 gap-4 rounded w-96 lg:w-2/3 mx-auto">
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder="Type your message here..."
            className="dark:border-gray-700 dark:bg-gray-800 px-3 py-2 rounded-r-full focus:outline-none w-full h-12"
          />
          <button
            className="dark:bg-purple-600 rounded-xl py-1 mx-1"
            onClick={() => toast.success("Attach File")}
          >
            <img src={mimeIcon} alt="attachment" className="h-10 w-10" />
            {/* <a href="https://www.flaticon.com/free-icons/attachment" title="attachment icons">Attachment icons created by ALTOP7 - Flaticon</a> */}
          </button>
          <button
            className="mx-1"
            onClick={() => {
              sendMessage();
              toast.success("Message Sent");
            }}
          >
            <img src={sendIcon} alt="send" className="h-10 w-12" />
            {/* <a href="https://www.flaticon.com/free-icons/send" title="send icons">Send icons created by Ilham Fitrotul Hayat - Flaticon</a> */}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;

// const sock = new SockJS(`${baseURL}/chat`);
// const client = Stomp.over(sock);

// client.connect({}, () => {
//   setStompClient(client);

//   toast.success("Connected");
//   console.log("Connected")

//   client.subscribe(`/topic/room/${roomId}`, (message) => {
//     console.log(message);

//     const newMsg = JSON.parse(message.body);

//     setMessages((prev) => [...prev, newMsg]);
//   });
// });
