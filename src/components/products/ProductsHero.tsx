export default function ProductsHero() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50/30">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl xl:text-7xl font-playfair font-light text-gray-900 mb-8 tracking-wide">
            SHOP COLLECTION
          </h1>
          <div className="w-24 lg:w-32 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto mb-8"></div>
          <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto font-outfit font-light leading-relaxed">
            Discover our curated selection of premium kitchen essentials, each piece crafted with attention to detail and timeless elegance.
          </p>
        </div>
      </div>
    </section>
  );
}
