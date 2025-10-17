import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, User, Lock, Plus, Upload, LogOut, Home, ShoppingBag, Settings, Eye, Trash2, X, Check, Package, CreditCard, Smartphone, Edit3, Save } from 'lucide-react';

// Mock data for products
const initialProducts = [
  {
    id: 1,
    name: 'Manzanas Rojas Premium',
    category: 'frutas',
    price: 2.50,
    description: 'Manzanas frescas y jugosas de cultivo orgánico',
    image: 'https://placehold.co/400x400/ff6b6b/ffffff?text=Manzanas+Premium'
  },
  {
    id: 2,
    name: 'Zanahorias Orgánicas',
    category: 'verduras',
    price: 1.80,
    description: 'Zanahorias cultivadas sin pesticidas',
    image: 'https://placehold.co/400x400/ff9e6d/ffffff?text=Zanahorias+Org'
  },
  {
    id: 3,
    name: 'Ración Premium para Perros',
    category: 'animales',
    price: 15.00,
    description: 'Alimento balanceado con ingredientes naturales',
    image: 'https://placehold.co/400x400/4ecdc4/ffffff?text=Ración+Perros'
  },
  {
    id: 4,
    name: 'Huevos de Campo Frescos',
    category: 'huevos',
    price: 3.20,
    description: 'Huevos de gallinas camperas alimentadas naturalmente',
    image: 'https://placehold.co/400x400/45b7d1/ffffff?text=Huevos+Campo'
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: 'frutas',
    price: '',
    description: '',
    image: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const formRef = useRef(null);

  // Mock user database (simulating localStorage)
  const [users, setUsers] = useState(() => {
    return [
      { id: 1, name: 'Juan Pérez', email: 'juan@example.com', password: '123456', role: 'customer' }
    ];
  });

  const categories = ['all', 'frutas', 'verduras', 'animales', 'huevos', 'otros'];

  // Handle seller login (admin password)
  const handleSellerLogin = (e) => {
    e.preventDefault();
    if (loginData.password === 'admin') {
      setUserRole('seller');
      setCurrentUser({ name: 'Administrador', role: 'seller' });
      setCurrentView('seller');
    } else {
      alert('Contraseña incorrecta. La contraseña para vendedores es "admin"');
    }
  };

  // Handle customer registration
  const handleRegister = (e) => {
    e.preventDefault();
    if (registerData.name && registerData.email && registerData.password) {
      const newUser = {
        id: users.length + 1,
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        role: 'customer'
      };
      setUsers([...users, newUser]);
      setUserRole('customer');
      setCurrentUser(newUser);
      setCurrentView('customer');
      setRegisterData({ name: '', email: '', password: '' });
    }
  };

  // Handle customer login
  const handleCustomerLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => u.email === loginData.username && u.password === loginData.password);
    if (user) {
      setUserRole('customer');
      setCurrentUser(user);
      setCurrentView('customer');
      setLoginData({ username: '', password: '' });
    } else {
      alert('Credenciales incorrectas. Verifica tu email y contraseña.');
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (formData.name && formData.price && formData.description) {
      const newProduct = {
        id: products.length + 1,
        ...formData,
        price: parseFloat(formData.price)
      };
      setProducts([...products, newProduct]);
      setFormData({ name: '', category: 'frutas', price: '', description: '', image: '' });
      setEditMode(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditMode(true);
    setEditingProduct(product.id);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      description: product.description,
      image: product.image
    });
    setCurrentView('seller');
    setUserRole('seller');
    // Scroll to form
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    if (formData.name && formData.price && formData.description) {
      const updatedProducts = products.map(product =>
        product.id === editingProduct
          ? { ...product, ...formData, price: parseFloat(formData.price) }
          : product
      );
      setProducts(updatedProducts);
      setFormData({ name: '', category: 'frutas', price: '', description: '', image: '' });
      setEditMode(false);
      setEditingProduct(null);
    }
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      setProducts(products.filter(product => product.id !== productId));
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const handlePurchase = () => {
    if (cart.length === 0) return;
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`✅ Pedido confirmado con éxito!\n\nProductos: ${cart.map(item => `${item.quantity}x ${item.name}`).join(', ')}\nTotal: $${total.toFixed(2)}\nMétodo de pago: ${paymentMethod === 'cash' ? 'Efectivo' : paymentMethod === 'transfer' ? 'Transferencia' : 'Mercado Pago'}\n\nEl vendedor ha sido notificado y preparará su pedido.`);
    setCart([]);
    setIsCartOpen(false);
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentUser(null);
    setCurrentView('home');
    setCart([]);
    setIsCartOpen(false);
    setEditMode(false);
    setEditingProduct(null);
    setLoginData({ username: '', password: '' });
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Puesto Don Juan
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {userRole === 'customer' && (
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-xl transition-colors duration-200"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            )}
            
            {userRole && (
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Minimal Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-gray-800 shadow-2xl transform transition-transform duration-300">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h2 className="text-lg font-bold flex items-center space-x-2">
                  <ShoppingCart className="w-4 h-4 text-emerald-400" />
                  <span>Carrito ({cartItemsCount})</span>
                </h2>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Carrito vacío</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center space-x-3 bg-gray-700/30 rounded-lg p-3">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-emerald-400 text-sm font-bold">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 bg-gray-600 hover:bg-gray-500 rounded flex items-center justify-center text-xs"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 bg-gray-600 hover:bg-gray-500 rounded flex items-center justify-center text-xs"
                          >
                            +
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 hover:bg-red-500/20 rounded text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {cart.length > 0 && (
                <div className="border-t border-gray-700 p-4">
                  <div className="flex justify-between text-sm font-semibold mb-3">
                    <span>Total:</span>
                    <span className="text-emerald-400">${cartTotal.toFixed(2)}</span>
                  </div>
                  
                  <button
                    onClick={handlePurchase}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium py-2.5 rounded-lg transition-all duration-200 text-sm"
                  >
                    Confirmar Pedido
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        {/* Home View */}
        {currentView === 'home' && (
          <div className="text-center max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-4">
                Bienvenido a Puesto Don Juan
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Frutas, verduras, huevos frescos y raciones para animales de la mejor calidad
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
                <button
                  onClick={() => setCurrentView('seller-login')}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 border border-gray-600 hover:border-emerald-500 flex items-center justify-center space-x-2 group"
                >
                  <Lock className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <span>Vendedor</span>
                </button>
                
                <button
                  onClick={() => setCurrentView('customer-login')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group"
                >
                  <User className="w-4 h-4" />
                  <span>Iniciar Sesión</span>
                </button>
                
                <button
                  onClick={() => setCurrentView('register')}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group"
                >
                  <Plus className="w-4 h-4" />
                  <span>Registrarse</span>
                </button>
              </div>
            </div>

            {/* Product Preview */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
              <h3 className="text-2xl font-bold text-white mb-6">Productos Destacados</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {initialProducts.slice(0, 4).map((product) => (
                  <div key={product.id} className="text-center group">
                    <div className="relative overflow-hidden rounded-xl mb-3">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <h4 className="font-semibold text-white text-sm mb-1">{product.name}</h4>
                    <p className="text-emerald-400 font-bold text-lg">${product.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Seller Login View */}
        {currentView === 'seller-login' && (
          <div className="max-w-md mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center space-x-2">
                <Lock className="w-6 h-6 text-emerald-400" />
                <span>Entrada Vendedor</span>
              </h2>
              <form onSubmit={handleSellerLogin}>
                <div className="mb-6">
                  <label className="block text-gray-300 mb-2">Contraseña</label>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 rounded-xl transition-all duration-200"
                >
                  Ingresar como Vendedor
                </button>
              </form>
              <button
                onClick={() => setCurrentView('home')}
                className="w-full mt-4 text-emerald-400 hover:text-emerald-300 font-medium flex items-center justify-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Volver al inicio</span>
              </button>
            </div>
          </div>
        )}

        {/* Customer Login View */}
        {currentView === 'customer-login' && (
          <div className="max-w-md mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center space-x-2">
                <User className="w-6 h-6 text-blue-400" />
                <span>Iniciar Sesión</span>
              </h2>
              <form onSubmit={handleCustomerLogin}>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={loginData.username}
                    onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-300 mb-2">Contraseña</label>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-200"
                >
                  Iniciar Sesión
                </button>
              </form>
              <div className="mt-4 text-center">
                <p className="text-gray-400 text-sm mb-2">¿No tienes cuenta?</p>
                <button
                  onClick={() => setCurrentView('register')}
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  Regístrate aquí
                </button>
              </div>
              <button
                onClick={() => setCurrentView('home')}
                className="w-full mt-4 text-gray-400 hover:text-gray-300 font-medium flex items-center justify-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Volver al inicio</span>
              </button>
            </div>
          </div>
        )}

        {/* Register View */}
        {currentView === 'register' && (
          <div className="max-w-md mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center space-x-2">
                <User className="w-6 h-6 text-emerald-400" />
                <span>Registro de Cliente</span>
              </h2>
              <form onSubmit={handleRegister}>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Nombre Completo</label>
                  <input
                    type="text"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-300 mb-2">Contraseña</label>
                  <input
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 rounded-xl transition-all duration-200"
                >
                  Registrarse
                </button>
              </form>
              <div className="mt-4 text-center">
                <p className="text-gray-400 text-sm mb-2">¿Ya tienes cuenta?</p>
                <button
                  onClick={() => setCurrentView('customer-login')}
                  className="text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  Inicia sesión aquí
                </button>
              </div>
              <button
                onClick={() => setCurrentView('home')}
                className="w-full mt-4 text-gray-400 hover:text-gray-300 font-medium flex items-center justify-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Volver al inicio</span>
              </button>
            </div>
          </div>
        )}

        {/* Seller View */}
        {currentView === 'seller' && userRole === 'seller' && (
          <div className="space-y-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6" ref={formRef}>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                {editMode ? (
                  <>
                    <Edit3 className="w-6 h-6 text-emerald-400" />
                    <span>Editar Producto</span>
                  </>
                ) : (
                  <>
                    <Settings className="w-6 h-6 text-emerald-400" />
                    <span>Panel del Vendedor</span>
                  </>
                )}
              </h2>
              
              <form onSubmit={editMode ? handleUpdateProduct : handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Nombre del Producto</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Precio ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  >
                    {categories.slice(1).map(category => (
                      <option key={category} value={category} className="bg-gray-800 text-white">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Descripción</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    rows="3"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">URL de Imagen (opcional)</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center space-x-2"
                  >
                    {editMode ? (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Actualizar Producto</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        <span>Agregar Producto</span>
                      </>
                    )}
                  </button>
                  
                  {editMode && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditMode(false);
                        setEditingProduct(null);
                        setFormData({ name: '', category: 'frutas', price: '', description: '', image: '' });
                      }}
                      className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Current Products List */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Productos Actuales ({products.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <div key={product.id} className="border border-gray-600 rounded-xl p-5 bg-gray-700/30 hover:border-emerald-500/50 transition-all duration-200 relative">
                    <div className="relative overflow-hidden rounded-lg mb-4">
                      <img 
                        src={product.image || 'https://placehold.co/300x300/374151/9ca3af?text=Sin+Imagen'} 
                        alt={product.name}
                        className="w-full h-40 object-cover"
                      />
                      {/* Action buttons positioned below the image */}
                      <div className="absolute bottom-2 right-2 flex space-x-1 bg-black/70 backdrop-blur-sm rounded-lg p-1">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-1.5 bg-emerald-600 hover:bg-emerald-700 rounded text-white transition-colors"
                          title="Editar"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1.5 bg-red-600 hover:bg-red-700 rounded text-white transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-semibold text-white mb-2 text-sm">{product.name}</h4>
                    <p className="text-gray-300 text-xs mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-emerald-400">${product.price.toFixed(2)}</span>
                      <span className="text-xs text-gray-400 bg-gray-600 px-2 py-1 rounded capitalize">
                        {product.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Product Button - Long and Eye-catching */}
            {!editMode && (
              <div className="text-center">
                <button
                  onClick={() => {
                    setEditMode(false);
                    setEditingProduct(null);
                    setFormData({ name: '', category: 'frutas', price: '', description: '', image: '' });
                    if (formRef.current) {
                      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="w-full max-w-2xl mx-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
                >
                  <Plus className="w-6 h-6" />
                  <span className="text-lg">Agregar Nuevo Producto</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Customer View */}
        {currentView === 'customer' && userRole === 'customer' && (
          <div className="space-y-8">
            {/* Welcome Message */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
              <h2 className="text-xl font-bold text-white mb-2">¡Hola, {currentUser?.name}!</h2>
              <p className="text-gray-300">Bienvenido de nuevo a Puesto Don Juan</p>
            </div>

            {/* Category Filter */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                <ShoppingBag className="w-6 h-6 text-emerald-400" />
                <span>Nuestros Productos</span>
              </h2>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                    }`}
                  >
                    {category === 'all' ? 'Todos' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-gray-800/30 border border-gray-700 rounded-xl p-5 hover:border-emerald-500/30 hover:shadow-xl transition-all duration-300 group">
                    <div className="relative overflow-hidden rounded-lg mb-3">
                      <img 
                        src={product.image || 'https://placehold.co/400x400/374151/9ca3af?text=Producto'} 
                        alt={product.name}
                        className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="text-base font-semibold text-white mb-1">{product.name}</h3>
                    <p className="text-gray-300 text-sm mb-2 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-emerald-400">${product.price.toFixed(2)}</span>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white p-1.5 rounded transition-all duration-200 transform hover:scale-105"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-800 border-t border-gray-700 py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded flex items-center justify-center">
              <ShoppingBag className="w-3 h-3 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Puesto Don Juan</span>
          </div>
          <p className="text-gray-400 text-sm">Frutas, verduras y productos frescos de calidad</p>
          <p className="text-gray-500 text-xs mt-1">© 2024 Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  );
}