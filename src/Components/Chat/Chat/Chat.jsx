import React, { useEffect } from 'react'
import ChatInput from './ChatInput';
import MessageScreen from './MessageScreen';
import { SESSION_AUTH} from '../../../Util/Auth.js';
import { initSocket } from '../../Authentication/test.js'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import './Css/Chat.css';


export default function Chat() {

  const history = useHistory()

  useEffect(() => {
    SESSION_AUTH.key = sessionStorage.getItem('SESSION_AUTH');
    SESSION_AUTH.isLogedIn = sessionStorage.getItem('LOGGED_IN');
    
    if(!SESSION_AUTH.isLogedIn){
      console.log("is not loged in");
      history.push('/authentication');	
      return;
    }else{
      console.log("is loged in");
    }

    initSocket();
  }, [])

  return (
    <div className='chat'>
      <MessageScreen />
      <ChatInput />
    </div>
  )
}
