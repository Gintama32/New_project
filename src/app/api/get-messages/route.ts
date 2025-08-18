import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import mongoose from 'mongoose';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const _user: User = session?.user;

  if (!session || !_user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }
  const userId = new mongoose.Types.ObjectId(_user._id);
  try {
    // First find the user to check if they exist
    const userExists = await UserModel.findById(userId);
    if (!userExists) {
      return Response.json(
        { message: 'User not found', success: false },
        { status: 404 }
      );
    }

    // If user has no messages, return empty array
    if (!userExists.messages || userExists.messages.length === 0) {
      return Response.json(
        { messages: [], success: true },
        { status: 200 }
      );
    }

    // If user has messages, use aggregation to sort them
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: '$messages' },
      { $sort: { 'messages.createdAt': -1 } },
      { $group: { _id: '$_id', messages: { $push: '$messages' } } },
    ]).exec();

    return Response.json(
      { messages: user[0].messages, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}