import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logout from './Logout';
import Post from "./Post"

function Success() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  // Using useEffect to make an API request
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/profile');
        setName(response.data.name); // Assuming response contains a 'name' field
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    };

    fetchData();

    // const logoutTimer = setTimeout(() => {
    //   console.log('Logging out...');
    //   navigate('/login');
    // }, 2000); 

    // return () => clearTimeout(logoutTimer); 
  }, [navigate]); 

  return (
    <>
    <div className='logout'>
        <Logout/>
    </div>
    <div className='text'>
      <h1 className='text-white text-4xl m-4'>Hello, {name}</h1>
      <p className='text-white m-4'>You can create a new post</p>
    </div>
    <Post/>
    </>
  );
}

export default Success;
