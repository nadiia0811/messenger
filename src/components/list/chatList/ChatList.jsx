import React, { useState, useEffect } from 'react';
import AddUser from '../../addUser/AddUser';
import { db } from '../../../lib/firebase';
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { useUserStore } from '../../../lib/userStore';
import { useChatStore } from '../../../lib/chatStore';
import './chat-list.css';

const ChatList = () => {

  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState("");

  const {currentUser} = useUserStore();
  const { changeChat } = useChatStore();

 useEffect(() => {
    const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
    const items = res.data()?.chats; 
   
    const promises = items?.map(async (item) => {  
       const userDocRef = doc(db, "users", item.receiverId);
       const userDocSnap = await getDoc(userDocRef);  

       const user = userDocSnap.data();
       return {...item, user};  
    });

    const chatData = await Promise.all(promises); 
    setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt)); 
  }, []); 

     return () => unSub();
  }, [currentUser.id]);


  const handleSelect = async (chat) => {
    changeChat(chat.chatId, chat.user); 
  };


  const filteredChats = chats.filter(
    chat => chat.user.username.toLowerCase().includes(input.toLowerCase()));
  
  return (
    <div className='chat-list'>
      <div className="search">
        <div className="search-bar">
            <img src="/search.png" alt="" />
            <input type="text" 
                   placeholder='Search'
                   onChange={(e) => setInput(e.target.value)}/>
        </div>
        <img src={addMode? "./minus.png" : "./plus.png" }
             className='add' alt="" 
             onClick={()=> setAddMode(!addMode)}/>
      </div>

      {filteredChats?.map((chat) => {

      return  <div className="item" 
                   key={chat.chatId} 
                   onClick={() => handleSelect(chat)}
                   style={{backgroundColor: chat?.isSeen ?   '#5183fe' : 'transparent'}} > 
                <img src={chat.user.avatar || "./avatar.png"} alt="" />             
                <div className="texts">
                  <span>{chat.user.blocked.includes(currentUser.id) ? "User" : chat.user.username}</span>
                  <p>{chat.lastMessage}</p>
                </div>
             </div>
      })}
         
       {addMode && <AddUser />}
    </div>
  )
}

export default ChatList;