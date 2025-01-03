import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Logout() {
    const navigate = useNavigate();

    const logout = async (e) => {
        e.preventDefault();
        let response = await axios.get('/api/logOut');
        console.log(response)
        navigate('/login');
    }

  return (
    <>
    <div className='text-white bg-rose-700 w-20 p-2 rounded border text-xl'>
    <button type="button" onClick={logout}>Logout</button>
    </div>
    </>
  )
}

export default Logout