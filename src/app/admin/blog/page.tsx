import { unstable_noStore as noStore } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { CreatePostForm } from "@/components/admin/blog/CreatePostForm";
import { BlogPostEditor, type AdminBlogPost } from "@/components/admin/blog/BlogPostEditor";

export default async function AdminBlogPage() {
  noStore();

  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center text-white/70">
        <h1 className="text-3xl font-semibold text-white">Necesitás iniciar sesión</h1>
        <p className="max-w-md text-sm">
          Ingresá con tu cuenta de Quebracho para gestionar el contenido del blog.
        </p>
        <Button href="/auth/ingresar">Ir a iniciar sesión</Button>
      </div>
    );
  }

  if (session.user?.role !== "ADMIN") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center text-white/70">
        <h1 className="text-3xl font-semibold text-white">Acceso restringido</h1>
        <p className="max-w-md text-sm">
          Este panel es exclusivo para el equipo de Quebracho. Si necesitás acceso, contactá al administrador.
        </p>
        <Button href="/">Volver al inicio</Button>
      </div>
    );
  }

  const posts = await prisma.blogPost.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      tags: true,
    },
  });

  const adminPosts: AdminBlogPost[] = posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    content: post.content,
    tags: post.tags.map((tag) => tag.name),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
  }));

  const publishedCount = adminPosts.filter((post) => Boolean(post.publishedAt)).length;
  const draftCount = adminPosts.length - publishedCount;

  return (
    <div className="space-y-10 px-4 py-24 sm:px-6 lg:px-8">
      <header className="mx-auto max-w-5xl text-white">
        <p className="text-xs uppercase tracking-[0.35em] text-amber-400">Contenido</p>
        <h1 className="mt-3 text-3xl font-semibold">Blog & Recetas</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/70">
          Creá y editá artículos para mantener vivo el relato parrillero. Podés guardar borradores, programar publicaciones instantáneas y actualizar imágenes.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-xs text-white/65">
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">
            Publicados: {publishedCount}
          </span>
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">
            Borradores: {draftCount}
          </span>
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">
            Total: {adminPosts.length}
          </span>
        </div>
      </header>

      <CreatePostForm />

      <section className="mx-auto grid max-w-5xl gap-8">
        {adminPosts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-sm text-white/60">
            Todavía no hay artículos cargados. Subí el primero usando el formulario superior.
          </div>
        ) : (
          adminPosts.map((post) => <BlogPostEditor key={post.id} post={post} />)
        )}
      </section>
    </div>
  );
}
