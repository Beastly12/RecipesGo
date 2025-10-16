
import React, { useState } from "react";
import "./profile.css"; 

export default function Profile() {
  const signup = () => alert("Account Created Successfully");


  return (
    <div className="profile-container">
       <div className="picture-block">
       <img 
    src="\profile.webp" 
    alt="Profile" 
    className="profile-picture" 
  />
        </div>

        <div className="details-container">
            <h1>USERNAME</h1>
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




    

   


  