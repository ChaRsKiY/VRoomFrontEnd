'use client'
import { useEffect, useState } from 'react';

interface MyProps {
   userName:string;
   onClose: () => void;
  }
const RadioButtonList  : React.FC<MyProps>=( {userName, onClose} ) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // Хранит выбранную опцию
  const[name,setName]=useState('');
  const [disabled,setDisabled]=useState(true);
   
  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
    if(selectedOption!=null)
        setDisabled(false);
 
    console.log(userName);
  };

  useEffect(() => {
    setName(userName);
    if(selectedOption!=null)
        setDisabled(false);
  }, [userName,selectedOption]); 
 
  const handleSubmit = () => {
    if (selectedOption) {
      
      alert("In a complaint about "+name+" you have chosen: "+ selectedOption);
      onClose();
    } else {
      alert(`Please select an option `);
    }
  };

  const options = [
    { value: 'Sexual Content', label: 'Sexual Content' },
    { value: 'Violent or disturbing scenes', label: 'Violent or disturbing scenes' },
    { value: 'Insults or intolerance', label: 'Insults or intolerance' },
    { value: 'Harassment or bullying', label: 'Harassment or bullying' },
    { value: 'Harmful or dangerous activities', label: 'Harmful or dangerous activities' },
    { value: 'False information', label: 'False information' },
    { value: 'Child abuse', label: 'Child abuse' },
    { value: 'Propaganda of terrorism', label: 'Propaganda of terrorism' },
    { value: 'Spam', label: 'Spam' },
  ];
  

  return (
    <div  className="frow  space-x-2 " style={{maxHeight:'400px', overflow:'auto',
        scrollBehavior:'auto'}}>
        <div className="flex  sp-btw p-2"><div>
     <h3 style={{textAlign:'center', fontSize:"23px", fontWeight:'bold'}}>Complain</h3>
     <h3 style={{ fontSize:"23px", fontWeight:'bold'}}>Select the reason for the complaint</h3>
     </div>
     <div className="frow  space-x-2 ">
<button onClick={onClose} style={{fontWeight:'bold', color:'gray',justifyContent:'flex-start',paddingRight:'5px'}}>X</button>
     </div></div>
     <p style={{ fontSize:"14px",padding:'5px'}}>
     It's okay if you specify the reason incorrectly. We will review content to ensure it adheres to all community guidelines.
     </p>
      {options.map((option, index) => (
        <div key={index} style={{paddingLeft:'5px',paddingRight:'5px'}} className="cursor-pointer p-2 hover:bg-gray-200" >
          <label  style={{padding:'3px',fontSize:"18px"}}>
            <input
              type="radio"
              value={option.value}
              checked={selectedOption === option.value}
              onChange={handleOptionChange}
              style={{paddingTop:'5px', transform: 'scale(1.5)', accentColor: 'black' }}
            />
            &nbsp; &nbsp;{option.label}
          </label>
        </div>
      ))}
      {/* Кнопка для проверки, какая радиокнопка выбрана */}
      <button onClick={handleSubmit} style={{width:'96%', borderRadius:"20px", backgroundColor: disabled?'gray':'black',
    fontSize:"20px", fontWeight:'bold', color: 'white' }}  disabled={disabled} >Complain</button>
    </div>
  );
};

export default RadioButtonList;
