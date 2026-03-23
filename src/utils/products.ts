import { client } from "../sanity/client";
import type { Product, CategoryMeta } from "./types";

const PRODUCT_PROJECTION = `
  "id": _id,
  "createdAt": _createdAt,
  name,
  "slug": slug.current,
  "category": category->{ title, "slug": slug.current, icon },
  price,
  originalPrice,
  shortDescription,
  description,
  features,
  warranty,
  badge,
  featured,
  inStock,
  tags,
  "images": images[]{ "url": asset->url, alt, "lqip": asset->metadata.lqip }
`;

export const getAllProducts = async (): Promise<Product[]> => {
	return await client.fetch(
		`*[_type == "product"] | order(name asc) { ${PRODUCT_PROJECTION} }`
	);
};

export const getAllCategories = async (): Promise<CategoryMeta[]> => {
	return await client.fetch(
		`*[_type == "category"] | order(title asc) {
      "id": slug.current,
      "label": title,
      icon,
      "image": image.asset->url,
      description,
      "count": count(*[_type == "product" && references(^._id)])
    }`
	);
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
	return await client.fetch(
		`*[_type == "product" && featured == true && inStock == true] { ${PRODUCT_PROJECTION} }`
	);
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
	return await client.fetch(
		`*[_type == "product" && slug.current == $slug][0] { ${PRODUCT_PROJECTION} }`,
		{ slug }
	);
};

export const getRelatedProducts = async (
	categorySlug: string,
	currentId: string
): Promise<Product[]> => {
	return await client.fetch(
		`*[_type == "product" && category->slug.current == $categorySlug && _id != $currentId && inStock == true][0...4] { ${PRODUCT_PROJECTION} }`,
		{ categorySlug, currentId }
	);
};

export const getProductsByCategory = async (
	categorySlug: string
): Promise<Product[]> => {
	return await client.fetch(
		`*[_type == "product" && category->slug.current == $categorySlug] { ${PRODUCT_PROJECTION} }`,
		{ categorySlug }
	);
};

// Deprecated: use sanityApi from src/store/api/sanityApi instead
export const categories: CategoryMeta[] = [
	{
		id: "refrigerators" as any,
		label: "Refrigerators",
		icon: "🧊",
		image: "/fridge-single-350.jpeg",
		description: "Keep food fresh longer",
		count: 2,
	},
	{
		id: "washing-machines" as any,
		label: "Washing Machines",
		icon: "🫧",
		image: "/midea-washing-1.7m.jpeg",
		description: "Clean clothes effortlessly",
		count: 3,
	},
	{
		id: "televisions" as any,
		label: "Televisions",
		icon: "📺",
		image: "/chiq-40inch-700k.jpeg",
		description: "Stunning displays for every room",
		count: 13,
	},
	{
		id: "cookers" as any,
		label: "Cookers",
		icon: "🍳",
		image: "/spj-cooker-990k.jpeg",
		description: "Gas and electric cookers for every kitchen",
		count: 8,
	},
	{
		id: "air-fryers" as any,
		label: "Air Fryers",
		icon: "♨️",
		image: "/kenwood-airfryer-400k.jpeg",
		description: "Crispy food with less oil",
		count: 2,
	},
	{
		id: "rice-cookers" as any,
		label: "Rice Cookers",
		icon: "🍚",
		image: "/oriamo-rice-cooker-250k.jpeg",
		description: "Perfect rice every time",
		count: 2,
	},
	{
		id: "fans" as any,
		label: "Fans",
		icon: "💨",
		image: "/philips-fan-180k.jpeg",
		description: "Powerful cooling solutions",
		count: 6,
	},
	{
		id: "blenders" as any,
		label: "Blenders",
		icon: "🥤",
		image: "/Hoffmans-blender-300k.jpeg",
		description: "Smooth blends every time",
		count: 2,
	},
	{
		id: "extension-cords" as any,
		label: "Extension Cords",
		icon: "🔌",
		image: "/saachi-50k.jpeg",
		description: "Safe and reliable power extensions",
		count: 1,
	},
	{
		id: "small-appliances" as any,
		label: "Small Appliances",
		icon: "⚡",
		image: "/Coffee-maker-250k.jpeg",
		description: "Coffee makers, steamers, warmers and more",
		count: 4,
	},
];
