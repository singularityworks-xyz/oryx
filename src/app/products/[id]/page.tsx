import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { mockProducts } from "@/data/mockData";

interface ProductDetailPageProps {
	params: {
		id: string;
	};
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
	const product = mockProducts.find((p) => p._id === params.id);

	if (!product) {
		notFound();
	}

	const displayPrice = product.sellingPrice || product.costPrice || 0;
	const originalPrice = product.costPrice || product.sellingPrice || 0;
	const discount = product.discount || 0;
	const discountPercentage =
		originalPrice > 0 ? Math.round((discount / originalPrice) * 100) : 0;

	return (
		<div className="min-h-screen bg-white">
			<div className="bg-white shadow-sm">
				<div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
					<div className="py-4">
						<Link
							href="/products"
							className="inline-flex items-center text-gray-600 hover:text-gray-900 font-outfit font-light text-sm sm:text-base"
						>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Shop
						</Link>
					</div>
				</div>
			</div>

			<section className="py-12 sm:py-16 md:py-20 lg:py-24">
				<div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-20">
						<div className="space-y-4">
							<div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
								<Image
									src={product.images[0]}
									alt={product.name}
									width={600}
									height={600}
									className="w-full h-full object-cover"
								/>
							</div>
							{product.images.length > 1 && (
								<div className="grid grid-cols-4 gap-4">
									{product.images.slice(1).map((image, index) => (
										<div
											key={image}
											className="aspect-square overflow-hidden rounded-lg bg-gray-100"
										>
											<Image
												src={image}
												alt={`${product.name} view ${index + 2}`}
												width={150}
												height={150}
												className="w-full h-full object-cover"
											/>
										</div>
									))}
								</div>
							)}
						</div>

						<div className="space-y-6 sm:space-y-8">
							<div>
								<h1 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-light text-gray-900 mb-4">
									{product.name}
								</h1>
								<div className="flex items-baseline gap-4 mb-4">
									<span className="text-2xl sm:text-3xl font-outfit font-light text-gray-900">
										QAR {displayPrice.toFixed(2)}
									</span>
									{discountPercentage > 0 && (
										<span className="text-lg font-outfit font-light text-gray-400 line-through">
											QAR {originalPrice.toFixed(2)}
										</span>
									)}
									{discountPercentage > 0 && (
										<span className="text-sm font-outfit font-light text-red-600 bg-red-50 px-2 py-1 rounded">
											-{discountPercentage}% OFF
										</span>
									)}
								</div>
							</div>

							<div className="prose prose-sm sm:prose font-outfit font-light text-gray-600 max-w-none">
								<p className="text-base sm:text-lg leading-relaxed">
									{product.description}
								</p>
							</div>

							<div className="space-y-4 border-t border-gray-200 pt-6">
								<div className="grid grid-cols-2 gap-4 text-sm">
									<div>
										<span className="font-outfit font-light text-gray-500">
											SKU:
										</span>
										<span className="font-outfit font-light text-gray-900 ml-2">
											{product.sku}
										</span>
									</div>
									<div>
										<span className="font-outfit font-light text-gray-500">
											Stock:
										</span>
										<span className="font-outfit font-light text-gray-900 ml-2">
											{product.stock} available
										</span>
									</div>
									<div>
										<span className="font-outfit font-light text-gray-500">
											Brand:
										</span>
										<span className="font-outfit font-light text-gray-900 ml-2">
											{product.brand}
										</span>
									</div>
									<div>
										<span className="font-outfit font-light text-gray-500">
											Material:
										</span>
										<span className="font-outfit font-light text-gray-900 ml-2">
											{product.material}
										</span>
									</div>
									<div>
										<span className="font-outfit font-light text-gray-500">
											Weight:
										</span>
										<span className="font-outfit font-light text-gray-900 ml-2">
											{product.weight} kg
										</span>
									</div>
									<div>
										<span className="font-outfit font-light text-gray-500">
											Warranty:
										</span>
										<span className="font-outfit font-light text-gray-900 ml-2">
											{product.warranty}
										</span>
									</div>
								</div>

								<div>
									<span className="font-outfit font-light text-gray-500">
										Dimensions:
									</span>
									<span className="font-outfit font-light text-gray-900 ml-2">
										{product.dimensions?.length} × {product.dimensions?.width} ×{" "}
										{product.dimensions?.height} cm
									</span>
								</div>

								<div>
									<span className="font-outfit font-light text-gray-500">
										Categories:
									</span>
									<div className="flex flex-wrap gap-2 mt-1">
										{product.categories.map((category) => (
											<span
												key={category}
												className="text-xs font-outfit font-light text-gray-600 bg-gray-100 px-2 py-1 rounded"
											>
												{category}
											</span>
										))}
									</div>
								</div>
							</div>

							<div className="pt-6">
								<button
									type="button"
									disabled
									className="w-full bg-gray-400 text-white font-outfit font-light text-base sm:text-lg py-4 px-8 cursor-not-allowed mb-4"
								>
									Add to Cart - Coming Soon
								</button>
								<p className="text-xs text-gray-500 text-center font-outfit font-light">
									Shopping functionality will be available in future updates
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
