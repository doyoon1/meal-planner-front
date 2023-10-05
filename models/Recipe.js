import mongoose, { model, Schema, models } from "mongoose";
import Category from "./Category";

const recipeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  ingredients: [{ type: Object, required: true }],
  procedure: [{ type: String }],
  videoLink: { type: String },
  nutriValue: [{ type: Object, required: true }],
}, {
  timestamps: true,
});

export const Recipe = models.Recipe || model('Recipe', recipeSchema);
