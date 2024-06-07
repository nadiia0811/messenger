import React from 'react';
import UserInfo from './userinfo/UserInfo';
import ChatList from './chatList/ChatList';
import './list.css';

const List = () => {
  return (
    <div className='list'>
        <UserInfo/>
        <ChatList/>
    </div>
  )
}

export default List;