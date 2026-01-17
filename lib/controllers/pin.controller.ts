import Pin from "@/lib/models/pins";
import dbConnect from "../mongodb";

export async function getUserPins(userId: string) {
  await dbConnect();
  return await Pin.find({ userId });
}

export async function createPin(data: any) {
  await dbConnect();
  return await Pin.create(data);
}
