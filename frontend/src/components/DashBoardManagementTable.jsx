import React, { useState } from "react";
import { Search } from "lucide-react";

const recipesData = [
  {
    id: 1,
    name: "Creamy Mushroom Pasta",
    category: "Italian",
    meal: "Dinner",
    time: "30 mins",
    status: "Published",
    date: "2 days ago",
  },
  {
    id: 2,
    name: "Homemade Pizza Dough",
    category: "Italian",
    meal: "Dinner",
    time: "2 hours",
    status: "Private",
    date: "1 week ago",
  },
];

const DashBoardManagementTable = () => {
  const [searchRecipe, SetSearchRecipe] = useState("");
  const [recipe, setRecipe] = useState(recipesData);

  return (
    <section className=" bg-white rounded-3xl shadow mt-10">
      <div className=""></div>
    </section>
  );
};

export default DashBoardManagementTable;
