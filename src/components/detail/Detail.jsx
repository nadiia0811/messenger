import React from 'react';
import { auth, db } from '../../lib/firebase';
import { useChatStore } from '../../lib/chatStore';
import { useUserStore } from '../../lib/userStore';
import { updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import './detail.css';


const Detail = () => {

  const { user, isCurrentUserBlocked, isReceiverBlocked, changeBlocked } = useChatStore();
  const {currentUser} = useUserStore();
 
  const handleBlock = async () => {  
    if( !user ) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id)     
      })

      changeBlocked();
    }catch(err) {
      console.log(err);
    }
  };


  return (
    <div className='detail'>
      <div className="user">
        <img src={user?.avatar ||"./avatar.png"} alt="" />
        <h2>{user?.username}</h2>
        <p>Lorem ipsum dolor sit amet consectetur a v laudm olestias delenitillo!</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Privacy & help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <img src="./arrowDown.png" alt="" />
          </div>
          <div className="photos">
            <div className="photo-item">
              <div className="photo-detail">
                <img src="./morskie-oko-tatry.jpg" alt=""/>                 
                <span>photo_2024.png</span>
              </div> 
              <img src="./download.png" alt="" className='download'/>            
            </div>
            <div className="photo-item">
              <div className="photo-detail">
                <img src="./morskie-oko-tatry.jpg" alt=""/>
                <span>photo_2024.png</span>
              </div>
              <img src="./download.png" alt="" className='download'/>             
            </div>
            <div className="photo-item">
              <div className="photo-detail">
                <img src="./morskie-oko-tatry.jpg" alt="" />
                <span>photo_2024.png</span>
              </div> 
              <img src="./download.png" alt="" className='download'/>            
            </div>
            
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <button onClick={handleBlock}>
          {isCurrentUserBlocked ? 'You are blocked!' : isReceiverBlocked ? 'User blocked' : 'Block user'}</button>
        <button className='logout' onClick={() => auth.signOut()}>Log Out</button>
      </div>
    </div>
  )
}

export default Detail;