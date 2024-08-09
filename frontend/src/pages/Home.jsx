import { useEffect, useState } from "react";
import RecipeCard from "../compoments/RecipeCard";
import Pagination from "../compoments/Pagination";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../helpers/axios";

export default function Home() {
  let navigate = useNavigate();
  let [links, setLinks] = useState(null);
  const [recipes, setRecipes] = useState([]);
  let location = useLocation();
  let searchQuery = new URLSearchParams(location.search);
  let page = searchQuery.get("page");
  page = parseInt(page) ? parseInt(page) : 1;

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios("/api/recipes?page=" + page);
        console.log(response);
        if (response.status == 200) {
          const data = response.data;
          console.log(data);
          setLinks(data.links);
          setRecipes(data.data);
          window.scroll({ top: 0, left: 0, behavior: "smooth" });
        } else {
          console.error("Failed to fetch recipes");
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, [page]);
  let onDeleted = (_id) => {
    if (recipes.length === 1 && page > 1) {
      navigate("/?page=" + (page - 1));
    } else {
      setRecipes((pre) => pre.filter((r) => r._id !== _id));
    }
  };
  return (
    <>
      <div className="grid grid-cols-3 grid-rows-1 space-x-2 space-y-3">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <RecipeCard
              recipe={recipe}
              key={recipe._id}
              onDeleted={onDeleted}
            />
          ))
        ) : (
          <p>No recipes found</p>
        )}
      </div>
      {!!links && <Pagination links={links} page={page || 1} />}
    </>
  );
}
