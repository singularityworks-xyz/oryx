import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { mockCartItems } from "@/data/mockData";

export default function CartPage() {
	const subtotal = mockCartItems.reduce(
		(total, item) => total + item.price * item.quantity,
		0,
	);
	const shipping = subtotal > 200 ? 0 : 25;
	const total = subtotal + shipping;

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="bg-white shadow-sm">
				<div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
					<div className="py-4">
						<Link
							href="/"
							className="inline-flex items-center text-gray-600 hover:text-gray-900 font-outfit font-light text-sm sm:text-base"
						>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Continue Shopping
						</Link>
					</div>
				</div>
			</div>

			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-8 sm:py-12 md:py-16">
				<div className="mb-8 sm:mb-12">
					<h1 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-light text-gray-900 mb-4">
						Shopping Cart
					</h1>
					<div className="w-20 sm:w-24 md:w-28 lg:w-32 h-px bg-gray-300"></div>
				</div>

				{mockCartItems.length > 0 ? (
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
						<div className="lg:col-span-2 space-y-4 sm:space-y-6">
							{mockCartItems.map((item) => (
								<div
									key={item.id}
									className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
								>
									<div className="flex items-center space-x-4">
										<div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
											<Image
												src={item.image}
												alt={item.name}
												width={96}
												height={96}
												className="w-full h-full object-cover rounded-lg"
											/>
										</div>

										<div className="flex-1 min-w-0">
											<Link href={`/products/${item.id}`} className="block">
												<h3 className="text-sm sm:text-base font-outfit font-light text-gray-900 hover:text-gray-700 transition-colors">
													{item.name}
												</h3>
											</Link>
											<p className="text-xs sm:text-sm font-outfit font-light text-gray-500 mt-1">
												QAR {item.price.toFixed(2)}
											</p>
										</div>

										<div className="flex items-center space-x-3">
											<div className="flex items-center border border-gray-300 rounded-md bg-gray-50">
												<button
													type="button"
													disabled
													className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 disabled:text-gray-400"
												>
													<Minus className="w-3 h-3" />
												</button>
												<span className="px-3 py-2 text-sm font-outfit font-light text-gray-900 min-w-[2rem] text-center">
													{item.quantity}
												</span>
												<button
													type="button"
													disabled
													className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 disabled:text-gray-400"
												>
													<Plus className="w-3 h-3" />
												</button>
											</div>

											<button
												type="button"
												disabled
												className="p-2 text-red-500 hover:bg-red-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
											>
												<Trash2 className="w-4 h-4" />
											</button>
										</div>

										<div className="text-right">
											<p className="text-sm sm:text-base font-outfit font-light text-gray-900">
												QAR {(item.price * item.quantity).toFixed(2)}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>

						<div className="lg:col-span-1">
							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
								<h2 className="text-lg sm:text-xl font-playfair font-light text-gray-900 mb-6">
									Order Summary
								</h2>

								<div className="space-y-4 mb-6">
									<div className="flex justify-between items-center text-sm font-outfit font-light">
										<span className="text-gray-600">
											Subtotal ({mockCartItems.length} items)
										</span>
										<span className="text-gray-900">
											QAR {subtotal.toFixed(2)}
										</span>
									</div>

									<div className="flex justify-between items-center text-sm font-outfit font-light">
										<span className="text-gray-600">Shipping</span>
										<span
											className={
												shipping === 0 ? "text-green-600" : "text-gray-900"
											}
										>
											{shipping === 0 ? "FREE" : `QAR ${shipping.toFixed(2)}`}
										</span>
									</div>

									{shipping > 0 && (
										<p className="text-xs text-gray-500 font-outfit font-light">
											Add QAR {(200 - subtotal).toFixed(2)} more for free
											shipping
										</p>
									)}

									<div className="border-t border-gray-200 pt-4">
										<div className="flex justify-between items-center text-base sm:text-lg font-outfit font-light">
											<span className="text-gray-900">Total</span>
											<span className="text-gray-900 font-medium">
												QAR {total.toFixed(2)}
											</span>
										</div>
									</div>
								</div>

								<button
									type="button"
									disabled
									className="w-full bg-gray-400 text-white font-outfit font-light text-base sm:text-lg py-4 px-6 cursor-not-allowed mb-4"
								>
									Proceed to Checkout
								</button>

								<p className="text-xs text-gray-500 text-center font-outfit font-light">
									Checkout functionality will be available in future updates
								</p>

								<div className="mt-6 pt-4 border-t border-gray-200">
									<Link
										href="/products"
										className="inline-flex items-center text-gray-600 hover:text-gray-900 font-outfit font-light text-sm"
									>
										<ShoppingBag className="w-4 h-4 mr-2" />
										Continue Shopping
									</Link>
								</div>
							</div>
						</div>
					</div>
				) : (
					<div className="text-center py-12 sm:py-16">
						<div className="mb-6">
							<ShoppingBag className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto" />
						</div>
						<h2 className="text-xl sm:text-2xl font-playfair font-light text-gray-900 mb-4">
							Your cart is empty
						</h2>
						<p className="text-sm sm:text-base font-outfit font-light text-gray-600 mb-8 max-w-md mx-auto">
							Looks like you haven&apos;t added anything to your cart yet. Start
							exploring our collection of premium kitchen essentials.
						</p>
						<Link
							href="/products"
							className="inline-flex items-center px-8 py-4 bg-gray-900 text-white font-outfit font-light text-base hover:bg-gray-800 transition-colors duration-300"
						>
							Start Shopping
							<ArrowLeft className="ml-2 w-4 h-4 rotate-180" />
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
