import React, { useState, useRef, useEffect } from 'react';
import { db } from '../../lib/firebase';
import EmojiPicker from 'emoji-picker-react';
import { onSnapshot, doc, updateDoc, arrayUnion, getDoc} from 'firebase/firestore';
import { useChatStore } from '../../lib/chatStore';
import { useUserStore } from '../../lib/userStore';
import upload from '../../lib/upload';
import './chat.css';


const Chat = () => {
  const [open, setOpen] = useState(false);  
  const [text, setText] = useState("");  
  const [chat, setChat] = useState();  
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();
  const { currentUser } = useUserStore();
  const [img, setImg] = useState({
    file: null,
    url: ""
  });  

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString(undefined, options);
  }
  
  const inpRef = useRef(); 
  const endRef = useRef(null);

  const handleImg = (e) => {
    if(e.target.files[0]) {
      setImg({  file: e.target.files[0], 
                url: URL.createObjectURL(e.target.files[0])
             });        
    } 
  };

  const handleSend = async () => {   
    if( text === "") return;

    let imgUrl = null;

    try {
        if (img.file) {
          imgUrl = await upload(img.file);
          console.log(imgUrl)
        }

       await updateDoc(doc(db, "chats", chatId), {
          messages: arrayUnion({
            senderId: currentUser.id,
            text,
            createdAt: new Date(),
            ...(imgUrl && {img: imgUrl})  
        })       
      }); 

      const userIDs = [currentUser.id, user.id]; 
      
      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id) 
        const userChatsSnapshot = await getDoc(userChatsRef);

        if(userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();
          const chatIndex = userChatsData.chats.findIndex((chat) => chat.chatId === chatId);
        
          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats
          });
        }
      }
    );}

    catch (err) {
      console.log(err);
    }
     setText(""); 
     setImg({
       file: null,
       url: ""
     });
  };

  useEffect(() => { 
    endRef.current?.scrollIntoView({behavior: "smooth"});
  }, []);

  useEffect(() => {
    const unSub = onSnapshot(doc(db,"chats", chatId), (res) => {
      setChat(res.data()); 
    });
    return () => unSub();
  }, [chatId]);

  const handleEmoji = (e) => {
    setText(prev => prev + e.emoji);
    setOpen(false);
  };

  
  return (
    <div className='chat'>
      <div className="top">
        <div className="user">
          <img src={user.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{user.username}</span>
            <p>Lorem ipsum dolor sit amet consectetur
               adipisicing elit lorem
            </p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>

      <div className="center">
  
      {chat?.messages?.map((message) => {
        const date = message.createdAt.toDate();
        const formattedDate = formatDate(date);
        
         return  <div className={message.senderId === currentUser.id ? "message own" : "message"} key={message?.createdAt}>
                    <img src={message.senderId === currentUser.id? currentUser.avatar : user.avatar} alt="" /> 
                    <div className="texts">
                      {message.img && <img src={message.img} alt="" className='img'/>}
                      <p>{message.text}</p>
                      <span>{formattedDate}</span>
                    </div>
                 </div>
       })}

      {img.url && <div className='message own'>
         <div className="texts">
          <img src={img.url} alt="" className='img'/>
         </div>
       </div>}

       <div ref={endRef}></div>
      </div>

      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./img.png" alt="" />           
          </label>
          <input type="file" id='file' 
                 style={{display: 'none'}}
                 onChange={handleImg}/>
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input type="text" 
               placeholder={(isCurrentUserBlocked || isReceiverBlocked) ?'You can\'t send a message' : 'Type a message...'}
               onChange={(e) => setText(e.target.value)}
               value={text}
               ref={inpRef}
               disabled={isCurrentUserBlocked || isReceiverBlocked}/>
        <div className="emoji">
          <img src="./emoji.png" 
               alt="" 
               onClick={() => setOpen(!open)}/>
          <div className="picker">
              <EmojiPicker open={open} onEmojiClick={handleEmoji}/> 
          </div>              
        </div>
        <button className='send-btn' 
                onClick={handleSend}
                disabled={isCurrentUserBlocked || isReceiverBlocked}>Send</button>
      </div>
    </div>
  )
}

export default Chat;