import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { client } from '../../sanity/client';
import type { Product, CategoryMeta } from '../../utils/types';

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
  rating,
  reviewCount,
  "images": images[]{ "url": asset->url, alt, "lqip": asset->metadata.lqip }
`;

export const sanityApi = createApi({
  reducerPath: 'sanityApi',
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getAllProducts: builder.query<Product[], void>({
      queryFn: async () => {
        try {
          const data = await client.fetch(
            `*[_type == "product"] | order(name asc) { ${PRODUCT_PROJECTION} }`
          );
          return { data };
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
    }),
    getAllCategories: builder.query<CategoryMeta[], void>({
      queryFn: async () => {
        try {
          const data = await client.fetch(
            `*[_type == "category"] | order(title asc) {
              "id": slug.current,
              "label": title,
              icon,
              "image": image.asset->url,
              description,
              "count": count(*[_type == "product" && references(^._id)])
            }`
          );
          return { data };
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
    }),
    getFeaturedProducts: builder.query<Product[], void>({
      queryFn: async () => {
        try {
          const data = await client.fetch(
            `*[_type == "product" && featured == true && inStock == true] { ${PRODUCT_PROJECTION} }`
          );
          return { data };
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
    }),
    getProductBySlug: builder.query<Product | null, string>({
      queryFn: async (slug) => {
        try {
          const data = await client.fetch(
            `*[_type == "product" && slug.current == $slug][0] { ${PRODUCT_PROJECTION} }`,
            { slug }
          );
          return { data };
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
    }),
    getRelatedProducts: builder.query<Product[], { categorySlug: string; currentId: string }>({
      queryFn: async ({ categorySlug, currentId }) => {
        try {
          const data = await client.fetch(
            `*[_type == "product" && category->slug.current == $categorySlug && _id != $currentId && inStock == true][0...4] { ${PRODUCT_PROJECTION} }`,
            { categorySlug, currentId }
          );
          return { data };
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetAllCategoriesQuery,
  useGetFeaturedProductsQuery,
  useGetProductBySlugQuery,
  useGetRelatedProductsQuery,
} = sanityApi;
