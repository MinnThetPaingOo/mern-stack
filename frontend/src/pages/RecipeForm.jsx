import { useEffect, useState } from "react";
import plus from "../assets/plus.svg";
import Ingredients from "../compoments/ingredients";
import axios from "../helpers/axios";
import { useNavigate, useParams } from "react-router-dom";

export default function RecipeForm() {
  let { id } = useParams();
  let navigate = useNavigate();
  let [title, setTitle] = useState("");
  let [file, setFile] = useState(null);
  let [preview, setPreview] = useState(null);
  let [description, setDescription] = useState("");
  let [ingredients, setIngredients] = useState([]);
  let [newIngredients, setNewIngredients] = useState("");
  let [errors, setErrors] = useState([]);

  useEffect(() => {
    let fetchRecipe = async () => {
      if (id) {
        let res = await axios.get("/api/recipes/" + id);
        console.log(res.data.recipes.photo);
        if (res.status == 200) {
          setPreview(import.meta.env.VITE_BACKEND_URL + res.data.recipes.photo);
          setTitle(res.data.recipes.title);
          setDescription(res.data.recipes.description);
          setIngredients(res.data.recipes.ingredients);
        }
      }
    };
    fetchRecipe();
  }, [id]);

  let addIngredients = () => {
    setIngredients((prev) => [newIngredients, ...prev]);
    setNewIngredients("");
  };
  let submit = async (e) => {
    try {
      e.preventDefault();
      let recipe = {
        title,
        description,
        ingredients,
      };
      let res;
      let resId;
      if (id) {
        res = await axios.patch("/api/recipes/" + id, recipe);
        resId = res.data.updatedRecipe._id;
      } else {
        res = await axios.post("/api/recipes", recipe);
        resId = res.data._id;
      }
      // file
      let formData = new FormData();
      formData.set("photo", file);

      //upload
      let uploadRes = await axios.post(
        `/api/recipes/${resId}/upload`,
        formData,
        {
          headers: {
            Accept: "multipart/form-data",
          },
        }
      );
      console.log(uploadRes);
      if (res.status === 200) {
        navigate("/");
      }
    } catch (e) {
      setErrors(Object.keys(e.response.data.errors));
    }
  };
  let upload = (e) => {
    let file = e.target.files[0];
    setFile(file);
    //preview
    let fileReader = new FileReader();

    fileReader.onload = (e) => {
      setPreview(e.target.result);
    };

    fileReader.readAsDataURL(file);
  };

  return (
    <div className="mx-auto max-w-md border-2 border-white p-4">
      <h1 className="mb-6 text-2xl font-bold text-orange-400 text-center">
        Recipe {id ? "Edit" : "Create"} Form
      </h1>
      <ul className="list-disc pl-3">
        {!!errors.length &&
          errors.map((error, i) => (
            <li className="text-red-500 text-sm" key={i}>
              {error} is invalid value
            </li>
          ))}
      </ul>
      <form action="" className="space-y-5" onSubmit={submit}>
        <input type="file" onChange={upload} />
        {preview && <img src={preview} alt="" />}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Recipe Title"
          className="w-full p-1"
        />
        <textarea
          placeholder="Recipe Description"
          rows="5"
          className="w-full p-1"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex space-x-2 items-center">
          <input
            value={newIngredients}
            type="text"
            placeholder="Recipe Ingredient"
            className="w-full p-1"
            onChange={(e) => {
              setNewIngredients(e.target.value);
            }}
          />

          <img
            src={plus}
            alt=""
            className="cursor-pointer"
            onClick={addIngredients}
          />
        </div>
        <div>
          <Ingredients ingredients={ingredients} />
        </div>
        <button
          type="submit"
          className="w-full px-3 py-1 rounded-full bg-orange-400 text-white"
        >
          {id ? "Edit" : "Create"} Recipe
        </button>
      </form>
    </div>
  );
}
