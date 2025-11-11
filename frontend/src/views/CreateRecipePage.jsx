import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createRecipeService } from '../services/RecipesService.mjs';
import { getUploadUrl } from '../services/ImageUploadService.mjs';
import axios from 'axios';
import { Spin, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const CreateRecipePage = () => {
  const navigate = useNavigate();

  const [recipeImage, setRecipeImage] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [category, setCategory] = useState('Breakfast');
  const [ingredients, setIngredients] = useState(['']);
  const [steps, setSteps] = useState(['']);
  const [privacy, setPrivacy] = useState(true);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setRecipeImage(file);
  };

  const updateIngredient = (i, value) => {
    const newIngredients = [...ingredients];
    newIngredients[i] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => setIngredients([...ingredients, '']);

  const removeIngredient = (i) => {
    if (ingredients.length > 1) setIngredients(ingredients.filter((_, index) => index !== i));
  };

  const updateStep = (i, value) => {
    const newSteps = [...steps];
    newSteps[i] = value;
    setSteps(newSteps);
  };

  const addStep = () => setSteps([...steps, '']);

  const removeStep = (i) => {
    if (steps.length > 1) setSteps(steps.filter((_, index) => index !== i));
  };

  const validateRecipe = () => {
    if (!recipeImage) return 'Please upload a recipe image.';
    if (!title.trim()) return 'Recipe title is required.';
    if (!description.trim()) return 'Description is required.';

    if (!cookTime.trim() || isNaN(cookTime) || Number(cookTime) <= 0) {
      return 'Please enter a valid cook time (greater than 0).';
    }

    const invalidIngredients = ingredients.filter((ing) => !ing.trim());
    if (invalidIngredients.length > 0) return 'All ingredients must be filled out.';
    if (ingredients.length === 0) return 'Add at least one ingredient.';

    const invalidSteps = steps.filter((step) => !step.trim());
    if (invalidSteps.length > 0) return 'All steps must be filled out.';
    if (steps.length === 0) return 'Add at least one step.';

    return null;
  };

  const handlePublish = async () => {
    const error = validateRecipe();
    if (error) {
      message.error(error);
      return;
    }

    if (!recipeImage) {
      message.error('Please upload a recipe image.');
      return;
    }

    const hideLoading = message.loading('Publishing your recipe...', 0);

    try {
      setLoading(true);

      const ext = recipeImage.type.split('/')[1];

      const uploadres = await getUploadUrl(ext);

      await axios.put(uploadres.message.uploadUrl, recipeImage, {
        headers: {
          'Content-Type': recipeImage.type,
        },
      });

      const recipeData = {
        name: title,
        description,
        preparationTime: parseInt(cookTime, 10),
        difficulty,
        category,
        ingredients,
        instructions: steps,
        isPublic: privacy,
        imageUrl: uploadres.message.imageKey,
      };

      const createdRecipe = await createRecipeService(recipeData);
      hideLoading();
      message.success('Recipe published successfully!');
      navigate(`/recipe/${createdRecipe.id}`, { state: createdRecipe });
    } catch (e) {
      hideLoading();
      message.error('Failed to publish recipe. Please try again.');
      console.error('Upload error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fafafa] text-[#1a1a1a] min-h-screen dark:bg-[#0a0a0a] dark:text-[#e5e5e5] font-sans">
      <nav className="bg-white px-10 py-4 shadow-sm dark:bg-[#0a0a0a] dark:text-[#e5e5e5] sticky top-0 z-50 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold dark:text-[#e5e5e5]">
          ← Cancel
        </Link>

        <button
          onClick={handlePublish}
          disabled={loading}
          className="bg-[#ff6b6b] text-white hover:bg-[#ff5252] hover:shadow-[#ff5252] dark:bg-[#ff5252] dark:hover:bg-[#ff6b6b] px-6 py-3 rounded-xl font-semibold transition transform hover:-translate-y-0.5 shadow hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
        >
          {loading && <Spin indicator={<LoadingOutlined spin />} size="small" />}
          {loading ? 'Publishing...' : 'Publish Recipe'}
        </button>
      </nav>

      <div className="lg:max-w-[900px] py-10 lg:mx-auto px-5 lg:px-10">
        <h1 className="text-4xl my-10 font-bold dark:text-white">Create New Recipe</h1>

        {/* Image Upload */}
        <div className="bg-white rounded-2xl p-8 mb-6 shadow dark:bg-[#1a1a1a] dark:shadow-lg dark:shadow-black/50">
          <div className="text-[20px] font-bold mb-5 text-[#1a1a1a] dark:text-white">
            Recipe Image
          </div>
          <label className="border-dashed border-[#dee2e6] border-2 rounded-2xl py-[60px] px-5 text-center cursor-pointer transition-all bg-[#f8f9fa] hover:border-[#ff6b6b] hover:bg-[#fff5f5] dark:border-gray-600 dark:bg-[#0a0a0a] dark:hover:border-[#ff5252] dark:hover:bg-[#2a0a0a] block">
            {recipeImage ? (
              <img
                src={URL.createObjectURL(recipeImage)}
                className="mx-auto rounded-xl w-48"
                alt="Recipe Preview"
              />
            ) : (
              <>
                <div className="text-5xl mb-3.5">📸</div>
                <div className="text-[16px] font-medium text-[#495057] dark:text-gray-300">
                  Click to upload recipe photo
                </div>
                <div className="text-sm mt-2 text-[#868e96] dark:text-gray-500">
                  JPG, PNG or WEBP (max 5MB)
                </div>
              </>
            )}
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-8 mb-6 shadow dark:bg-[#1a1a1a] dark:shadow-lg dark:shadow-black/50">
          <div className="text-[20px] font-bold mb-5 text-[#1a1a1a] dark:text-white">
            Basic Information
          </div>

          <div className="mb-6">
            <label className="dark:text-gray-200">Recipe Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter recipe name..."
              className="w-full p-2 border rounded-md dark:bg-[#0a0a0a] dark:text-white dark:border-gray-600 dark:placeholder-gray-500"
            />
          </div>

          <div className="mb-6">
            <label className="dark:text-gray-200">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about your recipe..."
              className="w-full p-2 border rounded-md dark:bg-[#0a0a0a] dark:text-white dark:border-gray-600 dark:placeholder-gray-500"
            ></textarea>
          </div>

          <div className="grid gap-4 grid-cols-3">
            <div className="mb-6">
              <label className="dark:text-gray-200">Cook Time (minutes)</label>
              <input
                type="number"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
                placeholder="30"
                className="w-full p-2 border rounded-md dark:bg-[#0a0a0a] dark:text-white dark:border-gray-600 dark:placeholder-gray-500"
              />
            </div>
          </div>

          <div className="grid gap-4 grid-cols-3">
            <div className="mb-6">
              <label className="dark:text-gray-200">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-2 border rounded-md dark:bg-[#0a0a0a] dark:text-white dark:border-gray-600"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="dark:text-gray-200">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border rounded-md dark:bg-[#0a0a0a] dark:text-white dark:border-gray-600"
              >
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
                <option>Dessert</option>
                <option>Snack</option>
                <option>Vegan</option>
                <option>Quick & Easy</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="bg-white rounded-2xl p-8 mb-6 shadow dark:bg-[#1a1a1a] dark:shadow-lg dark:shadow-black/50">
          <div className="text-[20px] font-bold mb-5 text-[#1a1a1a] dark:text-white">
            Ingredients
          </div>

          {ingredients.map((ing, i) => (
            <div key={i} className="flex gap-3 items-start mb-2">
              <input
                className="flex-1 p-2 border rounded-md dark:bg-[#0a0a0a] dark:text-white dark:border-gray-600"
                value={ing}
                type="text"
                onChange={(e) => updateIngredient(i, e.target.value)}
                placeholder="e.g., 2 cups of flour"
              />
              <button
                onClick={() => removeIngredient(i)}
                className="py-3 px-4 bg-[#f8f9fa] rounded-lg cursor-pointer dark:bg-gray-700 dark:text-white"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            onClick={addIngredient}
            className="border-dashed mt-2 border-[#dee2e6] text-sm font-semibold text-[#495057] px-2 py-1 border-2 rounded-md bg-[#f8f9fa] dark:border-gray-600 dark:text-gray-300 dark:bg-gray-700"
          >
            + Add Ingredient
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-2xl p-8 mb-6 shadow dark:bg-[#1a1a1a] dark:shadow-lg dark:shadow-black/50">
          <div className="text-[20px] font-bold mb-5 text-[#1a1a1a] dark:text-white">
            Instructions
          </div>

          {steps.map((step, i) => (
            <div key={i} className="flex gap-3 items-start mb-2">
              <div className="bg-[#ff6b6b] rounded-full px-3 py-1 text-white font-semibold dark:bg-[#ff5252]">
                {i + 1}
              </div>
              <textarea
                value={step}
                onChange={(e) => updateStep(i, e.target.value)}
                placeholder="Describe the step"
                className="flex-1 p-2 border rounded-md dark:bg-[#0a0a0a] dark:text-white dark:border-gray-600"
              ></textarea>
              <button
                onClick={() => removeStep(i)}
                className="py-[50px] px-4 bg-[#f8f9fa] rounded-lg cursor-pointer dark:bg-gray-700 dark:text-white"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            onClick={addStep}
            className="border-dashed mt-2 border-[#dee2e6] text-sm font-semibold text-[#495057] px-2 py-1 border-2 rounded-md bg-[#f8f9fa] dark:border-gray-600 dark:text-gray-300 dark:bg-gray-700"
          >
            + Add Step
          </button>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-2xl p-8 mb-6 shadow dark:bg-[#1a1a1a] dark:shadow-lg dark:shadow-black/50">
          <div className="text-[20px] font-bold mb-5 text-[#1a1a1a] dark:text-white">
            Privacy Settings
          </div>
          <div className="flex gap-3">
            <div
              onClick={() => setPrivacy(true)}
              className={`flex-1 border-[#dee2e6] border-2 rounded-2xl py-10 px-5 text-center cursor-pointer transition-all bg-[#f8f9fa] dark:border-gray-600 dark:bg-[#0a0a0a] ${
                privacy === true
                  ? 'border-[#ff6b6b] bg-[#fff5f5] dark:border-[#ff5252] dark:bg-[#2a0a0a]'
                  : ''
              }`}
            >
              <div className="text-5xl mb-3.5">🌍</div>
              <div className="text-[16px] font-medium text-[#495057] dark:text-gray-300">
                Public
              </div>
              <div className="text-sm mt-2 text-[#868e96] dark:text-gray-500">
                Anyone can view this recipe
              </div>
            </div>

            <div
              onClick={() => setPrivacy(false)}
              className={`flex-1 border-[#dee2e6] border-2 rounded-2xl py-10 px-5 text-center cursor-pointer transition-all bg-[#f8f9fa] dark:border-gray-600 dark:bg-[#0a0a0a] ${
                privacy === false
                  ? 'border-[#ff6b6b] bg-[#fff5f5] dark:border-[#ff5252] dark:bg-[#2a0a0a]'
                  : ''
              }`}
            >
              <div className="text-5xl mb-3.5">🔒</div>
              <div className="text-[16px] font-medium text-[#495057] dark:text-gray-300">
                Private
              </div>
              <div className="text-sm mt-2 text-[#868e96] dark:text-gray-500">
                Only you can view this recipe
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRecipePage;
