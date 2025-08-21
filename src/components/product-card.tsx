import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

interface ProductCardProps {
	product: {
		_id: string;
		productId?: string;
		name: string;
		description: string;
		sellingPrice?: number;
		price?: number;
		costPrice?: number;
		discount?: number;
		images: string[];
		categories?: string[];
		category?: string;
		stock: number;
		tags?: string[];
		isTrending?: boolean;
	};
}

export default function ProductCard({ product }: ProductCardProps) {
	const displayPrice = product.sellingPrice || product.price || 0;
	const originalPrice = product.costPrice || product.price || 0;
	const discount = product.discount || 0;
	const discountPercentage =
		originalPrice > 0 ? Math.round((discount / originalPrice) * 100) : 0;

	return (
		<div className="group bg-white overflow-hidden hover:shadow-2xl transition-all duration-700 border border-gray-100 hover:border-gray-200 flex flex-col h-full relative">
			<div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

			<div className="relative h-48 sm:h-64 md:h-72 lg:h-80 w-full overflow-hidden bg-gray-50 flex-shrink-0">
				<Link href={`/products/${product._id}`}>
					<Image
						src={product.images[0]}
						alt={product.name}
						fill
						className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
						sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw"
						quality={90}
						priority={false}
					/>
					<div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-700"></div>
				</Link>

				{discountPercentage > 0 && (
					<div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-black text-white text-xs font-outfit font-light px-2 sm:px-3 py-1 sm:py-1.5 tracking-widest shadow-lg">
						-{discountPercentage}%
					</div>
				)}

				{product.isTrending && (
					<div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white text-black text-xs font-outfit font-light px-2 sm:px-3 py-1 sm:py-1.5 tracking-widest border border-gray-200 shadow-lg">
						<Star className="w-3 h-3 fill-current inline mr-1" />
						TRENDING
					</div>
				)}
			</div>

			<div className="p-4 sm:p-6 md:p-8 flex flex-col flex-1 relative z-10">
				<Link href={`/products/${product._id}`} className="flex-1">
					<h3 className="text-sm sm:text-base md:text-lg font-outfit font-medium text-gray-900 mb-4 sm:mb-6 hover:text-gray-600 transition-colors duration-300 leading-relaxed tracking-wide">
						{product.name}
					</h3>
				</Link>

				<div className="flex items-baseline gap-2 sm:gap-4 mt-auto">
					<span className="text-lg sm:text-xl md:text-2xl font-outfit font-light text-gray-900 tracking-wide">
						<span className="text-gray-500 text-xs sm:text-sm font-outfit font-light tracking-wider">
							QAR
						</span>
						<br />
						{displayPrice.toFixed(2)}
					</span>
					{discountPercentage > 0 && (
						<span className="text-xs sm:text-sm font-outfit font-light text-gray-400 line-through tracking-wide">
							QAR {originalPrice.toFixed(2)}
						</span>
					)}
				</div>
			</div>
		</div>
	);
}
