import { CSSProperties } from 'react';

export const buttonCancelStyles: { [key: string]: CSSProperties } = {
  base: {
    backgroundColor: 'white',
    border: 'none',
    color: 'black',
    padding: '2px 20px',
    margin: '5px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  baseplus: {
    backgroundColor: 'white',
    border: '2px solid #00b4ff',
    color: 'black',
    padding: '2px 20px',
    margin: '5px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '',
    transition: 'background-color 0.3s ease',
  }
  ,
  hover: {
    backgroundColor: 'lightgray',
  },
};