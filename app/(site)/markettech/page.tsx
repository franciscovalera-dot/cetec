/**
 * PÁGINA DE MARKETTECH — Artículos de tecnología y mercado
 */
import { getPostsByCategory } from '@/lib/sanity'
import PostCard from '@/components/PostCard'
import PageHero from '@/components/PageHero'

export const revalidate = 60
export const metadata = { title: 'MarketTech' }

export default async function MarketTechPage() {
  const posts = await getPostsByCategory('markettech')

  return (
    <>
      <PageHero
        title="MarketTech"
        description="Tecnología, innovación y tendencias del mercado científico-tecnológico."
        gradient="from-rose-900 to-rose-800"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-20">
            No hay artículos de MarketTech todavía.
          </p>
        )}
      </div>
    </>
  )
}
