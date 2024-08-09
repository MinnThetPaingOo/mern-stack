const Recipe = require("../models/recipe");
const mongoose = require('mongoose')
const removeFile = require('../helpers/removeFile');


const RecipeController = {
    index: async (req, res) => {
        let limit = 3;
        let page = req.query.page || 1;
        const recipes = await Recipe
            .find()
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 })
        let totalrecipe = await Recipe.countDocuments();
        let totalpage = Math.ceil(totalrecipe / limit)
        // console.log(totalpage)
        let links = {
            nextPage: totalpage == page ? false : true,
            prevPage: page == 1 ? false : true,
            currentPage: page,
            loppableLinks: []
        }
        for (let index = 0; index < totalpage; index++) {
            let number = index + 1;
            links.loppableLinks.push({ number })

        }
        return res.json({
            links,
            data: recipes
        })
    },
    show: async (req, res) => {
        try {
            const id = req.params.id
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ "msg": "not a valid id" })
            }
            const recipes = await Recipe.findById(id)
            if (!recipes) {
                return res.status(404).json({ "msg": "recipe not found" })
            }
            return res.json({ recipes })

        } catch (e) {
            return res.status(500).json({ "msg": "internet server error" })
        }
    },
    store: async (req, res) => {
        try {
            const { title, description, ingredients } = req.body;
            const recipe = await Recipe.create({
                title,
                description,
                ingredients
            })
            return res.json(recipe)
        } catch (e) {
            return res.json({ "msg": "ivalid filed" })
        }
    },
    destroy: async (req, res) => {
        try {
            const id = req.params.id
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ "msg": "not a valid id" })
            }
            const recipes = await Recipe.findByIdAndDelete(id)
            await removeFile(__dirname + "/../public" + recipes.photo);
            if (!recipes) {
                return res.status(404).json({ "msg": "recipe not found" })
            }
            return res.json({ recipes })

        } catch (e) {
            return res.status(500).json({ "msg": "internet server error" })
        }
    },
    update: async (req, res) => {
        try {
            const id = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ "msg": "not a valid id" });
            }
            const updatedRecipe = await Recipe.findByIdAndUpdate(id, req.body, { new: true });
            await removeFile(__dirname + "/../public" + updatedRecipe.photo);
            if (!updatedRecipe) {
                console.log("Recipe not found:", id);
                return res.status(404).json({ "msg": "recipe not found" });
            }
            return res.json({ updatedRecipe });
        } catch (e) {
            console.error("Error updating recipe:", e);
            return res.status(500).json({ "msg": "internal server error" });
        }
    },
    upload: async (req, res) => {
        try {
            let id = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ msg: 'not a valid id' });
            }
            let recipe = await Recipe.findByIdAndUpdate(id, {
                photo: '/' + req.file.filename
            });
            if (!recipe) {
                return res.status(404).json({ msg: 'recipe not found' });
            }
            return res.json(recipe);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ msg: 'internet server error' });
        }
    }

}

module.exports = RecipeController;