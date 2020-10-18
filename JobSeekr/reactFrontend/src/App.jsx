import React, { useState, useRef, useEffect } from "react";
import Navbar from "./Navbar";

const profile = {
  images: [
    "https://sandbox-uploads.imgix.net/u/1602756389-3f08c11af79b03919e94acc4633d2a6a?w=600",
    "https://sandbox-uploads.imgix.net/u/1602756466-5f3da43c2e54fb58ba96db7ac19bdbee?w=600",
    "https://sandbox-uploads.imgix.net/u/1602756777-b2805b4756eb54e00f61d6143295fdf0?w=600",
    "https://sandbox-uploads.imgix.net/u/1602756389-3f08c11af79b03919e94acc4633d2a6a?w=600",
    "https://sandbox-uploads.imgix.net/u/1602756389-3f08c11af79b03919e94acc4633d2a6a?w=600"
  ]
};

function ProfileCard({ profile: { images } }) {
  const [imgIndex, setImgIndex] = useState(0);
  useEffect(() => {
    const keydown = e => {
      const LEFT_ARROW = 37;
      const RIGHT_ARROW = 39;
      if (e.keyCode === LEFT_ARROW) {
        setImgIndex((imgIndex - 1 + images.length) % images.length);
      } else if (e.keyCode === RIGHT_ARROW) {
        setImgIndex((imgIndex + 1 + images.length) % images.length);
      }
    };
    window.addEventListener("keydown", keydown);
    console.log("addEventListener: ", keydown);
    return () => {
      console.log("removeEventListener", keydown);
      window.removeEventListener("keydown", keydown, false);
    };
  });

  return (
    <>
      <div
        style={{
          textAlign: "center"
        }}
      >
        <React.Suspense fallback={"loading ..."}>
          <img
            style={{
              width: "375px",
              height: "auto",
              borderRadius: "8px"
            }}
            draggable={false}
            onClick={() => setImgIndex((imgIndex + 1) % images.length)}
            src={images[imgIndex]}
            alt={"profile"}
          />
        </React.Suspense>
        <div>
          <button
            onClick={() =>
              setImgIndex((imgIndex - 1 + images.length) % images.length)
            }
          >
            {"<"}
          </button>
          Image {imgIndex + 1} of {images.length}
          <button
            onClick={() =>
              setImgIndex((imgIndex + 1 + images.length) % images.length)
            }
          >
            {">"}
          </button>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <div>
       <Navbar />
      <ProfileCard profile={profile} />
    </div>
  );
}
