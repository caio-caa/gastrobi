'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RootPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user?.currentRestaurant?.id) {
        // Usuário autenticado, redirecionar para dashboard
        router.push(`/dashboard/${user.currentRestaurant.id}`);
      } else {
        // Usuário não autenticado, redirecionar para login
        router.push('/login');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando...</p>
      </div>
    </div>
  );
}
    {
      icon: Megaphone,
      title: 'Marketing Inteligente',
      description: 'Campanhas por WhatsApp, e-mail e SMS com segmentação avançada',
    },
    {
      icon: BarChart3,
      title: 'Relatórios Avançados',
      description: 'Analytics completo, métricas de vendas e insights de negócio',
    },
    {
      icon: Users,
      title: 'Gestão de Clientes',
      description: 'CRM completo com histórico, preferências e análise de comportamento',
    },
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Aumente suas vendas em até 40%',
      description: 'Com campanhas direcionadas e programa de fidelidade',
    },
    {
      icon: Clock,
      title: 'Economize 5 horas por dia',
      description: 'Automatize processos e elimine tarefas manuais',
    },
    {
      icon: Heart,
      title: 'Melhore a experiência do cliente',
      description: 'Cardápio digital moderno e atendimento personalizado',
    },
    {
      icon: Target,
      title: 'Decisões baseadas em dados',
      description: 'Relatórios detalhados para otimizar seu negócio',
    },
  ];

  const testimonials = [
    {
      name: 'Maria Silva',
      restaurant: 'Pizzaria Bella Vista',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      text: `Desde que implementamos o ${config.brandName}, nossas vendas aumentaram 35%. O sistema de fidelidade é incrível!`,
      rating: 5,
    },
    {
      name: 'João Santos',
      restaurant: 'Hamburgueria do João',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      text: 'O cardápio digital revolucionou nosso atendimento. Os clientes adoram a praticidade dos QR codes.',
      rating: 5,
    },
    {
      name: 'Ana Costa',
      restaurant: 'Restaurante Sabor & Arte',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      text: 'Os relatórios me ajudam a tomar decisões estratégicas. Agora sei exatamente quais pratos vendem mais.',
      rating: 5,
    },
  ];

  const plans = [
    {
      id: 'basic',
      name: 'Básico',
      price: 47,
      description: 'Ideal para restaurantes pequenos',
      features: [
        'Cardápio digital ilimitado',
        'QR codes para mesas',
        'Sistema POS básico',
        'Até 3 usuários',
        'Até 50 produtos',
        'Relatórios básicos',
        'Suporte por e-mail',
      ],
      highlighted: false,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 97,
      description: 'Mais popular para restaurantes em crescimento',
      features: [
        'Tudo do plano Básico',
        'Sistema POS completo',
        'Programa de fidelidade',
        'Campanhas de marketing',
        'Até 10 usuários',
        'Até 200 produtos',
        'Integração WhatsApp',
        'Relatórios avançados',
        'Suporte prioritário',
      ],
      highlighted: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 197,
      description: 'Para redes e grandes operações',
      features: [
        'Tudo do plano Premium',
        'Múltiplos restaurantes',
        'API personalizada',
        'Usuários ilimitados',
        'Produtos ilimitados',
        'White label',
        'Backup automático',
        'Suporte dedicado',
        'Consultoria estratégica',
      ],
      highlighted: false,
    },
  ];

  const Header = () => (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <WhiteLabelHeader />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Funcionalidades
            </a>
            <a href="#benefits" className="text-gray-600 hover:text-gray-900 transition-colors">
              Benefícios
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
              Preços
            </a>
            <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">
              Depoimentos
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
              Entrar
            </Link>
            <Link href="/login">
              <WhiteLabelButton>Teste Grátis</WhiteLabelButton>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <div className="flex flex-col space-y-4">
              <a
                href="#features"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Funcionalidades
              </a>
              <a
                href="#benefits"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Benefícios
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Preços
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Depoimentos
              </a>
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-100">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Entrar
                </Link>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <WhiteLabelButton className="w-full">Teste Grátis</WhiteLabelButton>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );

  const Hero = () => (
    <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{
                backgroundColor: `${config.primaryColor}20`,
                color: config.primaryColor,
              }}
            >
              <Zap className="w-4 h-4 mr-2" />
              Sistema completo para restaurantes
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Transforme seu
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r"
                style={{
                  backgroundImage: `linear-gradient(to right, ${config.primaryColor}, ${config.secondaryColor})`,
                }}
              >
                {' '}
                restaurante{' '}
              </span>
              em uma máquina de vendas
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              Sistema completo de gestão com cardápio digital, POS, fidelidade, marketing e relatórios. Aumente suas
              vendas em até 40% e economize 5 horas por dia.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/login">
                <WhiteLabelButton size="lg" className="w-full sm:w-auto">
                  Começar teste grátis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </WhiteLabelButton>
              </Link>
              <WhiteLabelButton variant="outline" size="lg" className="w-full sm:w-auto">
                <Play className="w-5 h-5 mr-2" />
                Ver demonstração
              </WhiteLabelButton>
            </div>

            <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>30 dias grátis</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Suporte incluído</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt={`Dashboard do ${config.brandName}`}
                className="rounded-2xl shadow-2xl"
              />
            </div>
            {/* Floating elements */}
            <div
              className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20 animate-pulse"
              style={{ backgroundColor: config.primaryColor }}
            ></div>
            <div
              className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full opacity-20 animate-pulse"
              style={{ backgroundColor: config.secondaryColor }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );

  const Features = () => (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Tudo que seu restaurante precisa</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Uma plataforma completa que integra todas as operações do seu restaurante, desde o cardápio digital até
            relatórios avançados de vendas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 hover:border-blue-500"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${config.primaryColor}20` }}
              >
                <feature.icon className="w-6 h-6" style={{ color: config.primaryColor }} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const Benefits = () => (
    <section id="benefits" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Resultados que você pode medir</h2>
            <p className="text-xl text-gray-600 mb-8">
              Nossos clientes veem resultados reais em poucas semanas. Veja como o {config.brandName} pode transformar
              seu negócio.
            </p>

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${config.primaryColor}20` }}
                  >
                    <benefit.icon className="w-6 h-6" style={{ color: config.primaryColor }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt={`Resultados do ${config.brandName}`}
              className="rounded-2xl shadow-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );

  const Pricing = () => (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Planos que crescem com seu negócio</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Escolha o plano ideal para seu restaurante. Todos incluem 30 dias de teste grátis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-8 rounded-2xl border-2 transition-all duration-300 ${
                plan.highlighted ? 'shadow-xl scale-105' : 'border-gray-100 hover:shadow-lg'
              }`}
              style={{
                borderColor: plan.highlighted ? config.primaryColor : '#e5e7eb',
              }}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span
                    className="text-white px-4 py-2 rounded-full text-sm font-medium"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    Mais Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-900">R$ {plan.price}</span>
                  <span className="text-gray-600 ml-2">/mês</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/login" className="block">
                <WhiteLabelButton className="w-full" variant={plan.highlighted ? 'primary' : 'outline'}>
                  Começar teste grátis
                </WhiteLabelButton>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Precisa de algo personalizado? Entre em contato conosco.</p>
          <WhiteLabelButton variant="outline">
            <Headphones className="w-5 h-5 mr-2" />
            Falar com especialista
          </WhiteLabelButton>
        </div>
      </div>
    </section>
  );

  const Testimonials = () => (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">O que nossos clientes dizem</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Mais de 1.000 restaurantes já transformaram seus negócios com o {config.brandName}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-gray-600 mb-6 italic">&quot;{testimonial.text}&quot;</p>

              <div className="flex items-center space-x-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.restaurant}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const CTA = () => (
    <section
      className="py-20"
      style={{
        background: `linear-gradient(to right, ${config.primaryColor}, ${config.secondaryColor})`,
      }}
    >
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Pronto para transformar seu restaurante?</h2>
        <p className="text-xl text-white/90 mb-8">
          Junte-se a mais de 1.000 restaurantes que já aumentaram suas vendas com o {config.brandName}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login">
            <WhiteLabelButton
              size="lg"
              variant="outline"
              className="bg-white hover:bg-gray-50 w-full sm:w-auto"
              style={{ color: config.primaryColor }}
            >
              Começar teste grátis de 30 dias
              <ArrowRight className="w-5 h-5 ml-2" />
            </WhiteLabelButton>
          </Link>
        </div>

        <p className="text-white/80 text-sm mt-4">Sem cartão de crédito • Configuração em 5 minutos • Suporte incluído</p>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <Benefits />
      <Pricing />
      <Testimonials />
      <CTA />
      <WhiteLabelFooter />
    </div>
  );
}
