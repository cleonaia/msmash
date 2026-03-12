import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { calculateReadingTime, formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";

interface BlogArticlePageProps {
  params: { slug: string };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  noStore();
  const { slug } = params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post || !post.publishedAt) {
    notFound();
  }

  return (
    <article>
      <PageHeader
        title={post.title}
        subtitle={`${formatDate(post.publishedAt)} · ${calculateReadingTime(post.content)}`}
        backgroundImage={post.coverImage}
      />
      <div className="prose prose-invert mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(post.content) }} />
      </div>
    </article>
  );
}

function convertMarkdownToHtml(markdown: string) {
  // Quick formatting for headings and paragraphs to keep dependencies livianas.
  return markdown
    .split("\n\n")
    .map((block) => {
      if (block.startsWith("## ")) {
        return `<h2>${block.replace("## ", "")}</h2>`;
      }
      if (block.startsWith("### ")) {
        return `<h3>${block.replace("### ", "")}</h3>`;
      }
      if (block.startsWith("- ")) {
        const items = block
          .split("\n")
          .map((item) => `<li>${item.replace("- ", "")}</li>`) 
          .join("");
        return `<ul>${items}</ul>`;
      }
      return `<p>${block}</p>`;
    })
    .join("");
}
