import Category from "@/lib/models/Category";
import dbConnect from "../mongodb";

export async function getUserCategories(userId: string) {
  await dbConnect();
  return await Category.find({ userId });
}

export async function createCategory(data: any) {
  await dbConnect();
  return await Category.create(data);
}
