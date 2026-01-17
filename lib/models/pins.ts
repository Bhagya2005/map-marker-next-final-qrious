import mongoose from "mongoose";

const PinSchema = new mongoose.Schema({
  name: String,
  description: String,
  lat: Number,
  lng: Number,
  color: String,
  category: String,
  userId: String,
});

export default mongoose.models.Pin || mongoose.model("Pin", PinSchema);
