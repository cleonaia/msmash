import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import { blogPosts } from "@/features/blog/data/posts";
import { formatDate } from "@/lib/utils";

interface BlogArticlePageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) notFound();

  const relatedPosts = blogPosts.filter((p) => p.id !== post.id).slice(0, 2);

  return (
    <article>
      {/* ── Hero ── */}
      <div className="relative mt-20 h-72 sm:h-96 overflow-hidden">
        <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-virutes-brown/85 via-virutes-brown/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-3xl mx-auto px-4 sm:px-6 pb-10">
          <span className="inline-block bg-virutes-red text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            {post.category}
          </span>
          <h1 className="font-serif font-bold text-3xl sm:text-5xl text-white leading-tight">{post.title}</h1>
          <div className="mt-3 flex items-center gap-4 text-white/70 text-sm">
            <span className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5" /> {post.category}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {post.readingTime} min lectura
            </span>
            <span>{formatDate(post.publishedAt)}</span>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-virutes-brown/60 hover:text-virutes-red transition-colors mb-10">
          <ArrowLeft className="h-4 w-4" /> Tornar a Novetats
        </Link>

        <div
          className="prose prose-stone max-w-none
            prose-headings:font-serif prose-headings:text-virutes-brown
            prose-p:text-virutes-brown/75 prose-p:leading-relaxed
            prose-strong:text-virutes-brown
            prose-li:text-virutes-brown/75
            prose-a:text-virutes-red prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
        />

        {/* Share strip */}
        <div className="mt-14 pt-8 border-t border-virutes-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-virutes-brown/60">
            T&apos;ha agradat? Comparteix-ho!
          </p>
          <div className="flex gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://msmashburger.page/blog/${post.slug}`)}`}
              target="_blank" rel="noreferrer"
              className="text-xs px-4 py-2 rounded-full border border-virutes-border text-virutes-brown hover:border-virutes-red hover:text-virutes-red transition-colors"
            >
              X / Twitter
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://msmashburger.page/blog/${post.slug}`)}`}
              target="_blank" rel="noreferrer"
              className="text-xs px-4 py-2 rounded-full border border-virutes-border text-virutes-brown hover:border-virutes-red hover:text-virutes-red transition-colors"
            >
              Facebook
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(post.title + ' — https://msmashburger.page/blog/' + post.slug)}`}
              target="_blank" rel="noreferrer"
              className="text-xs px-4 py-2 rounded-full bg-[#25D366] text-white hover:bg-[#20b858] transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* ── Related posts ── */}
      {relatedPosts.length > 0 && (
        <section className="surface-cream py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="section-title mb-8">Més articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedPosts.map((rp) => (
                <Link key={rp.id} href={`/blog/${rp.slug}`} className="group flex gap-5 bg-white rounded-2xl overflow-hidden shadow-sm border border-virutes-border hover:shadow-md transition-shadow p-4">
                  <div className="relative w-28 h-24 shrink-0 rounded-xl overflow-hidden">
                    <Image src={rp.coverImage} alt={rp.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="112px" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-virutes-red mb-1">{rp.category}</span>
                    <p className="font-semibold text-virutes-brown leading-snug group-hover:text-virutes-red transition-colors line-clamp-2">{rp.title}</p>
                    <p className="text-xs text-virutes-brown/50 mt-1">{formatDate(rp.publishedAt)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

// ─── Simple markdown → HTML (no external deps) ─────────────────────────────
function renderContent(markdown: string): string {
  return markdown
    .split("\n\n")
    .map((block) => {
      if (block.startsWith("**") && block.endsWith("**")) {
        return `<h3>${block.replace(/\*\*/g, "")}</h3>`;
      }
      if (block.startsWith("- ") || block.startsWith("1. ")) {
        const isOrdered = block.startsWith("1. ");
        const tag = isOrdered ? "ol" : "ul";
        const items = block
          .split("\n")
          .filter(Boolean)
          .map((i) => `<li>${i.replace(/^[-\d.]+\s/, "").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</li>`)
          .join("");
        return `<${tag}>${items}</${tag}>`;
      }
      return `<p>${block.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</p>`;
    })
    .join("");
}
