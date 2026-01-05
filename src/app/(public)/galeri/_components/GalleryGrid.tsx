"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Grid3x3, Grid2x2 } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  createdAt: Date;
}

interface GalleryGridProps {
  items: GalleryItem[];
  categories: string[];
}

export default function GalleryGrid({ items, categories }: GalleryGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [gridSize, setGridSize] = useState<"large" | "small">("large");

  const filteredItems = items.filter(
    (item) => selectedCategory === "ALL" || item.category === selectedCategory
  );

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  const goToPrevious = () => {
    if (selectedImage !== null && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };

  const goToNext = () => {
    if (selectedImage !== null && selectedImage < filteredItems.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };

  // Keyboard navigation
  useState(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div className="space-y-8">
      {/* Filter & View Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === "ALL"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Semua ({items.length})
          </button>
          {categories.map((category) => {
            const count = items.filter((i) => i.category === category).length;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {category} ({count})
              </button>
            );
          })}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setGridSize("large")}
            className={`p-2 rounded-lg transition-colors ${
              gridSize === "large"
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
            title="Grid Besar"
          >
            <Grid2x2 size={20} />
          </button>
          <button
            onClick={() => setGridSize("small")}
            className={`p-2 rounded-lg transition-colors ${
              gridSize === "small"
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
            title="Grid Kecil"
          >
            <Grid3x3 size={20} />
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-500 text-lg">
            Tidak ada foto dalam kategori ini
          </p>
        </div>
      ) : (
        <div
          className={`grid gap-4 ${
            gridSize === "large"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
          }`}
        >
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(index)}
              className="group relative aspect-square bg-slate-100 rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all"
            >
              <Image
                src={item.imageUrl}
                alt={item.title || "Gallery image"}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-200">{item.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
          >
            <X size={24} />
          </button>

          {/* Previous Button */}
          {selectedImage > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
            >
              <ChevronLeft size={32} />
            </button>
          )}

          {/* Next Button */}
          {selectedImage < filteredItems.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
            >
              <ChevronRight size={32} />
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full">
              <Image
                src={filteredItems[selectedImage].imageUrl}
                alt={filteredItems[selectedImage].title || "Gallery image"}
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Image Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold mb-2">
                {filteredItems[selectedImage].title}
              </h2>
              <p className="text-slate-300">
                {filteredItems[selectedImage].category} • {selectedImage + 1} /{" "}
                {filteredItems.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
