import React from 'react';
import { useUserStore } from '../../../lib/userStore';
import './userinfo.css';

const UserInfo = () => {

  let { currentUser } = useUserStore();
  return (
    <div className='user-info'>
        <div className="user">
            <img src={currentUser.avatar || "./avatar.png"} alt="" />
            <h2>{currentUser.username}</h2>
        </div>
        <div className="icons">
           <img src="./more.png" alt="" />
           <img src="./video.png" alt="" />
           <img src="./edit.png" alt="" />
        </div>
        
    </div>
  )
}

export default UserInfo;