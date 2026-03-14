import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/features/blog/data/posts";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Novetats — Virutes" };

export default function BlogPage() {
  const [featured, ...rest] = blogPosts;

  return (
    <div>
      {/* ── Header ── */}
      <div className="relative mt-20 h-64 sm:h-80 flex items-end overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=1920&q=80"
          alt="Novetats de Virutes"
          fill className="object-cover" priority sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-virutes-brown/80 via-virutes-brown/30 to-transparent" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <h1 className="font-display text-6xl sm:text-7xl text-white">Novetats</h1>
          <p className="font-serif italic text-white/75 text-lg mt-2">
            Del forn a la paraula. Receptes, històries i actualitat de Virutes.
          </p>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured post */}
        {featured && (
          <Link href={`/blog/${featured.slug}`} className="group block mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-3xl overflow-hidden shadow-sm border border-virutes-border hover:shadow-md transition-shadow duration-300">
              <div className="relative h-72 lg:h-full min-h-[280px] overflow-hidden">
                <Image
                  src={featured.coverImage} alt={featured.title} fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
                <span className="absolute top-4 left-4 text-xs font-bold uppercase tracking-wider bg-virutes-red text-white px-3 py-1 rounded-full">
                  {featured.category}
                </span>
              </div>
              <div className="p-8 lg:p-10 flex flex-col justify-center">
                <p className="text-xs uppercase tracking-wider text-virutes-brown/50 mb-3">
                  {formatDate(featured.publishedAt)} · {featured.readingTime} min lectura
                </p>
                <h2 className="font-serif text-3xl text-virutes-brown leading-tight mb-4 group-hover:text-virutes-red transition-colors">
                  {featured.title}
                </h2>
                <p className="text-virutes-brown/65 leading-relaxed mb-6">{featured.excerpt}</p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-virutes-red group-hover:gap-3 transition-all duration-200">
                  Llegir article →
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* Post grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-virutes-border hover:shadow-md transition-shadow duration-300">
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={post.coverImage} alt={post.title} fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                  <span className="absolute top-3 left-3 text-xs font-bold uppercase tracking-wider bg-virutes-red text-white px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-wider text-virutes-brown/50 mb-2">
                    {formatDate(post.publishedAt)} · {post.readingTime} min
                  </p>
                  <h3 className="font-semibold text-virutes-brown text-lg leading-snug mb-2 group-hover:text-virutes-red transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-virutes-brown/65 leading-relaxed line-clamp-2">{post.excerpt}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
