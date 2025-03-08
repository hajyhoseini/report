'use client';
import { useState, useEffect } from "react";
import MobileButton from "@/components/detailical/MobileButton";
import DescForSkill from "@/components/main/descForSkill";
import Description from "@/components/main/description";
import Projects from "@/components/main/Projects";
import SidebarMain from "@/components/main/sidebarMain";
import Tastes from "@/components/main/tastes";
import 'typeface-pacifico';
import CallToHelper from "@/components/detailical/callToHelper";
import TalentQuiz from "@/components/main/talentQuiz.";
import DailyReport from "@/components/main/dailyReport";

export default function Home() {

  // شناسایی اندازه صفحه برای حالت موبایل
 

  return (
 
     <div
      className={`flex justify-center bg-custom-image-main md:bg-custom-image-myUser fixed top-0 left-0 h-full w-full bg-cover xl:bg-cover items-center min-h-screen `}
    >
   
   
        <DailyReport/>
       
       
        
   
    </div>

  );
}
