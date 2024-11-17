import { CSSProperties } from 'react';

export const buttonMyScroll: { [key: string]: CSSProperties } = {
    base: {
        padding: '10px',
        cursor: 'pointer',
        backgroundColor: 'lightgray',
        borderRadius: '50%',
        transition: 'opacity 0.3s ease, background-color 0.3s ease',
        opacity: 0.5,
    },

    hover: {
        opacity: 1,
        backgroundColor: '#d3d3d3',
    }
 

};