
import React, { useState } from "react";
import "./profile.css"; 

export default function Profile() {
    const log = () => alert("Logged In Successful");
  const signup = () => alert("Account Created Successfully");


  return (
    <div className="profile-container">
       <div className="picture-block">
            <h1>Username</h1>
        </div>

        <div className="details-container">
            <h2>USERNAME</h2>
            <p>BIO</p>

            
                <div className="stats">
                    <div className="recipes">
                        <h2>10</h2>
                        <h5>Recipes</h5>
                    </div>
                    <div className="likes">
                        <h2>12K</h2>
                        <h5>Likes</h5>
                    </div>

                </div>

                <div className="settings">
                    <button onClick={signup}>Edit Profile</button>
                    <button onClick={signup}>Settings</button>

                </div>


        </div>
          

         
    </div>

      
  );
}




    

   


  