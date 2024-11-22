import {CSSProperties} from 'react';

export const buttonSubmitStyles: { [key: string]: CSSProperties } = {
    base: {
        backgroundColor: 'RoyalBlue',
        border: 'none',
        color: 'white',
        padding: '2px 20px',
        margin: '5px',
        borderRadius: '50px',
        fontSize: '16px',
        fontWeight: 'bold',
    },
    disab: {
        backgroundColor: 'lightgray',
        border: 'none',
        color: 'white',
        padding: '2px 20px',
        margin: '5px',
        borderRadius: '50px',
        fontSize: '16px',
        fontWeight: 'bold',
    },

    baselowpadding: {
        backgroundColor: 'RoyalBlue',
        border: 'none',
        color: 'white',
        padding: '2px 10px',
        margin: '2px',
        borderRadius: '5px',
        fontSize: '14px',
        fontWeight: 'bold',
    },
    disablowpadding: {
        backgroundColor: 'lightgray',
        border: 'none',
        color: 'black',
        padding: '2px 10px',
        margin: '2px',
        borderRadius: '5px',
        fontSize: '14px',
        fontWeight: 'bold',
    },
};
