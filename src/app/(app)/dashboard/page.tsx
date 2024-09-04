'use client'
import React, { useCallback, useEffect } from 'react';

import { Message } from "@/model/User"
import { useState } from "react"
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';


const Page = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading,setIsLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)

    const {toast} = useToast();
    const handleDeleteMessage = (messageId:string)=>{
        setMessages(messages.filter((message)=>message._id!==
    messageId))
    }
    const {data:session} = useSession()

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema)
    })
    const {register, watch, setValue} = form
    const acceptMessages = watch('acceptMessages')
    const fetchAcceptMessage = useCallback(async()=>{
        setIsSwitchLoading(true)
        try{
            const response = await axios.get<ApiResponse>('/api/accept-messages')
            setValue('acceptMessages', response.data.isAcceptingMessages)
        }catch(error){
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message ||
                "Failed to fetch message settigns",
                variant: "destructive"
            })
        }finally{
            setIsSwitchLoading(false)
        }
    }, [setValue])
    const fetchMessages = useCallback(async(refresh: boolean = false)=>{
        setIsLoading(true)
        setIsSwitchLoading(false)
        try{
            await axios.get<ApiResponse>('/api/get-messages')
            setMessages(response.data.messages || [])
            if (refresh){
                toast({
                    title: "Refreshed Messages",
                    description: "Showing latest messages",
                })
            }
        } catch(error){
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message ||
                "Failed to fetch message settigns",
                variant: "destructive"
            })
        }finally{
            setIsLoading(false)
            setIsSwitchLoading(false)
        }
    },[setIsLoading, setMessages])
    useEffect(()=>{
        if (!session || !session.user) return
        fetchMessages()
        fetchAcceptMessage()
    },[session,setValue,fetchAcceptMessage, 
        fetchMessages
    ])
    //handle switch change
    const handleSwitchChange = async()=>{
        try {
            await axios.post<ApiResponse>('/api/accept-messages',{
                acceptMessages: !acceptMessages
            })
            setValue('acceptMessages', !acceptMessages)
            toast({
                title: response.data.message,
                variant:'default'
            })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message ||
                "Failed to fetch message settigns",
                variant: "destructive"
            })
        }
    }
    if (!session || !session.user){
        return <div>Please Login</div>
    }
  return (
    <div>page</div>
  )
}

export default Page