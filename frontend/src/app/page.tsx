"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { BACKEND_URL } from "@/config/constants/api";

const useButtonSendFile = () => {
  const refInputFile = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageResult, setImageResult] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Verify files
    const files = event.target.files;
    if (!files || !(files?.length > 0)) return;
    // Get file 0
    const file = files[0];
    // Set file selected
    setFile(file);
    // Create reader
    const reader = new FileReader();
    // Onload reader
    reader.onload = () => setImagePreview(reader.result as string);
    // Read
    reader.readAsDataURL(file);
  };

  const processImage = async () => {
    if (!file) return;

    try {
      // create formData
      const formData = new FormData();
      formData.append("files", file);

      // get response
      const response = await fetch(`${BACKEND_URL}/images`, {
        method: "POST",
        body: formData,
      });

      // get image on response
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      // set image result
      setImageResult(imageUrl);
    } catch (error) {
      console.log(error);
      throw new Error("There was an error trying to convert the photo");
    }
  };

  const handleOpenInputFile = () => {
    if (refInputFile.current) {
      refInputFile.current.click();
    }
  };

  return {
    refInputFile,
    imageResult,
    processImage,
    imagePreview,
    handleFileChange,
    handleOpenInputFile,
  };
};

export default function Home() {
  const {
    refInputFile,
    imageResult,
    processImage,
    imagePreview,
    handleFileChange,
    handleOpenInputFile,
  } = useButtonSendFile();

  return (
    <section
      className="m-auto flex gap-10 items-center w-full max-w-[70rem] 
        justify-center"
    >
      <div
        className="p-10 h-auto bg-white rounded-xl border flex flex-col
          gap-3 w-full max-w-[30rem] min-h-[25rem] justify-center
          shadow-[4px_4px_0px_0px_rgba(120,120,120,1)]"
      >
        <header className="text-gray-500 font-semibold text-xl">
          Hello! Place an image that you want to watermark.
        </header>
        <section className="flex flex-col">
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={handleOpenInputFile}
              className="bg-white border opacity-90 border-zinc-300 border-dashed
                rounded-xl p-3 capitalize font-semibold text-lg
                hover:opacity-100 hover:border-transparent
                hover:shadow-lg transition-all hover:bg-gray-50"
            >
              load image
            </button>
            <input
              type="file"
              className="hidden"
              ref={refInputFile}
              onChange={handleFileChange}
            />
            <div
              className="w-full h-[30rem] relative flex
                rounded-xl overflow-hidden border"
            >
              {imagePreview && (
                <Image
                  src={imagePreview}
                  alt="preview"
                  fill
                  style={{ objectFit: "cover" }}
                />
              )}
            </div>
            <button
              className="p-3 px-4 rounded-lg
                flex gap-3 items-center bg-gradient-45
                from-purple-500 to-indigo-500 text-white
                opacity-95 hover:opacity-100 justify-center"
              onClick={processImage}
            >
              <span className="font-normal">Enviar</span>
            </button>
          </div>
        </section>
      </div>

      <div
        className="p-10 h-auto bg-white rounded-2xl border flex flex-col
          gap-3 w-full max-w-[27rem] min-h-[25rem] justify-center"
      >
        <header className="text-gray-500 font-semibold text-xl">
          Resultado:
        </header>
        <section className="flex flex-col">
          <div className="flex flex-col gap-3 w-full">
            <div
              className="w-full h-[30rem] relative flex
                rounded-xl overflow-hidden border"
            >
              {imageResult && (
                <Image
                  src={imageResult}
                  alt="preview"
                  fill
                  style={{ objectFit: "cover" }}
                />
              )}
            </div>
            {imageResult && (
              <a
                href={imageResult}
                download="processed_image.png"
                className="w-full p-3 rounded-md flex items-center justify-center
                  bg-gradient-45 from-rose-500 to-purple-500 text-white
                  opacity-95 hover:opacity-100 hover:shadow-xl"
              >
                Baixar
              </a>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
