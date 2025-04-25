import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`course/search?query=${searchQuery}`);
    }
    setSearchQuery("");
  }
  return (
    <div className="relative bg-[#c6b3b3] dark:bg-[#1e1e2f] py-24 px-6 text-center transition-all duration-500">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-gray-900 dark:text-white text-5xl font-extrabold mb-4 leading-tight">
          Elevate Your <span className="text-[#ff7f50]">Skills</span> with Top Courses
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg mb-8">
          Learn from industry experts and enhance your career with cutting-edge courses.
        </p>

        {/* Search Bar */}
        <form className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden max-w-xl mx-auto mb-6 transition duration-300 focus-within:ring-2 focus-within:ring-[#ff7f50]" onSubmit={(e) => searchHandler(e)}>
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Courses..."
          className="flex-grow border-none focus:ring-0 px-6 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
        <Button
          type="submit"
          className="bg-[#ff7f50] dark:bg-[#ff6b6b] text-white px-6 py-3 rounded-r-lg hover:bg-[#ff6347] dark:hover:bg-[#e55039] transition"
        >
          Search
        </Button>
      </form>

      {/* CTA Button */}
      <Button className="bg-[#ff7f50] dark:bg-[#ff6b6b] text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-[#ff6347] dark:hover:bg-[#e55039] transition" onClick={() => navigate("/course/search")}>
        Explore Courses
      </Button>
    </div>
    </div >
  );
};

export { HeroSection };
