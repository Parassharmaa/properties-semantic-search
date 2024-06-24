"use client";
import Loading from "@/components/loading";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { PropertyData } from "@/types";
import { Cross1Icon } from "@radix-ui/react-icons";
import { BedDouble, Circle, ImageIcon, LucideBath, Search } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useQuery } from "react-query";

export default function Home() {
  const [query, setQuery] = useState<string | undefined>(undefined);

  const [image, setImage] = useState<string | undefined>(undefined);

  const { data, isLoading, refetch } = useQuery<PropertyData[]>(
    ["search", query, image],
    async () => {
      const response = await fetch("/api/search", {
        method: "POST",
        body: JSON.stringify({
          ...(query ? { query } : {}),
          ...(image ? { image } : {}),
        }),
      });
      return response.json();
    }
  );

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-18">
      <div className="relative w-full">
        <Search className="absolute top-2.5 left-2 w-4 h-4" />
        <Input
          className="pl-8 py-4 w-full"
          placeholder="What are you looking for?"
          disabled={!!image}
          // set on enter
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setQuery(e.currentTarget.value);
            }
          }}
        />
        <ImageIcon
          onClick={() => {
            // pick image from file explorer
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";

            input.onchange = async (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];

              if (file) {
                const reader = new FileReader();
                reader.onload = async (e) => {
                  const base64 = e.target?.result as string;

                  setImage(base64);
                };

                reader.readAsDataURL(file);
              }
            };

            input.click();
          }}
          className="absolute top-2.5 right-2 w-4 h-4 cursor-pointer hover:text-blue-500"
        />

        {image && (
          <div className="mt-2 flex justify-start">
            <div className="relative w-32 h-32">
              <Image
                src={image}
                alt="image"
                className="object-cover w-32 h-32 rounded-sm"
                layout="fill"
              />
              <div
                className="absolute top-1 right-1 p-1 bg-white rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => {
                  setImage(undefined);
                }}
              >
                <Cross1Icon />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* show image preview */}

      {isLoading && <Loading />}

      {!isLoading && data?.length === 0 && (
        <div className="flex flex-col items-center gap-4 mt-8">
          <p>No results found</p>
        </div>
      )}

      {!isLoading && (
        <div className="grid grid-cols-1 gap-4 mt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data?.map((property) => (
            <Card
              className="cursor-pointer w-full hover:bg-gray-100 dark:hover:bg-gray-800 shadow-none"
              key={property.id}
              onClick={() => {
                window.open(
                  `https://app.propertyloop.co.uk/properties/${property.id}`,
                  "_blank"
                );
              }}
            >
              <Carousel
                className="w-full h-48 mb-4 relative overflow-hidden group"
                opts={{ loop: true }}
              >
                <CarouselContent>
                  {property.images.split(",").map((image) => (
                    <CarouselItem key={image}>
                      <Image
                        src={image}
                        className="object-cover h-48 w-full rounded-sm group-hover:opacity-80"
                        alt={property.short_address}
                        width={300}
                        height={100}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <CarouselNext className="absolute top-1/2 right-2 transform -translate-y-1/2 group-hover:opacity-100 opacity-0" />
                  <CarouselPrevious className="absolute top-1/2 left-2 transform -translate-y-1/2 group-hover:opacity-100 opacity-0" />
                </div>
                <div className="absolute bottom-2 left-0 right-0 flex gap-1 justify-center">
                  {property.images.split(",").map((image, index) => (
                    <Circle key={image} className={`w-2 h-2 text-white`} />
                  ))}
                </div>
              </Carousel>
              <CardContent>
                <div>
                  <p>
                    <span className="text-xl font-bold">£{property.price}</span>{" "}
                    /
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {" "}
                      month
                    </span>
                  </p>
                  {/*avoid break new line */}
                  <h2 className="text-sm h-6 overflow-hidden overflow-ellipsis">
                    {property.short_address}
                  </h2>
                </div>
                <div className="flex gap-4 mt-4">
                  {parseInt(property.bedrooms, 10) > 0 && (
                    <div className="text-gray-600 dark:text-gray-400 text-xs flex gap-2">
                      <div>{property.bedrooms}</div>{" "}
                      <BedDouble className="w-4 h-4" />
                    </div>
                  )}

                  {parseInt(property.bathrooms, 10) > 0 && (
                    <div className="text-gray-600 dark:text-gray-400 text-xs flex gap-2">
                      <div>{property.bathrooms}</div>{" "}
                      <LucideBath className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
