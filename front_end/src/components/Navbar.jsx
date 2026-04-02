import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { NavLink } from 'react-router-dom';

function Navbar({ handleVisible }) {
    return (
        <nav className="absolute top-0 left-0 z-10 w-screen border-b border-black bg-white grid grid-cols-3 items-center py-2">
            <NavLink to='/' className="ml-[3vw] text-black no-underline">
                <HomeRoundedIcon className="w-[5.5vw] max-w-[50px]" />
            </NavLink>

            <span className="justify-self-center text-xl">Gachle</span>

            <ul className="justify-self-end grid grid-cols-4 text-center list-none">
                <NavLink to='/leaderboard' className="text-black no-underline">
                    <li className="w-[5.5vw] max-w-[50px]"><BarChartRoundedIcon /></li>
                </NavLink>
                <NavLink className="text-black no-underline">
                    <li className="w-[5.5vw] max-w-[50px]"><LightModeRoundedIcon /></li>
                </NavLink>
                <li className="w-[5.5vw] max-w-[50px]">
                    <button className="p-0 border-none bg-transparent cursor-pointer" onClick={handleVisible}>
                        <SettingsRoundedIcon />
                    </button>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar;