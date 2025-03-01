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

export default function Home() {

  // شناسایی اندازه صفحه برای حالت موبایل
 

  return (
 
     <div
      className={`flex justify-center bg-custom-image-main bg-cover items-center min-h-screen `}
    >
   
   
        
       
        <TalentQuiz/>
        
   
    </div>

  );
}
