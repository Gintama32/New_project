'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import { useCompletion } from 'ai/react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';
import { toast } from '@/hooks/use-toast';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const router = useRouter(); // Initialize useRouter
  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: '/api/suggest-messages',
    initialCompletion: initialMessageString,
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: 'default',
      });
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    try {
      complete('');
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Handle error appropriately
    }
  };
  const handleCreateAccount = () => {
    router.push('/sign-up'); // Redirect to sign-up page
  };

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded-lg shadow-md max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 bg-gray-50 p-6 rounded-lg shadow-sm"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold text-gray-700">
                  Send Anonymous Message to @{username}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center mt-4">
            {isLoading ? (
              <Button disabled className="bg-indigo-500 hover:bg-indigo-600">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading || !messageContent}
                className="bg-indigo-500 hover:bg-indigo-600"
              >
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestedMessages}
            className="my-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
            disabled={isSuggestLoading}
          >
            Suggest Messages
          </Button>
          <p className="text-gray-700">Click on any message below to select it.</p>
        </div>
        <Card className="shadow-lg">
          <CardHeader className="bg-gray-100 p-4 rounded-t-lg">
            <h3 className="text-xl font-semibold text-gray-800">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4 p-4">
            {error ? (
              <p className="text-red-500">{error.message}</p>
            ) : (
              parseStringMessages(completion).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="border-gray-300 hover:border-indigo-500 text-gray-700 hover:text-indigo-500 mb-2 rounded-lg"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4 text-lg font-semibold text-gray-800">
          Get Your Message Board
        </div>
        <Link href={'/sign-up'}>
          <Button
            onClick={handleCreateAccount}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Create Your Account
          </Button>
        </Link>
      </div>
    </div>
  );
}
