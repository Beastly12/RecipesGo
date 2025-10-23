
import React, { useState } from "react";
import "./profile.css"; 



export default function Profile() {
  const [isFavorites, setIsFavorites] = useState(false);
  const edit = () => alert("Settings Edit");
  const recipes = [
    {id: 1, name: 'Homemade Margherita Pizza', picture: <img src="\MPizza1.webp" alt="Cover" className="cover-picture" />, likes: '200', link:"/login"},
    {id: 2, name: 'Homemade Margherita', picture: <img src="\Margherita-Pizza.webp" alt="Cover" className="cover-picture" />, likes: '201', link:"/"},
    {id: 3, name: 'Homemade', picture: <img src="\PIZZA-MARGHERITA.jpg" alt="Cover" className="cover-picture" />, likes: '202', link:"/login"},
    {id: 4, name: 'Homemade Margherita Pizza', picture: <img src="\MPizza1.webp" alt="Cover" className="cover-picture" />, likes: '203', link:"/"},
    {id: 5, name: 'Homemade Margherita', picture: <img src="\Margherita-Pizza.webp" alt="Cover" className="cover-picture" />, likes: '204', link:"/login"},
    {id: 6, name: 'Homemade', picture: <img src="\PIZZA-MARGHERITA.jpg" alt="Cover" className="cover-picture" />, likes: '205', link:"/login"}
  ];

  const favs = [
    {id: 1, name: 'Homemade Margherita Pizza', picture: <img src="\Margherita-Pizza.webp" alt="Cover" className="cover-picture" />, likes: '206', link:"/"},
    {id: 2, name: 'Homemade Margherita', picture: <img src="\PIZZA-MARGHERITA.jpg" alt="Cover" className="cover-picture" />, likes: '207', link:"/login"},
    {id: 3, name: 'Homemade', picture: <img src="\MPizza1.webp" alt="Cover" className="cover-picture" />, likes: '208', link:"/"},
    {id: 4, name: 'Homemade Margherita Pizza', picture: <img src="\Margherita-Pizza.webp" alt="Cover" className="cover-picture" />, likes: '209', link:"/login"},
    {id: 5, name: 'Homemade Margherita', picture: <img src="\PIZZA-MARGHERITA.jpg" alt="Cover" className="cover-picture" />, likes: '210, link:"/"'},
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
                        <button onClick={edit}>⚙️Settings</button>
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
          <div className="recipe-list">
                <ul className="grid">
                    {recipes.map((recipe) => <li key={recipe.id}> 
                      <div className="content">
                      <a href={recipe.link} className="link">
                        {recipe.picture} 

                        <div className="info">
                            { recipe.name } ❤️{ recipe.likes }
                        </div>
                      </a>
                      </div>
                    
                    </li>)}
                </ul>
          </div>
        ) : (
          <div className="recipe-list">
                <ul className="grid">
                    {favs.map((fav) => <li key={fav.id}> 
                      <div className="content">
                      <a href={fav.link} className="link">
                        {fav.picture} 

                        <div className="info">
                            { fav.name } ❤️{ fav.likes }
                        </div>
                      </a>
                      </div>
                    
                    </li>)}
                </ul>
          </div>
        )}
        </div>
    </div>
  );
}




    

   


  