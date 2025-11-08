import React, { useState } from 'react';
import { ChefHat, Mail, Lock, Eye, EyeOff, Shield, AlertCircle, User, Phone, Building2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';

function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('admin@gastrobi.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const { login, loading, resetPassword } = useAuth();

  // Estados para cadastro
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    restaurantName: '',
    cnpj: '',
    acceptTerms: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (mode === 'login') {
      try {
        await login(email, password, rememberMe);
      } catch (err: any) {
        setError(err.message || 'Erro ao fazer login');
      }
    } else {
      handleSignup();
    }
  };

  const handleSignup = async () => {
    // Validações
    if (!signupData.name || !signupData.email || !signupData.password || !signupData.restaurantName) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (signupData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (!signupData.acceptTerms) {
      setError('Você deve aceitar os termos de uso');
      return;
    }

    // Simular cadastro (em produção seria integrado com Supabase Auth)
    try {
      // Aqui seria a chamada para o Supabase
      alert('Cadastro realizado com sucesso! Verifique seu e-mail para ativar a conta.');
      setMode('login');
      setEmail(signupData.email);
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Digite seu e-mail para recuperar a senha');
      return;
    }
    
    setIsResetting(true);
    try {
      await resetPassword(email);
      setError('');
      alert('E-mail de recuperação enviado com sucesso!');
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar e-mail de recuperação');
    } finally {
      setIsResetting(false);
    }
  };

  const LoginForm = () => (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            E-mail
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Digite seu e-mail"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Digite sua senha"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-600">Lembrar de mim</span>
          </label>
          <button
            type="button"
            onClick={handleResetPassword}
            disabled={isResetting}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            {isResetting ? 'Enviando...' : 'Esqueci minha senha'}
          </button>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Entrando...</span>
            </div>
          ) : (
            'Entrar'
          )}
        </Button>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Não tem uma conta?{' '}
          <button
            onClick={() => setMode('signup')}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Cadastre-se grátis
          </button>
        </p>
      </div>
    </>
  );

  const SignupForm = () => (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {/* Dados Pessoais */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900 border-b pb-2">Dados Pessoais</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome completo *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={signupData.name}
                onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Seu nome completo"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={signupData.phone}
                  onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dados do Restaurante */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900 border-b pb-2">Dados do Restaurante</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do restaurante *
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={signupData.restaurantName}
                onChange={(e) => setSignupData({ ...signupData, restaurantName: e.target.value })}
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nome do seu restaurante"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CNPJ (opcional)
            </label>
            <input
              type="text"
              value={signupData.cnpj}
              onChange={(e) => setSignupData({ ...signupData, cnpj: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="00.000.000/0000-00"
            />
          </div>
        </div>

        {/* Senha */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900 border-b pb-2">Senha de Acesso</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mínimo 6 caracteres"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar senha *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Repita a senha"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Termos */}
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={signupData.acceptTerms}
            onChange={(e) => setSignupData({ ...signupData, acceptTerms: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
            required
          />
          <label htmlFor="acceptTerms" className="text-sm text-gray-600">
            Eu aceito os{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800">termos de uso</a>
            {' '}e{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800">política de privacidade</a>
          </label>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Criando conta...</span>
            </div>
          ) : (
            'Criar conta grátis'
          )}
        </Button>
      </form>

      <div className="text-center mt-6">
        <button
          onClick={() => setMode('login')}
          className="flex items-center justify-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para o login</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo e Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <ChefHat className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">GastroBI+</h1>
          <p className="text-gray-600">
            {mode === 'login' ? 'Sistema de Gestão para Restaurantes' : 'Crie sua conta e comece grátis'}
          </p>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <Shield className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600 font-medium">
              {mode === 'login' ? 'Login Seguro' : 'Cadastro Seguro'}
            </span>
          </div>
        </div>

        {/* Card de Login/Cadastro */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="px-8 pt-8 pb-6">
            {mode === 'login' ? <LoginForm /> : <SignupForm />}
          </div>

          {/* Demo Info - apenas no login */}
          {mode === 'login' && (
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Demo:</strong> Use as credenciais abaixo
                </p>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="text-sm font-mono text-gray-800">admin@gastrobi.com</p>
                  <p className="text-sm font-mono text-gray-800">123456</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-2 gap-4 text-center">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Shield className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">Segurança</p>
            <p className="text-xs text-gray-500">Dados criptografados</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <ChefHat className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">
              {mode === 'login' ? 'Multi-tenant' : 'Teste Grátis'}
            </p>
            <p className="text-xs text-gray-500">
              {mode === 'login' ? 'Múltiplos restaurantes' : '30 dias gratuitos'}
            </p>
          </div>
        </div>

        {/* Benefícios do cadastro */}
        {mode === 'signup' && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-900 mb-3">✨ O que você ganha:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>30 dias de teste gratuito</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Cardápio digital ilimitado</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Sistema de fidelidade</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Campanhas de marketing</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Relatórios avançados</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;