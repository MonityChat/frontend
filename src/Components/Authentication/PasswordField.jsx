import React, {useState, useEffect, useRef} from 'react'

export default function PasswordField() {
    const [password, setPassword] = React.useState('');
    const [visibile, setVisibile] = React.useState(false);
    const passwordRef = useRef();
    useEffect(() => {
        console.log(visibile);
        if(visibile)
            passwordRef.current.value = password;
        else
            passwordRef.current.value = encryptString(password);
    }
    , [visibile]);

    const savePassword = (e) => {
        setPassword(prevVal => prevVal + e.nativeEvent.data);
        const invisiblePassword = encryptString(password); 
        e.target.value = invisiblePassword;
    }

    const toggleVisibility = () => {
        setVisibile(prevVal => !prevVal);
    }

    const encryptString = (s, what = '•') => s.replace(/./g, what); 

  return (
    <>
     <input type="text" onInput={savePassword} ref={passwordRef}/>
     <div onClick={toggleVisibility}>o</div>
    </>
  )
}

