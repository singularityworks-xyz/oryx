export default function ContactPage() {
  return (
    <div className="bg-white">
      <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="mb-12 text-center sm:mb-16 md:mb-20 lg:mb-24">
            <h1 className="mb-6 font-light font-playfair text-2xl text-gray-900 tracking-wide sm:mb-8 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              GET IN TOUCH
            </h1>
            <div className="mx-auto h-px w-20 bg-gray-300 sm:w-24 md:w-28 lg:w-32" />
            <p className="mx-auto mt-6 max-w-xs px-4 font-light font-outfit text-gray-600 text-sm leading-relaxed sm:mt-8 sm:max-w-sm sm:px-0 sm:text-base md:max-w-xl md:text-lg lg:max-w-2xl">
              We'd love to hear from you. Reach out to discuss your culinary
              needs or inquire about our premium kitchen essentials.
            </p>
          </div>

          <div className="mx-auto max-w-2xl">
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="font-light font-playfair text-gray-900 text-xl tracking-wide sm:text-2xl md:text-3xl">
                  SEND US A MESSAGE
                </h2>
                <div className="h-px w-16 bg-gray-300" />
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      className="mb-1.5 block font-light font-outfit text-gray-700 text-sm"
                      htmlFor="firstName"
                    >
                      First Name
                    </label>
                    <input
                      className="w-full border border-gray-200 bg-white px-4 py-3 font-light font-outfit text-gray-900 text-sm placeholder-gray-400 transition-all duration-300 focus:border-gray-900 focus:ring-0"
                      id="firstName"
                      placeholder="Enter your first name"
                      type="text"
                    />
                  </div>
                  <div>
                    <label
                      className="mb-1.5 block font-light font-outfit text-gray-700 text-sm"
                      htmlFor="lastName"
                    >
                      Last Name
                    </label>
                    <input
                      className="w-full border border-gray-200 bg-white px-4 py-3 font-light font-outfit text-gray-900 text-sm placeholder-gray-400 transition-all duration-300 focus:border-gray-900 focus:ring-0"
                      id="lastName"
                      placeholder="Enter your last name"
                      type="text"
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="mb-1.5 block font-light font-outfit text-gray-700 text-sm"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    className="w-full border border-gray-200 bg-white px-4 py-3 font-light font-outfit text-gray-900 text-sm placeholder-gray-400 transition-all duration-300 focus:border-gray-900 focus:ring-0"
                    id="email"
                    placeholder="Enter your email address"
                    type="email"
                  />
                </div>

                <div>
                  <label
                    className="mb-1.5 block font-light font-outfit text-gray-700 text-sm"
                    htmlFor="subject"
                  >
                    Subject
                  </label>
                  <select
                    className="w-full border border-gray-200 bg-white px-4 py-3 font-light font-outfit text-gray-900 text-sm transition-all duration-300 focus:border-gray-900 focus:ring-0"
                    id="subject"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="order">Order Support</option>
                    <option value="product">Product Information</option>
                    <option value="wholesale">Wholesale</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    className="mb-1.5 block font-light font-outfit text-gray-700 text-sm"
                    htmlFor="message"
                  >
                    Message
                  </label>
                  <textarea
                    className="w-full border border-gray-200 bg-white px-4 py-3 font-light font-outfit text-gray-900 text-sm placeholder-gray-400 transition-all duration-300 focus:border-gray-900 focus:ring-0"
                    id="message"
                    placeholder="Tell us how we can help you..."
                    rows={6}
                  />
                </div>

                <button
                  className="w-full border border-gray-900 bg-gray-900 px-8 py-4 font-light font-outfit text-base text-white transition-colors duration-300 hover:border-gray-800 hover:bg-gray-800 sm:w-auto"
                  type="submit"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
