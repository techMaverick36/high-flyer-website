import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Loader2 } from "lucide-react";
import { companyInfo } from "../utils/company";
import { useGetAllCategoriesQuery } from "../store/api/sanityApi";

export default function Footer() {
	const year = new Date().getFullYear();
	const { data: categories = [], isLoading: loading } = useGetAllCategoriesQuery();

	return (
		<footer className="bg-[#0f172a] text-slate-400">
			{/* Main footer */}
			<div className="section-container py-20">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
					{/* Brand */}
					<div className="lg:pr-8">
						<Link to="/" className="flex items-center gap-3 mb-6 group">
							<img
								src="./logo.png"
								alt="High Flyer Logo"
								className="h-24 w-auto"
							/>
							<div>
								<div className="font-display font-bold text-white text-base">
									High Flyer
								</div>
								<div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
									Trading CO LTD
								</div>
							</div>
						</Link>
						<p className="text-sm leading-relaxed mb-8 text-slate-400">
							Uganda's trusted destination for premium home appliances. Genuine
							products, expert advice, and reliable after-sales service.
						</p>
						<div className="flex gap-4">
							<a
								href={companyInfo.socialMedia.facebook}
								target="_blank"
								rel="noopener noreferrer"
								className="w-10 h-10 rounded-xl bg-slate-800/50 hover:bg-brand-teal text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
								aria-label="Facebook"
							>
								<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
									<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
								</svg>
							</a>
							<a
								href={companyInfo.socialMedia.instagram}
								target="_blank"
								rel="noopener noreferrer"
								className="w-10 h-10 rounded-xl bg-slate-800/50 hover:bg-brand-teal text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
								aria-label="Instagram"
							>
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
									<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
									<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
									<line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
								</svg>
							</a>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h4 className="font-display font-bold text-white mb-6 text-sm uppercase tracking-widest">
							Quick Links
						</h4>
						<ul className="space-y-4">
							{[
								{ label: "Home", path: "/" },
								{ label: "Shop All Products", path: "/shop" },
								{ label: "About Us", path: "/about" },
								{ label: "Contact Us", path: "/contact" },
								{ label: "Cart", path: "/cart" },
							].map((link) => (
								<li key={link.path}>
									<Link
										to={link.path}
										className="text-sm hover:text-brand-teal transition-colors flex items-center group"
									>
										<span className="w-0 group-hover:w-2 h-px bg-brand-teal mr-0 group-hover:mr-2 transition-all"></span>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Categories */}
					<div>
						<h4 className="font-display font-bold text-white mb-6 text-sm uppercase tracking-widest">
							Categories
						</h4>
						<ul className="space-y-4">
							{loading ? (
								<li className="flex items-center gap-2 text-sm text-slate-500">
									<Loader2 size={14} className="animate-spin" />
									Loading...
								</li>
							) : (
								categories.slice(0, 6).map((cat) => (
									<li key={cat.id}>
										<Link
											to={`/shop?category=${cat.id}`}
											className="text-sm hover:text-brand-teal transition-colors flex items-center group"
										>
											<span className="w-0 group-hover:w-2 h-px bg-brand-teal mr-0 group-hover:mr-2 transition-all"></span>
											{cat.label}
										</Link>
									</li>
								))
							)}
						</ul>
					</div>

					{/* Contact */}
					<div>
						<h4 className="font-display font-bold text-white mb-6 text-sm uppercase tracking-widest">
							Contact
						</h4>
						<ul className="space-y-5">
							<li>
								<a
									href={`tel:${companyInfo.phone}`}
									className="flex items-start gap-4 text-sm hover:text-brand-teal transition-colors group"
								>
									<div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center shrink-0 group-hover:bg-brand-teal transition-colors">
										<Phone size={14} className="text-white" />
									</div>
									<span className="pt-1">{companyInfo.phone}</span>
								</a>
							</li>
							<li>
								<a
									href={`mailto:${companyInfo.email}`}
									className="flex items-start gap-4 text-sm hover:text-brand-teal transition-colors group"
								>
									<div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center shrink-0 group-hover:bg-brand-teal transition-colors">
										<Mail size={14} className="text-white" />
									</div>
									<span className="pt-1">{companyInfo.email}</span>
								</a>
							</li>
							{companyInfo.locations.slice(0, 1).map((loc) => (
								<li key={loc.id}>
									<a
										href={loc.mapUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-start gap-4 text-sm hover:text-brand-teal transition-colors group"
									>
										<div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center shrink-0 group-hover:bg-brand-teal transition-colors">
											<MapPin size={14} className="text-white" />
										</div>
										<span className="pt-1">{loc.address}</span>
									</a>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>

			{/* Bottom bar */}
			<div className="border-t border-slate-800/50">
				<div className="section-container py-8 flex flex-col md:flex-row items-center justify-between gap-6">
					<p className="text-xs text-slate-500 font-medium">
						© {year} High Flyer Trading CO LTD. All rights reserved.
					</p>
					<div className="flex gap-8">
						{["Privacy Policy", "Terms of Service", "Refund Policy"].map(
							(item) => (
								<span
									key={item}
									className="text-xs text-slate-500 hover:text-teal-400 cursor-pointer transition-colors font-medium"
								>
									{item}
								</span>
							),
						)}
					</div>
				</div>
			</div>
		</footer>
	);
}
