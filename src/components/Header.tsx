import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, Phone, MailIcon } from "lucide-react";
import { useCartStore } from "../store/Cartstore";
import { companyInfo } from "../utils/company";
import clsx from "clsx";

const navLinks = [
	{ label: "Home", path: "/" },
	{ label: "Shop", path: "/shop" },
	{ label: "About", path: "/about" },
	{ label: "Contact", path: "/contact" },
];

export default function Header() {
	const [scrolled, setScrolled] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	const location = useLocation();
	const { totalItems, openCart } = useCartStore();

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 10);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		setMobileOpen(false);
	}, [location.pathname]);

	const itemCount = totalItems();

	return (
		<>
			<header
				className={clsx(
					"fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md transition-shadow duration-300",
					scrolled
						? "shadow-md border-b border-slate-100"
						: "border-b border-slate-100/50",
				)}
			>
				{/* Top bar */}
				<div className="bg-teal-700 text-white text-[10px] md:text-xs h-8 flex items-center">
					<div className="section-container flex items-center justify-between w-full">
						<span className="hidden sm:block font-medium opacity-90">
							📍 Showroom: Aponye Shopping Centre, Kampala
						</span>
						<div className="flex items-center gap-4 ml-auto sm:ml-0">
							<a
								href={`tel:${companyInfo.phone}`}
								className="flex items-center gap-1.5 hover:text-teal-200 transition-colors font-medium"
							>
								<Phone size={12} />
								{companyInfo.phone}
							</a>
						</div>
					</div>
				</div>

				{/* Main nav */}
				<div className="section-container">
					<div className="h-16 md:h-20 flex items-center justify-between gap-6">
						{/* Logo */}
						<Link to="/" className="flex items-center gap-3 shrink-0 group">
							<img
								src="./logo.png"
								alt="High Flyer Logo"
								className="h-28 w-auto "
							/>
						</Link>

						{/* Desktop Nav */}
						<nav className="hidden md:flex items-center gap-2">
							{navLinks.map((link) => {
								const isActive = location.pathname === link.path;
								return (
									<Link
										key={link.path}
										to={link.path}
										className={clsx(
											"px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 relative group",
											isActive
												? "text-brand-teal bg-teal-50/50"
												: "text-slate-600 hover:text-brand-teal hover:bg-slate-50",
										)}
									>
										{link.label}
										{isActive && (
											<span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-teal" />
										)}
									</Link>
								);
							})}
						</nav>

						{/* Right actions */}
						<div className="flex items-center gap-2 md:gap-3">
							<a
								href={`https://wa.me/${companyInfo.whatsapp.replace(/\D/g, "")}`}
								target="_blank"
								rel="noopener noreferrer"
								className="hidden lg:flex btn px-5 py-2.5 bg-[#25D366] text-white hover:bg-[#196334] text-sm gap-2 shadow-sm"
							>
								<MailIcon size={16} className="mr-1" />
								WhatsApp
							</a>

							<button
								onClick={openCart}
								className="relative w-10 h-10 md:w-11 md:h-11 rounded-xl bg-white hover:bg-teal-50 text-slate-700 hover:text-brand-teal flex items-center justify-center transition-all duration-200 border border-slate-200 shadow-sm"
								aria-label="Shopping cart"
							>
								<ShoppingCart size={20} />
								{itemCount > 0 && (
									<span className="absolute -top-1 -right-1 bg-brand-orange w-3 h-3 rounded-full border-2 border-white" />
								)}
							</button>

							<button
								className="md:hidden w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-200 shadow-sm"
								onClick={() => setMobileOpen(!mobileOpen)}
								aria-label="Toggle menu"
							>
								{mobileOpen ? <X size={20} /> : <Menu size={20} />}
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Mobile Nav Drawer (Bottom Anchored) */}
			<div
				className={clsx(
					"fixed inset-0 z-[60] md:hidden transition-all duration-300",
					mobileOpen ? "visible" : "invisible",
				)}
			>
				<div
					className={clsx(
						"absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300",
						mobileOpen ? "opacity-100" : "opacity-0",
					)}
					onClick={() => setMobileOpen(false)}
				/>
				<div
					className={clsx(
						"absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] shadow-2xl transition-transform duration-500 ease-out p-6 pb-10",
						mobileOpen ? "translate-y-0" : "translate-y-full",
					)}
				>
					<div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />
					<nav className="flex flex-col gap-2">
						{navLinks.map((link) => (
							<Link
								key={link.path}
								to={link.path}
								className={clsx(
									"px-6 py-4 rounded-2xl text-lg font-bold transition-all flex items-center justify-between",
									location.pathname === link.path
										? "text-brand-teal bg-teal-50"
										: "text-slate-700 hover:bg-slate-50",
								)}
							>
								{link.label}
								{location.pathname === link.path && (
									<div className="w-2 h-2 rounded-full bg-brand-teal" />
								)}
							</Link>
						))}
					</nav>
					<div className="mt-8 grid grid-cols-1 gap-3">
						<a
							href={`https://wa.me/${companyInfo.whatsapp.replace(/\D/g, "")}`}
							target="_blank"
							rel="noopener noreferrer"
							className="btn btn-orange py-4 text-base shadow-lg shadow-orange-500/20"
						>
							💬 Chat on WhatsApp
						</a>
						<a
							href={`tel:${companyInfo.phone}`}
							className="btn py-4 bg-slate-100 text-slate-700 hover:bg-slate-200 text-base"
						>
							<Phone size={18} className="mr-2" /> Call Store
						</a>
					</div>
				</div>
			</div>
		</>
	);
}
