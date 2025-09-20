import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import WriteArticle from "./pages/WriteArticle";
import BlogTitiles from "./pages/BlogTitiles";
import GenerateImages from "./pages/GenerateImages";
import RemoveBackground from "./pages/RemoveBackground";
import RemoveObject from "./pages/RemoveObject";
import Community from "./pages/Community";
import ReviewResume from "./pages/ReviewResume";
import AiCode from "./pages/AICode";
import { useAuth } from "@clerk/clerk-react";
import {Toaster} from "react-hot-toast"

function App() {
  // const {getToken} = useAuth()
  // useEffect(()=>{
  //   getToken().then((token)=>console.log(token));
  // },[getToken])

  const {} = useAuth()
  return (
    <div>
      <Toaster/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ai" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="write-article" element={<WriteArticle />} />
          <Route path="blog-titiles" element={<BlogTitiles />} />
          <Route path="generate-images" element={<GenerateImages />} />
          <Route path="remove-background" element={<RemoveBackground />} />
          <Route path="remove-object" element={<RemoveObject />} />
          <Route path="community" element={<Community />} />
          <Route path="review-resume" element={<ReviewResume />} />
          <Route path="ai-code" element={<AiCode />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
