import { create } from 'zustand';
import { doc, getDoc } from "firebase/firestore";
import { db } from './firebase';
import { useUserStore } from './userStore';


export const useChatStore = create((set) => ({ //initial state     
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,

  changeChat: (chatId, user) => {
    const currentUser = useUserStore.getState().currentUser;  
     
     if(user.blocked.includes(currentUser.id)) {  
       return set({
        chatId,
        user: null,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
       })
     }

     //check if receiver is blocked
     else if(currentUser.blocked.includes(user.id)) {
        return set({
         chatId,
         user,
         isCurrentUserBlocked: false,
         isReceiverBlocked: true,
        })
      } else {
        return set({
          chatId, 
          user,
          isCurrentUserBlocked: false,
          isReceiverBlocked: false,
        })
      }
  },

  changeBlocked: () => {
    set(state => ({...state, isReceiverBlocked: !state.isReceiverBlocked}))
  }
  
}));