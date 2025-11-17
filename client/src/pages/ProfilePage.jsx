import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

function ProfilePage() {
  const { authUser, updateProfile } = useContext(AuthContext);

  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState(authUser?.fullName || "");
  const [bio, setBio] = useState(authUser?.bio || "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    let base64Image = null;

    if (selectedImg) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedImg);
      base64Image = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
      });
    }

    await updateProfile({ fullName: name, bio, profilePic: base64Image });
  };

  return (
    <div className="border w-full h-screen bg-cover bg-no-repeat bg-center sm:px-[15%] sm:py-[5%]">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">
          <h3 className="text-lg">Profile Details</h3>

          <label htmlFor="avatar" className="flex items-center gap-5 cursor-pointer">
            <input
              onChange={(e) => setSelectedImg(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={
                selectedImg
                  ? URL.createObjectURL(selectedImg)
                  : authUser?.profilePic ||
                    "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?auto=format&fit=crop&w=76&q=80"
              }
              alt="avatar"
              className={`w-12 h-12 rounded-full`}
            />
            Upload profile image
          </label>

          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="Name"
            type="text"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="Bio"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            rows={4}
          ></textarea>

          <button
            type="submit"
            className="bg-linear-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer"
          >
            Save
          </button>
        </form>

        <img
          src="https://images.unsplash.com/photo-1644035525230-61eae56969da?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fHVuc3BsYXNoJTIwd2Vic2l0ZSUyMGNoYXQlMjBsb2dvfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600"
          alt="side-img"
          className="max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10"
        />
      </div>
    </div>
  );
}

export default ProfilePage;
