import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Post() {
    const [post, setPost] = useState();
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
          .post("/api/post", { post })
          .then((result) => {
              console.log("Success:", result);
              navigate('/success');
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      };

  return (
    <form className='create-post flex flex-col justify-between w-1/3 border ml-4 h-40' onSubmit={handleSubmit}>
        <textarea className='text-white text-black rounded p-2' placeholder='What on your mind' name="text" onChange={(e) => setPost(e.target.value)}></textarea>
        <button className='border mt-2 rounded text-xl py-2 bg-cyan-900 w-1/2 text-white' type="submit">Create New Post</button>
    </form>
  )
}

export default Post