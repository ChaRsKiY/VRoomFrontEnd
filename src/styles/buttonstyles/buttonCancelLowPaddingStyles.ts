import {CSSProperties} from 'react';

export const buttonCancelLowPaddingStyles: { [key: string]: CSSProperties } = {
    base: {
        backgroundColor: 'white',
        border: 'none',
        color: 'black',
        padding: '2px 10px',
        margin: '0.5px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease',
    },
    baseplus: {
        backgroundColor: 'lightgraygray',
        border: 'none',
        color: 'black',
        padding: '2px 10px',
        margin: '2px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '',
        transition: 'background-color 0.3s ease',
    }
    ,
    hover: {
        backgroundColor: 'lightgray',
    },
};