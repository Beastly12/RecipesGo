
import React, { useState } from "react";
import "./profile.css"; 

export default function Profile() {
  const [isFavorites, setIsFavorites] = useState(false);
  const edit = () => alert("Settings Edit");
  const recipes = [
    {id: 1, name: 'Homemade Margherita Pizza', picture: <img src="\profile.webp" alt="Cover" className="cover-picture" />, likes: '200'},
    {id: 2, name: 'Homemade Margherita', picture: <img src="\profile.webp" alt="Cover" className="cover-picture" />, likes: '201'},
    {id: 3, name: 'Homemade', picture: <img src="\profile.webp" alt="Cover" className="cover-picture" />, likes: '203'}
  ];


  return (
    <div className="full-container">
        <div className="profile-container">
           <div className="picture-block">
               <img 
                src="\profile.webp" 
                alt="Profile" 
                className="profile-picture" />
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
                        <button onClick={edit}>Settings</button>
                    </div>
            </div>
        </div>

        <div className="recipies">
        <div className="toggle">
          <input
            id="status"
            type="checkbox"
            checked={isFavorites}
            onChange={(e) => setIsFavorites(e.target.checked)}
          />
          <label htmlFor="status">
            <div
              className="status-switch"
              data-unchecked="My Recipes"
              data-checked="Favorites"
            ></div>
          </label>
        </div>

        {!isFavorites ? (
          <div>
                <ul>
                    {recipes.map((recipe) => <li key={recipe.id}> { recipe.name } ❤️{ recipe.likes }</li>)}
                </ul>
          </div>
        ) : (
          <div>
            <p>Favorites</p>
          </div>
        )}
        </div>
    </div>
  );
}




    

   


  