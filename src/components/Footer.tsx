import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { companyInfo } from "../utils/company";

export default function Footer() {
	const year = new Date().getFullYear();

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
							{[
								{
									href: companyInfo.socialMedia.facebook,
									icon: "f",
									label: "Facebook",
								},
								{
									href: companyInfo.socialMedia.instagram,
									icon: "📷",
									label: "Instagram",
								},
							].map((social) => (
								<a
									key={social.label}
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									className="w-10 h-10 rounded-xl bg-slate-800/50 hover:bg-brand-teal text-white flex items-center justify-center text-sm transition-all duration-300 hover:-translate-y-1"
									aria-label={social.label}
								>
									{social.icon}
								</a>
							))}
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
										<span className="w-0 group-hover:w-2 h-[1px] bg-brand-teal mr-0 group-hover:mr-2 transition-all"></span>
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
							{[
								"Refrigerators",
								"Washing Machines",
								"Televisions",
								"Air Conditioners",
								"Microwaves",
								"Water Dispensers",
							].map((cat) => (
								<li key={cat}>
									<Link
										to={`/shop?category=${cat.toLowerCase().replace(/ /g, "-")}`}
										className="text-sm hover:text-brand-teal transition-colors flex items-center group"
									>
										<span className="w-0 group-hover:w-2 h-[1px] bg-brand-teal mr-0 group-hover:mr-2 transition-all"></span>
										{cat}
									</Link>
								</li>
							))}
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
