import { Award, ChefHat, Heart, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-white">
      <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="mb-12 text-center sm:mb-16 md:mb-20 lg:mb-24">
            <h1 className="mb-6 font-light font-playfair text-2xl text-gray-900 tracking-wide sm:mb-8 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              ABOUT ORYX
            </h1>
            <div className="mx-auto h-px w-20 bg-gray-300 sm:w-24 md:w-28 lg:w-32" />
            <p className="mx-auto mt-6 max-w-xs px-4 font-light font-outfit text-gray-600 text-sm leading-relaxed sm:mt-8 sm:max-w-sm sm:px-0 sm:text-base md:max-w-xl md:text-lg lg:max-w-2xl">
              Discover the story behind our passion for exceptional kitchen
              essentials and our commitment to culinary excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="font-light font-playfair text-gray-900 text-xl tracking-wide sm:text-2xl md:text-3xl">
                  OUR STORY
                </h2>
                <div className="h-px w-16 bg-gray-300" />
              </div>

              <div className="space-y-6 font-light font-outfit text-gray-600 leading-relaxed">
                <p className="text-sm sm:text-base">
                  Founded with a vision to transform everyday dining
                  experiences, Oryx was born from a deep appreciation for the
                  artistry of cooking and the importance of quality kitchenware.
                </p>
                <p className="text-sm sm:text-base">
                  We believe that every meal deserves to be prepared and served
                  with elegance. Our carefully curated collection brings
                  together timeless design and exceptional craftsmanship,
                  ensuring that every piece tells a story of sophistication and
                  functionality.
                </p>
                <p className="text-sm sm:text-base">
                  From our premium dinnerware to our handpicked utensils, each
                  item is selected with the discerning palate in mind. We
                  partner with artisans who share our commitment to excellence
                  and sustainability.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="font-light font-playfair text-gray-900 text-xl tracking-wide sm:text-2xl md:text-3xl">
                  OUR VALUES
                </h2>
                <div className="h-px w-16 bg-gray-300" />
              </div>

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6">
                <div className="flex items-start space-x-4">
                  <div className="mt-1 flex-shrink-0">
                    <Heart className="h-6 w-6 text-gray-900" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-light font-outfit text-base text-gray-900">
                      Passion for Excellence
                    </h3>
                    <p className="font-light font-outfit text-gray-600 text-sm leading-relaxed">
                      Every piece is chosen with uncompromising attention to
                      quality and design.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="mt-1 flex-shrink-0">
                    <Award className="h-6 w-6 text-gray-900" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-light font-outfit text-base text-gray-900">
                      Timeless Design
                    </h3>
                    <p className="font-light font-outfit text-gray-600 text-sm leading-relaxed">
                      Classic elegance that transcends trends and seasons.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="mt-1 flex-shrink-0">
                    <Users className="h-6 w-6 text-gray-900" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-light font-outfit text-base text-gray-900">
                      Community Focus
                    </h3>
                    <p className="font-light font-outfit text-gray-600 text-sm leading-relaxed">
                      Building connections between chefs, artisans, and food
                      lovers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="mt-1 flex-shrink-0">
                    <ChefHat className="h-6 w-6 text-gray-900" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-light font-outfit text-base text-gray-900">
                      Culinary Craftsmanship
                    </h3>
                    <p className="font-light font-outfit text-gray-600 text-sm leading-relaxed">
                      Supporting artisans who elevate the craft of cooking.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="mb-6 font-light font-playfair text-2xl text-gray-900 tracking-wide sm:mb-8 sm:text-3xl md:text-4xl">
              BY THE NUMBERS
            </h2>
            <div className="mx-auto h-px w-20 bg-gray-300 sm:w-24 md:w-28" />
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-12">
            <div className="text-center">
              <div className="mb-2 font-light font-playfair text-3xl text-gray-900 sm:text-4xl md:text-5xl">
                500+
              </div>
              <div className="font-light font-outfit text-gray-600 text-sm sm:text-base">
                Happy Customers
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 font-light font-playfair text-3xl text-gray-900 sm:text-4xl md:text-5xl">
                50+
              </div>
              <div className="font-light font-outfit text-gray-600 text-sm sm:text-base">
                Premium Products
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 font-light font-playfair text-3xl text-gray-900 sm:text-4xl md:text-5xl">
                15+
              </div>
              <div className="font-light font-outfit text-gray-600 text-sm sm:text-base">
                Artisan Partners
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 font-light font-playfair text-3xl text-gray-900 sm:text-4xl md:text-5xl">
                5★
              </div>
              <div className="font-light font-outfit text-gray-600 text-sm sm:text-base">
                Average Rating
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="text-center">
            <h2 className="mb-6 font-light font-playfair text-2xl text-gray-900 tracking-wide sm:mb-8 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              OUR MISSION
            </h2>
            <div className="mx-auto h-px w-20 bg-gray-300 sm:w-24 md:w-28 lg:w-32" />
            <p className="mx-auto mt-6 max-w-2xl font-light font-outfit text-base text-gray-600 leading-relaxed sm:mt-8 sm:text-lg md:text-xl">
              To elevate everyday dining experiences by connecting discerning
              customers with exceptional kitchenware that combines timeless
              beauty with uncompromising quality. We strive to make culinary
              artistry accessible to everyone who appreciates the finer things
              in life.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
