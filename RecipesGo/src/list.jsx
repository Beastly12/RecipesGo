import React from "react";


const RecipesList=({recipes})=>{
    return(
        <>
            <div className="px-10 pb-10 columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
                {recipes.map((recipe)=>
                    <div key={recipe.key} className="mb-6 bg-white rounded-2xl overflow-hidden break-inside-avoid shadow hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer">
                        <img
                            src={recipe.img}
                            alt={recipe.title}
                            className="w-full aspect-[4/3] object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <div className="p-4">
                            <div className="text-lg font-semibold mb-2">
                            {recipe.title}
                            </div>
                            <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-300 to-red-400"></div>
                                <span className="text-sm text-gray-600 font-medium">
                                {recipe.author}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                <span className="text-[#ff6b6b]">♥</span>
                                <span>{recipe.likes}</span>
                            </div>
                            </div>
                        </div>
                    </div>
                )}

               
         </div>
        
        </>
    )
}

export default RecipesList