import React, {useState} from 'react';
import { db } from '../../lib/firebase';
import { setDoc, collection, doc, getDocs, query, where, serverTimestamp, updateDoc, arrayUnion } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useUserStore } from '../../lib/userStore';
import './addUser.css';

const AddUser = () => {

  const [user, setUser] = useState(null);
  const { currentUser } = useUserStore();

  const handleAdd = async () => {  
   
    const chatRef = collection(db, "chats");    
    const userChatsRef = collection(db, "userchats");
  
    try {
      const newChatRef = doc(chatRef);  
    
      await setDoc(newChatRef, {     
                    createdAt: serverTimestamp(), 
                    messages: [],
                 });  

    await setDoc(doc(userChatsRef, currentUser.id), {
      chats: []
    })  

    await updateDoc(doc(userChatsRef, currentUser.id), {  
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
      })
     });           

      await updateDoc(doc(userChatsRef, user.id), { 
          chats: arrayUnion({
             chatId: newChatRef.id,
             lastMessage: "",
             receiverId: currentUser.id,
             updatedAt: Date.now(),
        })
      })   
    } catch(err) {
     console.log(err.message);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    //const { username } = Object.fromEntries(formData);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapshot = await getDocs(q); 
      
      if(!querySnapshot.empty) {
        setUser(querySnapshot.docs[0].data());  
      }
    
    } catch (err){
      toast.error(err.message);
      console.log(err);
    }
  }

  return (
    <div className='add-user'>
       <form onSubmit={handleSearch}>
         <input type="text" placeholder='User name' name='username'/>
         <button>Search</button>
       </form>

       {user && <div className="user">
         <div className="detail">
             <img src={user.avatar || "./avatar.png"} alt="" /> 
            <span>{user.username}</span>
         </div>
         <button onClick={handleAdd}>Add User</button>
       </div>}
    </div>
  )
}

export default AddUser;