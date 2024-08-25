import React from 'react'
import {RxHamburgerMenu} from "react-icons/rx";

const BurgerMenu: React.FC = () => {
    return (
        <div className="hidden max-lg:block self-center">
            <RxHamburgerMenu size={27} />
        </div>
    )
}

export default BurgerMenu