import UserModel from '@/model/User';
import dbConnect from '@/lib/dbConnect';
import { Message } from '@/model/User';

export async function POST(request: Request) {
  await dbConnect();
  
  try {
    const { username, content } = await request.json();
    const user = await UserModel.findOne({ username }).exec();

    if (!user) {
      return Response.json(
        { message: 'User not found', success: false },
        { status: 404 }
      );
    }

    // Check if the user is accepting messages
    if (!user.isAcceptingMessage) {
      return Response.json(
        { message: 'This user is not accepting messages at the moment', success: false },
        { status: 403 } // 403 Forbidden status
      );
    }

    const newMessage = { content, createdAt: new Date() };

    // Use findOneAndUpdate to ensure atomicity and check isAcceptingMessage again
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: user._id, isAcceptingMessage: true },
      { $push: { messages: newMessage } },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        { message: 'This user is not accepting messages at the moment', success: false },
        { status: 403 }
      );
    }

    return Response.json(
      { message: 'Message sent successfully', success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing message:', error);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}