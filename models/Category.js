import mongoose, { model, Schema, models } from "mongoose";

const CategorySchema = new Schema({
  name: { type: String, required: true },
  parent: { type: String, },
  firstRecipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
});

const Category = models.Category || model('Category', CategorySchema);

export default Category;
