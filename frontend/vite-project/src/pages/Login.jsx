import React, { useEffect, useState } from "react";
import axios from "axios";

function Login() {
  const [name, setName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/newLogin", { name, password })
      .then((result) => {
        console.log("Success:", result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };


  return (
    <>
    <div className="border-zinc-300 bg-zinc-800 w-1/3 relative top-28 left-1/3 px-10 py-10 rounded">
        <h1 className="text-gray-100 text-3xl font-sans text-center">
          User Login
        </h1>
        <div className="my-2">
          <form
            className="flex flex-col justify-around h-56"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Enter name"
              autoComplete="off"
              className="px-2 py-2 rounded"
              name="name"
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Enter password"
              className="px-2 py-2 rounded"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="text-gray-100 bg-green-700 rounded py-1 text-lg"
            >
              Login 
            </button>
          </form>
        </div>
        </div>
    </>
  );
}

export default Login