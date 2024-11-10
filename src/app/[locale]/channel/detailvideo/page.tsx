"use client";
import React, { useEffect, useState, useRef } from 'react';
import HeaderHome from "@/components/pages/home/header/header";
import AsideHome from "@/components/pages/home/aside/aside";
import initTranslations from "@/app/i18n";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Upload, X, Info, Plus, Badge } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from '@clerk/nextjs';
import { IUser } from '@/types/user.interface';
import api from '@/services/axiosApi';
import VideoUploadInterface from "@/components/pages/channel/videoupload/videoupload"

interface IHomeProps {
  params: {
    locale: string;
  };
}
interface IHomeProps {
  params: {
    locale: string;
  };
}
const DetailVideoPage: React.FC = async ({params}: any) => {

  const {t} = await initTranslations(params.locale, ['common', 'categories'])


  return (
      <div className="flex w-full mt-20">
          <HeaderHome t={t}/>
          <div className="flex pt-20 overflow-hidden">
              <AsideHome t={t}/>
          </div>
          <div className="pl-[20%] w-full max-w-[1300px] flex justify-center max-lg:pl-[12%] max-sm:pl-0">
              <VideoUploadInterface />
          </div>
          <div>

          </div>
      </div>
  )
}

export default DetailVideoPage
