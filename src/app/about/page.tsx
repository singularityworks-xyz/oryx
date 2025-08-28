import { Award, ChefHat, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-[1400px] px-0 pt-0 pb-12 sm:px-6 sm:pt-0 lg:py-0">
          <div className="relative h-[40vh] sm:h-[50vh] lg:h-[60vh]">
            <video
              autoPlay
              className="absolute inset-0 h-full w-full object-cover"
              loop
              muted
              playsInline
              preload="auto"
            >
              <source src="/about.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="mx-auto max-w-lg px-4 text-center text-white">
                <h1 className="mb-4 font-light font-playfair text-3xl tracking-wide sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
                  Crafted for your table
                </h1>
                <p className="mx-auto mb-6 max-w-md font-light font-outfit text-sm leading-relaxed sm:mb-8 sm:text-base md:max-w-lg">
                  We design and curate minimal, timeless tableware that makes
                  every meal feel special.
                </p>
                <Link
                  className="inline-flex items-center border border-white bg-transparent px-6 py-3 font-light font-outfit text-sm text-white transition-colors duration-300 hover:bg-white hover:text-gray-900 sm:px-8 sm:py-4 sm:text-base"
                  href="/products"
                >
                  Explore Collection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-0 sm:py-0 md:py-20">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-8">
            <div className="flex flex-col items-center justify-center border border-gray-200 bg-white p-3 text-center sm:p-6">
              <div className="mb-2 flex h-10 w-10 items-center justify-center">
                <Heart className="h-5 w-5 text-gray-900" />
              </div>
              <h3 className="font-light font-outfit text-gray-900 text-xs sm:text-base">
                Thoughtful
              </h3>
              <p className="mt-1 hidden max-w-xs font-light font-outfit text-gray-600 text-sm sm:block">
                Simple, durable pieces that pair with any table.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center border border-gray-200 bg-white p-3 text-center sm:p-6">
              <div className="mb-2 flex h-10 w-10 items-center justify-center">
                <Award className="h-5 w-5 text-gray-900" />
              </div>
              <h3 className="font-light font-outfit text-gray-900 text-xs sm:text-base">
                Quality
              </h3>
              <p className="mt-1 hidden max-w-xs font-light font-outfit text-gray-600 text-sm sm:block">
                Made to last through daily use and special moments.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center border border-gray-200 bg-white p-3 text-center sm:p-6">
              <div className="mb-2 flex h-10 w-10 items-center justify-center">
                <ChefHat className="h-5 w-5 text-gray-900" />
              </div>
              <h3 className="font-light font-outfit text-gray-900 text-xs sm:text-base">
                Culinary
              </h3>
              <p className="mt-1 hidden max-w-xs font-light font-outfit text-gray-600 text-sm sm:block">
                Built with chefs and hosts in mind.
              </p>
            </div>
          </div>
          <div className="mt-6 pt-10 text-center sm:mt-8">
            <p className="mx-auto max-w-md font-light font-outfit text-gray-600 text-sm sm:text-base">
              "From our premium dinnerware to our handpicked utensils, each item
              is selected with the discerning palate in mind. We partner with
              artisans who share our commitment to excellence and
              sustainability."
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="relative aspect-square bg-gray-50">
              <Image
                alt="White plate"
                className="object-contain p-6"
                fill
                sizes="33vw"
                src="/white-plate.png"
              />
            </div>
            <div className="relative aspect-square bg-gray-50">
              <Image
                alt="Black plate"
                className="object-contain p-6"
                fill
                sizes="33vw"
                src="/black-plate.png"
              />
            </div>
            <div className="relative hidden aspect-square bg-gray-50 sm:block">
              <Image
                alt="Wooden Bowl"
                className="object-contain p-6"
                fill
                sizes="33vw"
                src="/wooden-bowl.png"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white pb-16 sm:pb-20 md:pb-24">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="text-center">
            <p className="mx-auto max-w-xl font-light font-outfit text-gray-600 text-sm leading-relaxed sm:text-base">
              Oryx is where function meets quiet luxury. Fewer, better pieces
              for every kitchen and every table.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
