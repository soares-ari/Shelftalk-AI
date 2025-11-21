// frontend/src/app/page.tsx
"use client";

import Link from "next/link";
import { 
  Sparkles, 
  Zap, 
  Shield, 
  Clock,
  Instagram,
  Music,
  Facebook,
  Image as ImageIcon,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800/50 backdrop-blur-sm sticky top-0 z-50 bg-slate-950/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              ShelfTalk AI
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-emerald-500 text-black rounded-md hover:bg-emerald-400 transition-colors text-sm font-medium"
            >
              Começar Grátis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-full text-sm">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">Powered by GPT-4o-mini Vision</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Crie conteúdo para{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                e-commerce
              </span>
              <br />
              em segundos
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              IA multimodal que analisa suas imagens e gera títulos SEO, descrições 
              e posts para redes sociais automaticamente.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/register"
                className="group px-8 py-4 bg-emerald-500 text-black rounded-lg hover:bg-emerald-400 transition-all font-semibold flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-105"
              >
                Começar Agora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 transition-colors font-semibold border border-slate-700"
              >
                Ver Demo
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl font-bold text-emerald-400">7</div>
                <div className="text-sm text-slate-500">Tipos de Conteúdo</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-400">~5s</div>
                <div className="text-sm text-slate-500">Tempo de Geração</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-400">4</div>
                <div className="text-sm text-slate-500">Redes Sociais</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 border-t border-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Tudo que você precisa
            </h2>
            <p className="text-slate-400 text-lg">
              IA avançada que entende seus produtos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="group p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-emerald-500/50 transition-all hover:shadow-lg hover:shadow-emerald-500/10">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Vision AI</h3>
              <p className="text-slate-400 text-sm">
                Análise automática de imagens extrai cores, materiais e características visuais
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-emerald-500/50 transition-all hover:shadow-lg hover:shadow-emerald-500/10">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ultra Rápido</h3>
              <p className="text-slate-400 text-sm">
                Geração paralela de 7 conteúdos em apenas 5 segundos
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-emerald-500/50 transition-all hover:shadow-lg hover:shadow-emerald-500/10">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Seguro</h3>
              <p className="text-slate-400 text-sm">
                Autenticação JWT, validação rigorosa e seus dados sempre privados
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-emerald-500/50 transition-all hover:shadow-lg hover:shadow-emerald-500/10">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Histórico</h3>
              <p className="text-slate-400 text-sm">
                Todas as gerações são salvas e podem ser acessadas a qualquer momento
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Types Section */}
      <section className="py-20 md:py-32 border-t border-slate-800/50 bg-gradient-to-b from-transparent to-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              7 tipos de conteúdo
            </h2>
            <p className="text-slate-400 text-lg">
              Um clique, múltiplos formatos otimizados
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Content Type 1 */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold">Título SEO</h3>
              </div>
              <p className="text-sm text-slate-400">
                Otimizado para mecanismos de busca, até 80 caracteres
              </p>
            </div>

            {/* Content Type 2 */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold">Descrição Longa</h3>
              </div>
              <p className="text-sm text-slate-400">
                2-4 parágrafos detalhados com foco em benefícios
              </p>
            </div>

            {/* Content Type 3 */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold">Tags</h3>
              </div>
              <p className="text-sm text-slate-400">
                Palavras-chave relevantes para indexação
              </p>
            </div>

            {/* Content Type 4 */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <Instagram className="w-5 h-5 text-pink-400" />
                <h3 className="font-semibold">Post Instagram</h3>
              </div>
              <p className="text-sm text-slate-400">
                Tom aspiracional com hashtags e emojis
              </p>
            </div>

            {/* Content Type 5 */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <Music className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold">Post TikTok</h3>
              </div>
              <p className="text-sm text-slate-400">
                Linguagem jovem e dinâmica com CTAs
              </p>
            </div>

            {/* Content Type 6 */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <Facebook className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold">Post Facebook</h3>
              </div>
              <p className="text-sm text-slate-400">
                Storytelling conversacional para público amplo
              </p>
            </div>

            {/* Content Type 7 */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-3">
                <ImageIcon className="w-5 h-5 text-red-400" />
                <h3 className="font-semibold">Post Pinterest</h3>
              </div>
              <p className="text-sm text-slate-400">
                Inspiração e descoberta visual
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-32 border-t border-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Como funciona
            </h2>
            <p className="text-slate-400 text-lg">
              Simples, rápido e eficiente
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="relative">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-2xl font-bold text-white">
                  1
                </div>
                <h3 className="text-xl font-semibold">Faça Upload</h3>
                <p className="text-slate-400">
                  Cadastre seu produto com nome, descrição e imagem
                </p>
              </div>
              {/* Connector */}
              <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gradient-to-r from-emerald-500 to-transparent"></div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-2xl font-bold text-white">
                  2
                </div>
                <h3 className="text-xl font-semibold">IA Analisa</h3>
                <p className="text-slate-400">
                  Vision AI extrai características e gera conteúdo otimizado
                </p>
              </div>
              {/* Connector */}
              <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gradient-to-r from-emerald-500 to-transparent"></div>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-2xl font-bold text-white">
                3
              </div>
              <h3 className="text-xl font-semibold">Copie e Use</h3>
              <p className="text-slate-400">
                7 conteúdos prontos em ~5 segundos para copiar
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 border-t border-slate-800/50 bg-slate-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Construído com tecnologias modernas
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 max-w-4xl mx-auto">
            <div className="px-6 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-sm font-medium">
              Next.js 16
            </div>
            <div className="px-6 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-sm font-medium">
              NestJS
            </div>
            <div className="px-6 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-sm font-medium">
              PostgreSQL
            </div>
            <div className="px-6 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-sm font-medium">
              TypeScript
            </div>
            <div className="px-6 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-sm font-medium">
              OpenAI GPT-4o-mini
            </div>
            <div className="px-6 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-sm font-medium">
              Tailwind CSS
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-32 border-t border-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8 p-12 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-2xl border border-emerald-500/20">
            <h2 className="text-3xl md:text-5xl font-bold">
              Pronto para começar?
            </h2>
            <p className="text-lg text-slate-300">
              Crie conteúdo profissional para seu e-commerce em segundos
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="px-8 py-4 bg-emerald-500 text-black rounded-lg hover:bg-emerald-400 transition-all font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-105"
              >
                Começar Agora - É Grátis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-slate-300">ShelfTalk AI</span>
            </div>
            <p className="text-sm text-slate-500">
              © 2025 ShelfTalk AI. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}