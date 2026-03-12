"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { registerSchema } from "@/lib/validation";
import { registerUser } from "@/actions/auth";
import type { RegisterInput } from "@/actions/auth";
import { Button } from "@/components/ui/Button";

type RegisterValues = RegisterInput;

export default function RegisterPage() {
  const router = useRouter();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      marketingOptIn: false,
    },
  });

  const onSubmit = async (values: RegisterValues) => {
    setFeedback(null);

    const result = await registerUser(values);

    if (!result.success) {
      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, message]) => {
          if (message) {
            setError(field as keyof RegisterValues, {
              type: "server",
              message,
            });
          }
        });
      }

      setFeedback({
        type: "error",
        message: result.message,
      });
      return;
    }

    setFeedback({ type: "success", message: "Cuenta creada. Iniciando sesión..." });

    const signInResult = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (signInResult?.error) {
      setFeedback({
        type: "success",
        message: "Cuenta creada. Iniciá sesión con tus credenciales.",
      });
      reset();
      return;
    }

    setFeedback({
      type: "success",
      message: "Cuenta creada y sesión iniciada. Redirigiendo a tu perfil...",
    });
    reset();
    router.push("/cliente");
    router.refresh();
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-[linear-gradient(150deg,rgba(18,2,0,0.9)_0%,rgba(45,6,0,0.86)_55%,rgba(18,2,0,0.94)_100%)] px-4 py-24">
      <div className="w-full max-w-2xl surface-card-strong gradient-border rounded-3xl p-10 shadow-[0_30px_140px_-60px_rgba(227,58,32,0.6)]">
        <div className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-400">Club Quebracho</p>
          <h1 className="text-3xl font-semibold text-white">Creá tu cuenta</h1>
          <p className="text-sm text-white/60">Reservas más rápidas, historial de pedidos y experiencias a medida.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium text-white">
              Nombre
            </label>
            <input
              id="firstName"
              className="w-full rounded-xl border border-white/15 bg-[rgba(18,2,0,0.6)] px-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-none"
              {...register("firstName")}
            />
            {errors.firstName && <p className="text-xs text-red-400">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium text-white">
              Apellido
            </label>
            <input
              id="lastName"
              className="w-full rounded-xl border border-white/15 bg-[rgba(18,2,0,0.6)] px-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-none"
              {...register("lastName")}
            />
            {errors.lastName && <p className="text-xs text-red-400">{errors.lastName.message}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-white">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-xl border border-white/15 bg-[rgba(18,2,0,0.6)] px-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-none"
              {...register("email")}
            />
            {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-white">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-xl border border-white/15 bg-[rgba(18,2,0,0.6)] px-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-none"
              {...register("password")}
            />
            {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="flex items-center gap-3 text-sm text-white/70">
              <input type="checkbox" {...register("marketingOptIn")} className="h-4 w-4 rounded border-white/20 bg-[rgba(18,2,0,0.6)]" />
              Quiero recibir novedades y beneficios exclusivos.
            </label>
          </div>
          <div className="md:col-span-2">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
            {feedback ? (
              <p
                className={`mt-3 text-xs ${
                  feedback.type === "success" ? "text-emerald-300" : "text-red-300"
                }`}
              >
                {feedback.message}
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}
