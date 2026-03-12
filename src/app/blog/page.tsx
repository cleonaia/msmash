import { unstable_noStore as noStore } from "next/cache";
import { PageHeader } from "@/components/ui/PageHeader";
import { BlogList, type BlogCardPost } from "@/components/blog/BlogCard";
import { prisma } from "@/lib/prisma";
import { calculateReadingTime, slugify } from "@/lib/utils";

export default async function BlogPage() {
  noStore();

  const posts = await prisma.blogPost.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
    include: { tags: true },
  });

  const formattedPosts: BlogCardPost[] = posts.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    readingTime: calculateReadingTime(post.content),
  }));

  const tags = Array.from(
    new Map(
      posts
        .flatMap((post) => post.tags.map((tag) => tag.name))
        .map((name) => [slugify(name), name] as const),
    ).values(),
  );

  return (
    <div>
      <PageHeader
        title="Blog & Recetas"
        subtitle="Historias, técnicas y maridajes para llevar el ritual del asado a otro nivel"
        backgroundImage="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80"
      />

      <section className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[linear-gradient(150deg,rgba(18,2,0,0.9)_0%,rgba(45,6,0,0.86)_50%,rgba(18,2,0,0.94)_100%)]" aria-hidden />
        <div className="relative">
          {tags.length ? (
            <div className="flex flex-wrap gap-3">
              {tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/15 bg-[rgba(18,2,0,0.6)] px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70">
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-10">
            <BlogList posts={formattedPosts} />
          </div>

          <div className="mt-16 surface-card gradient-border rounded-3xl p-10 text-center text-sm text-white/65">
            {`Actualmente hay ${formattedPosts.length} recetas y artículos publicados. Suscribite al newsletter para enterarte de las novedades.`}
          </div>
        </div>
      </section>
    </div>
  );
}
