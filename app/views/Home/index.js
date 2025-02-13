"use client"
import Header from "@/app/components/Header";
import { Loader } from "@/app/components/Loader";
import TokenCard from "@/app/components/TokenCard";
import images from "@/app/constants/images";
import { supabase } from "@/app/services/supabase.js";
import React, { useEffect, useRef, useState } from "react";



export default function Home() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef(null);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const POSTS_PER_PAGE = 3

  const fetchToken = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    let query = supabase.from('token')
      .select('*')
      .range(page * POSTS_PER_PAGE, (page + 1) * POSTS_PER_PAGE - 1)
      .order('created_at', { ascending: false });

    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`);
    }

    const { data, error } = await query;

    if (error) console.error('Error fetching data:', error);

    if (!data || data.length < POSTS_PER_PAGE) {
      setHasMore(false);
    }

    if (page === 0) {
      setTokens(data || []);
    } else {
      setTokens(prev => [...prev, ...(data || [])]);
    }

    setPage(prev => prev + 1);
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    if (newValue === "") {
      fetchToken(); // If input is cleared, fetch all data
    }
  };

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    setTokens([]);
    fetchToken();
  }, [searchQuery]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      entries => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading) {
          fetchToken();
        }
      },
      {
        root: null,
        rootMargin: '20px',
        threshold: 0.1,
      }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [hasMore, loading, page]);

  // const fetchToken = async () => {
  //   if (loading || !hasMore) return;
  //   setLoading(true)
  //   const { data, error } = await supabase.from('token')
  //     .select('*')
  //     .range(page * POSTS_PER_PAGE, (page + 1) * POSTS_PER_PAGE - 1)
  //     .order('created_at', { ascending: false });

  //   if (error) console.error('Error fetching data:', error);

  //   if (data.length < POSTS_PER_PAGE) {
  //     setHasMore(false);
  //   }
  //   setTokens(prev => [...prev, ...data]);
  //   setPage(prev => prev + 1);
  //   setLoading(false)
  //   console.log(data)
  // };

  // useEffect(() => {
  //   fetchToken();
  // }, []);

  // useEffect(() => {
  //   const container = containerRef.current;
  //   if (!container) return;

  //   const observer = new IntersectionObserver(
  //     entries => {
  //       const target = entries[0];
  //       if (target.isIntersecting && hasMore && !loading) {
  //         fetchToken();
  //       }
  //     },
  //     {
  //       root: null,
  //       rootMargin: '20px',
  //       threshold: 0.1,
  //     }
  //   );

  //   observer.observe(container);

  //   return () => observer.disconnect();
  // }, [hasMore, loading]);


  // const tokens = [
  //   {
  //     id: 1,
  //     name: "$SOIL",
  //     marketCap: "12.36 M",
  //     hodlers: "106,964",
  //     address: "0x1C4C...F463A3",
  //     description:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus velit diam, Nullam rhoncus laoreet.",
  //       telegram : images.telegram ,
  //       twitter : images.twitter,
  //       website :images.website,
  //       coverPic : images.coverPic,
  //   },
  //   {
  //     id: 2,
  //     name: "$FIYAH",
  //     marketCap: "12.36 M",
  //     hodlers: "106,964",
  //     address: "0x1C4C...F463A3",
  //     description:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus velit diam, Nullam rhoncus laoreet.",
  //       telegram : images.telegram ,
  //       twitter : images.twitter,
  //       website :images.website,
  //       coverPic : images.coverPic,
  //   },
  //   {
  //     id: 3,
  //     name: "$GEARTH",
  //     marketCap: "12.36 M",
  //     hodlers: "106,964",
  //     address: "0x1C4C...F463A3",
  //     description: "We got Girth ;)",
  //     telegram : images.telegram ,
  //       twitter : images.twitter,
  //       website :images.website,
  //       coverPic : images.coverPic,
  //   },
  // ];

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Header */}
      <Header />
      {/* <header className="flex items-center w-full justify-between px-8 py-4">
        <button className="text-[#000000] font-normal text-[13px]">HOW IT WORKS?</button>
        <div className="flex gap-10">
         <Link href="/form">
         <button className="text-[#FF0000] font-normal text-[13px]">CREATE TOKEN</button>
         </Link>
          <button className="text-[#000000] font-normal text-[13px]">CONNECT WALLET</button>
        </div>
      </header> */}

      <div className="flex flex-col mt-[1rem] justify-center items-center">
        <h1 className="text-[#000000] font-primary font-black text-[68px]">r/acc</h1>
        <p className="text-[#7F7F7F] font-normal text-[17px] font-primary ">degen to regen pipeline</p>
        <div className="flex justify-center mt-[2rem] gap-3 w-full items-end">
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            className="border-b-[1px] outline-none text-black font-primary w-[28%] bg-gray-50 border-[#D5D5D5] rounded px-4 py-2"
          />
          <button className="text-[#000000] font-normal font-primary text-[13px]">SEARCH</button>
        </div>

      </div>


      {/* Navigation */}
      <div className="flex mt-[3rem]  mb-10 justify-center items-center">
        <nav className="flex justify-center items-center w-[95%] border-y-[1px] border-gray-300 px-8 py-4">
          <button className="text-[#FF0000] font-normal font-primary text-[13px] px-4">FEATURED</button>
          <button className="text-[#000000] font-normal font-primary text-[13px] px-4">MARKET CAP</button>
          <button className="text-[#000000] font-normal font-primary text-[13px] px-4">HODLERS</button>
          <button className="text-[#000000] font-normal font-primary text-[13px] px-4">DATE</button>
          <button className="text-[#000000] font-normal font-primary text-[13px] px-4">TRENDING</button>
        </nav>
      </div>


      {/* Token Cards */}
      {/* {loading ?
        <div className="flex items-center justify-center h-64">
          <Loader className="text-[#7C7C7C]" size="text-6xl" />
        </div>
        :
        <InfiniteScroll
        dataLength={tokens.length}
        next={fetchToken}
        hasMore={hasMore}
        loader={loading}
        endMessage={<p>No more Tokens to load</p>}
      >
        
       <p></p>
        </InfiniteScroll>
      } */}

      <div
        ref={containerRef}
        className="h-full flex items-center justify-center"
      >
        {loading ?
          <div className="flex items-center justify-center h-64">
            <Loader className="text-[#7C7C7C]" size="text-6xl" />
          </div>
          :
          <TokenCard tokens={tokens} />
        }
      </div>
    </div>
  );
}
