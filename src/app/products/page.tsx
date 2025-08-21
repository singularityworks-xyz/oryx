'use client';

import { useState, useEffect } from "react";
import ProductCard from "@/components/product-card";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { mockProducts, categories, sortOptions } from "@/data/mockData";

export default function ProductsPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [sortBy, setSortBy] = useState("name");
	const [priceRange, setPriceRange] = useState({ min: 0, max: 300 });
	const [showFilters, setShowFilters] = useState(false);
	const [filteredProducts, setFilteredProducts] = useState(mockProducts);

	useEffect(() => {
		let filtered = mockProducts;

		if (searchTerm) {
			filtered = filtered.filter(
				(product) =>
					product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					product.description
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					product.categories.some((category) =>
						category.toLowerCase().includes(searchTerm.toLowerCase()),
					),
			);
		}

		if (selectedCategories.length > 0) {
			filtered = filtered.filter((product) =>
				selectedCategories.some((category) =>
					product.categories.includes(category),
				),
			);
		}

		filtered = filtered.filter(
			(product) =>
				product.sellingPrice >= priceRange.min &&
				product.sellingPrice <= priceRange.max,
		);

		filtered.sort((a, b) => {
			switch (sortBy) {
				case "price-low":
					return a.sellingPrice - b.sellingPrice;
				case "price-high":
					return b.sellingPrice - a.sellingPrice;
				case "newest":
					return parseInt(b._id) - parseInt(a._id);
				default:
					return a.name.localeCompare(b.name);
			}
		});

		setFilteredProducts(filtered);
	}, [searchTerm, selectedCategories, sortBy, priceRange]);

	const clearFilters = () => {
		setSearchTerm("");
		setSelectedCategories([]);
		setSortBy("name");
		setPriceRange({ min: 0, max: 300 });
	};

	return (
		<div className="min-h-screen bg-white">
			<section className="bg-white py-16 sm:py-20 md:py-24">
				<div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
					<div className="text-center mb-12 sm:mb-16 md:mb-20">
						<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-playfair font-light text-gray-900 mb-6 sm:mb-8 tracking-wide">
							SHOP COLLECTION
						</h1>
						<div className="w-20 sm:w-24 md:w-28 lg:w-32 h-px bg-gray-300 mx-auto"></div>
						<p className="text-sm sm:text-base md:text-lg text-gray-600 mt-6 sm:mt-8 max-w-xs sm:max-w-sm md:max-w-xl lg:max-w-2xl mx-auto font-outfit font-light leading-relaxed px-4 sm:px-0">
							Discover our curated selection of premium kitchen essentials, each
							piece chosen for its quality, craftsmanship, and timeless design.
						</p>
					</div>
				</div>
			</section>

			<section className="py-8 lg:py-12 bg-white border-b border-gray-100 shadow-sm">
				<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
					<div className="mb-8">
						<div className="max-w-2xl mx-auto">
							<div className="relative">
								<Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
								<input
									type="text"
									placeholder="Search for premium kitchen essentials..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="w-full pl-16 pr-6 py-4 lg:py-5 bg-gray-50 border border-gray-200 rounded-none focus:ring-0 focus:border-gray-300 focus:bg-white transition-all duration-300 text-lg font-outfit font-light placeholder-gray-400 text-gray-900"
								/>
								<button
									type="button"
									disabled
									className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-6 py-2 hover:bg-gray-800 transition-colors duration-300 font-outfit font-light tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Search
								</button>
							</div>
						</div>
					</div>

					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
						<div className="flex flex-col sm:flex-row gap-4">
							<button
								type="button"
								onClick={() => setShowFilters(!showFilters)}
								className="inline-flex items-center gap-3 px-6 py-3 border border-gray-200 hover:border-gray-300 transition-colors duration-300 font-outfit font-light tracking-wide text-gray-900"
							>
								<Filter className="w-4 h-4" />
								Filters
								<ChevronDown
									className={`w-4 h-4 transition-transform duration-300 ${showFilters ? "rotate-180" : ""}`}
								/>
							</button>

							<div className="relative">
								<select
									value={
										selectedCategories.length === 1 ? selectedCategories[0] : ""
									}
									onChange={(e) => {
										if (e.target.value) {
											setSelectedCategories([e.target.value]);
										} else {
											setSelectedCategories([]);
										}
									}}
									className="appearance-none px-6 py-3 border border-gray-200 hover:border-gray-300 transition-colors duration-300 font-outfit font-light tracking-wide bg-white cursor-pointer pr-12 text-gray-900"
								>
									<option value="">All Categories</option>
									{categories.map((category) => (
										<option
											key={category}
											value={category}
											className="text-gray-900 capitalize"
										>
											{category}
										</option>
									))}
								</select>
								<ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
							</div>
						</div>

						<div className="flex items-center gap-4">
							<div className="relative">
								<select
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value)}
									className="appearance-none px-6 py-3 border border-gray-200 hover:border-gray-300 transition-colors duration-300 font-outfit font-light tracking-wide bg-white cursor-pointer pr-12 text-gray-900"
								>
									{sortOptions.map((option) => (
										<option
											key={option.value}
											value={option.value}
											className="text-gray-900"
										>
											{option.label}
										</option>
									))}
								</select>
								<ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
							</div>
						</div>
					</div>

					{(searchTerm ||
						selectedCategories.length > 0 ||
						priceRange.min > 0 ||
						priceRange.max < 300) && (
						<div className="mt-6 flex flex-wrap items-center gap-3">
							<span className="text-sm font-outfit font-light text-gray-600">
								Active filters:
							</span>
							{searchTerm && (
								<span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm font-outfit font-light">
									Search: &quot;{searchTerm}&quot;
									<button
										type="button"
										onClick={() => setSearchTerm("")}
										className="hover:text-gray-900"
									>
										<X className="w-3 h-3" />
									</button>
								</span>
							)}
							{selectedCategories.length > 0 && (
								<span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm font-outfit font-light">
									Category: {selectedCategories[0]}
									<button
										type="button"
										onClick={() => setSelectedCategories([])}
										className="hover:text-gray-900"
									>
										<X className="w-3 h-3" />
									</button>
								</span>
							)}
							{sortBy !== "name" && (
								<span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm font-outfit font-light">
									Sort: {sortOptions.find((opt) => opt.value === sortBy)?.label}
									<button
										type="button"
										onClick={() => setSortBy("name")}
										className="hover:text-gray-900"
									>
										<X className="w-3 h-3" />
									</button>
								</span>
							)}
							{(priceRange.min > 0 || priceRange.max < 300) && (
								<span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm font-outfit font-light">
									Price: QAR {priceRange.min} - QAR {priceRange.max}
									<button
										type="button"
										onClick={() => setPriceRange({ min: 0, max: 300 })}
										className="hover:text-gray-900"
									>
										<X className="w-3 h-3" />
									</button>
								</span>
							)}
							<button
								type="button"
								onClick={clearFilters}
								className="text-sm font-outfit font-light text-gray-500 hover:text-gray-700 underline"
							>
								Clear all
							</button>
						</div>
					)}
				</div>
			</section>

			<section className="py-8 sm:py-12 md:py-16">
				<div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
					{filteredProducts.length > 0 ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
							{filteredProducts.map((product) => (
								<ProductCard key={product._id} product={product} />
							))}
						</div>
					) : (
						<div className="text-center py-12 sm:py-16">
							<div className="mb-6">
								<Search className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto" />
							</div>
							<h3 className="text-xl sm:text-2xl font-playfair font-light text-gray-900 mb-4">
								No products found
							</h3>
							<p className="text-sm sm:text-base font-outfit font-light text-gray-600 mb-8 max-w-md mx-auto">
								Try adjusting your search criteria or clearing some filters to
								see more products.
							</p>
							<button
								type="button"
								onClick={clearFilters}
								className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-outfit font-light hover:bg-gray-800 transition-colors duration-300"
							>
								Clear Filters
							</button>
						</div>
					)}
				</div>
			</section>
		</div>
	);
}
