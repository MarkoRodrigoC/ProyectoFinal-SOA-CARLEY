import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Box,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Eye,
  EyeOff,
  FileText,
  Home,
  LifeBuoy,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Package,
  Search,
  Settings,
  Shield,
  ShoppingCart,
  Truck,
  UserRound,
  Warehouse
} from 'lucide-react';
import carleyLogo from './assets/carley-logo.png';
import './styles.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000
});

function decodeJwt(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch (error) {
    return null;
  }
}

function useSession() {
  const [token, setToken] = useState(() => localStorage.getItem('carley_token') || '');
  const identity = useMemo(() => (token ? decodeJwt(token) : null), [token]);

  const saveToken = (nextToken) => {
    localStorage.setItem('carley_token', nextToken);
    setToken(nextToken);
  };

  const logout = () => {
    localStorage.removeItem('carley_token');
    setToken('');
  };

  return { token, identity, saveToken, logout };
}

function useApi(token) {
  return useMemo(() => ({
    async login(credentials) {
      const response = await api.post('/api/auth/login', credentials);
      return response.data;
    },
    async getInventory(sku) {
      const response = await api.get(`/api/inventario/buscar/${encodeURIComponent(sku)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    async getInventoryList() {
      const response = await api.get('/api/inventario', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    async getOrders() {
      const response = await api.get('/api/pedidos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    async registerOrder(payload) {
      const response = await api.post('/api/pedidos/registrar', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    async confirmDelivery(payload) {
      const response = await api.post('/api/transporte/confirmar-entrega', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    }
  }), [token]);
}

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const client = useApi('');

  async function submit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await client.login({ username, password });
      onLogin(result.accessToken);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'No se pudo iniciar sesion.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-shell">
      <section className="login-brand-panel">
        <div className="brand-lockup">
          <img className="brand-logo" src={carleyLogo} alt="Carley" />
          <div>
            <strong>CARLEY</strong>
            <span>Sistema de Gestion Logistica</span>
          </div>
        </div>

        <div className="status-pill">
          <span />
          Sistema operativo · En vivo
        </div>

        <div className="login-copy">
          <h1>Logistica inteligente <strong>a tu alcance</strong></h1>
          <p>Monitorea tu flota en tiempo real, gestiona inventarios y optimiza cada ruta desde un solo panel de control.</p>
        </div>

        <div className="truck-card" aria-hidden="true">
          <div className="route-panel">
            <span>Ruta activa</span>
            <strong>Lima - A cualquier provincia</strong>
          </div>
          <div className="route-dots" />
          <div className="road-line road-line-one" />
          <div className="road-line road-line-two" />
          <div className="truck-body">
            <div className="truck-trailer">
              <img src={carleyLogo} alt="" />
            </div>
            <div className="truck-cabin">
              <span className="truck-window" />
              <span className="truck-grill" />
            </div>
            <div className="truck-shadow" />
            <div className="wheel wheel-one"><span /></div>
            <div className="wheel wheel-two"><span /></div>
            <div className="wheel wheel-three"><span /></div>
          </div>
          <div className="location-pin" />
        </div>
      </section>

      <section className="login-form-panel">
        <form className="login-form" onSubmit={submit}>
          <div>
            <h2>Iniciar sesion</h2>
            <p>Accede al panel de administracion con tus credenciales corporativas.</p>
          </div>

          <label>
            Correo electronico
            <div className="input-shell">
              <Mail size={18} />
              <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="usuario@grupocarley.pe" />
            </div>
          </label>

          <label>
            Contrasena
            <div className="input-shell">
              <Lock size={18} />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} />
              <button type="button" className="icon-button ghost" onClick={() => setShowPassword((value) => !value)} aria-label="Mostrar contrasena">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <div className="login-row">
            <label className="check-row">
              <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
              Recordar sesion
            </label>
            <button type="button" className="link-button">Olvidaste tu contrasena?</button>
          </div>

          {error ? <div className="form-error">{error}</div> : null}

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar al sistema'}
            <ChevronRight size={18} />
          </button>

          <div className="divider"><span>acceso corporativo</span></div>

          <button className="sso-button" type="button">
            <Shield size={18} />
            Acceso con SSO Corporativo
          </button>
        </form>
      </section>
    </main>
  );
}

const navigation = [
  { id: 'dashboard', label: 'Inicio', icon: Home },
  { id: 'products', label: 'Catalogo de Productos', icon: Box },
  { id: 'inventory', label: 'Inventario', icon: Warehouse },
  { id: 'orders', label: 'Pedidos', icon: ShoppingCart },
  { id: 'transport', label: 'Transporte / Flota', icon: Truck },
  { id: 'billing', label: 'Facturacion', icon: FileText },
  { id: 'reports', label: 'Reportes', icon: BarChart3 },
  { id: 'settings', label: 'Configuracion', icon: Settings }
];

function AppShell({ token, identity, onLogout }) {
  const [active, setActive] = useState('dashboard');
  const client = useApi(token);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img className="sidebar-logo" src={carleyLogo} alt="Carley" />
          <div>
            <strong>Grupo Carley</strong>
            <span>Dashboard Administrativo</span>
          </div>
        </div>

        <nav className="nav-list">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} className={`nav-item ${active === item.id ? 'active' : ''}`} onClick={() => setActive(item.id)}>
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="support-card">
          <strong>Ayuda & Soporte</strong>
          <span>Necesitas asistencia tecnica?</span>
          <a
            href="https://wa.me/51927442969?text=Hola%20Frank%20Alexzander%20Paraguay%2C%20necesito%20soporte%20con%20el%20sistema%20CARLEY."
            target="_blank"
            rel="noreferrer"
          >
            Contactar Soporte
          </a>
        </div>
      </aside>

      <section className="content-shell">
        <header className="topbar">
          <div className="top-actions">
            <button className="icon-button notification" aria-label="Notificaciones">
              <Bell size={20} />
              <span>3</span>
            </button>
            <button className="user-chip" type="button">
              <UserRound size={18} />
              {identity?.role || 'ADMINISTRADOR'}
            </button>
            <button className="icon-button" onClick={onLogout} aria-label="Cerrar sesion">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <main className="page-content">
          {active === 'dashboard' && <DashboardPage client={client} />}
          {active === 'products' && <ProductsPage client={client} />}
          {active === 'inventory' && <InventoryPage client={client} />}
          {active === 'orders' && <OrdersPage client={client} />}
          {active === 'transport' && <TransportPage client={client} />}
          {active === 'billing' && <PlaceholderPage title="Facturacion" description="Modulo reservado para la integracion SUNAT de la Fase 6." icon={FileText} />}
          {active === 'reports' && <PlaceholderPage title="Reportes" description="Indicadores operativos consolidados para direccion logistica." icon={BarChart3} />}
          {active === 'settings' && <PlaceholderPage title="Configuracion" description="Parametros de operacion, roles y preferencias del sistema." icon={Settings} />}
        </main>
      </section>
    </div>
  );
}

function DashboardPage({ client }) {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    Promise.allSettled([client.getOrders(), client.getInventoryList()]).then(([ordersResult, inventoryResult]) => {
      if (ordersResult.status === 'fulfilled') {
        setOrders(ordersResult.value.orders || []);
      }
      if (inventoryResult.status === 'fulfilled') {
        setProducts(inventoryResult.value.products || []);
      }
    });
  }, [client]);

  const lowStock = products.filter((product) => product.stock.available > 0 && product.stock.available < 20).length;
  const criticalStock = products.filter((product) => product.stock.available === 0).length;
  const activeInventoryPercent = products.length
    ? Math.round((products.filter((item) => item.stock.available > 0).length / products.length) * 100)
    : 0;

  return (
    <div className="page-stack">
      <section className="dashboard-hero">
        <div>
          <span>Centro de control logistico</span>
          <h1>Dashboard Principal</h1>
          <p>Monitoreo ejecutivo de pedidos, inventario y entregas para la operacion CARLEY.</p>
        </div>
        <div className="hero-status">
          <strong>Sistema operativo</strong>
          <span><i className="dot green" /> Servicios activos</span>
        </div>
      </section>

      <section className="metric-grid">
        <MetricCard label="Pedidos Registrados" value={orders.length} helper="Persistidos en PostgreSQL" tone="blue" icon={ClipboardList} />
        <MetricCard label="Productos Catalogados" value={products.length || '--'} helper="Sede Santa Clara" tone="green" icon={Package} />
        <MetricCard label="Camiones Disponibles" value="50" helper="Flota operativa nacional" tone="orange" icon={Truck} />
        <MetricCard label="Alertas de Stock" value={lowStock + criticalStock} helper={`${criticalStock} agotados`} tone="red" icon={AlertTriangle} />
      </section>

      <section className="dashboard-grid">
        <div className="panel map-panel">
          <PanelTitle icon={MapPin} title="Cobertura de Distribucion" />
          <div className="map-canvas">
            <div className="route-info-card">
              <span>Ruta activa</span>
              <strong>Lima - Ica - Arequipa</strong>
              <small>ETA 18:00 · 78% completado</small>
            </div>
            <span className="route-node origin"><i />Lima</span>
            <span className="route-node checkpoint"><i />Ica</span>
            <span className="route-node destination"><i />Arequipa</span>
            <div className="route-line route-line-one" />
            <div className="route-line route-line-two" />
            <div className="route-progress route-progress-one" />
            <div className="route-progress route-progress-two" />
            <div className="truck-marker">
              <Truck size={18} />
            </div>
          </div>
        </div>

        <div className="panel">
          <PanelTitle title="Resumen de Operaciones" />
          <ProgressRow label="Disponibilidad de Inventario" value={`${activeInventoryPercent}%`} percent={activeInventoryPercent} color="green" />
          <ProgressRow label="Pedidos Procesados" value={`${orders.length}`} percent={Math.min(100, orders.length * 12)} color="blue" />
          <ProgressRow label="Stock en Riesgo" value={`${lowStock + criticalStock}`} percent={Math.min(100, (lowStock + criticalStock) * 8)} color="orange" />
          <div className="next-deliveries">
            <strong>Actividad Reciente</strong>
            <span><i className="dot green" /> Inventario sincronizado con PostgreSQL</span>
            <span><i className="dot blue" /> Gateway protegiendo rutas por JWT</span>
            <span><i className="dot orange" /> RabbitMQ listo para eventos de entrega</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductsPage({ client }) {
  return (
    <InventoryTablePage
      client={client}
      title="Catalogo de Productos"
      subtitle="Consulta productos sincronizados con el inventario logistico"
      mode="products"
    />
  );
}

function InventoryPage({ client }) {
  return (
    <InventoryTablePage
      client={client}
      title="Inventario"
      subtitle="Stock fisico y disponible de la sede Santa Clara"
      mode="inventory"
    />
  );
}

function InventoryTablePage({ client, title, subtitle, mode }) {
  const [rows, setRows] = useState([]);
  const [sku, setSku] = useState('SKU123ABC');
  const [skuFilter, setSkuFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadProducts() {
    setError('');
    setLoading(true);
    try {
      const result = await client.getInventoryList();
      setRows(result.products || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'No se pudo cargar el inventario.');
    } finally {
      setLoading(false);
    }
  }

  async function searchStock(targetSku) {
    setError('');
    const normalizedSku = targetSku.trim().toUpperCase();
    if (!normalizedSku) {
      setSkuFilter('');
      return;
    }

    try {
      const result = await client.getInventory(normalizedSku);
      setRows((current) => {
        const next = current.filter((item) => item.sku !== result.sku);
        return [result, ...next];
      });
      setSku(result.sku);
      setSkuFilter(result.sku);
      setSelectedCategory('Todas');
    } catch (requestError) {
      setSkuFilter('');
      setError(requestError.response?.data?.message || 'No se encontro el SKU.');
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(rows.map((item) => inferCategory(item.productName)));
    return ['Todas', ...Array.from(uniqueCategories).sort((first, second) => first.localeCompare(second))];
  }, [rows]);

  const visibleRows = useMemo(() => {
    return rows
      .filter((item) => selectedCategory === 'Todas' || inferCategory(item.productName) === selectedCategory)
      .filter((item) => !skuFilter || item.sku.toUpperCase() === skuFilter)
      .sort((first, second) => {
        const categoryOrder = inferCategory(first.productName).localeCompare(inferCategory(second.productName));
        return categoryOrder || first.productName.localeCompare(second.productName);
      });
  }, [rows, selectedCategory, skuFilter]);

  return (
    <div className="page-stack">
      <PageHeading title={title} subtitle={subtitle} />

      <div className="toolbar-panel">
        <div className="input-shell compact">
          <Search size={18} />
          <input
            value={sku}
            onChange={(event) => setSku(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                searchStock(sku);
              }
            }}
            placeholder="SKU123ABC"
          />
        </div>
        <label className="select-shell">
          Categoria
          <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </label>
        <button className="primary-button small" onClick={() => searchStock(sku)} type="button">Buscar SKU</button>
      </div>

      {skuFilter ? (
        <div className="active-filter">
          <span>Mostrando SKU {skuFilter}</span>
          <button type="button" onClick={() => setSkuFilter('')}>Ver todos</button>
        </div>
      ) : null}

      {error ? <div className="form-error">{error}</div> : null}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Imagen</th>
              <th>SKU</th>
              <th>Nombre del Producto</th>
              <th>Categoria</th>
              <th>Stock Actual</th>
              <th>Estado</th>
              <th>Ubicacion</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7"><div className="empty-state">Cargando productos...</div></td>
              </tr>
            ) : null}
            {visibleRows.map((item) => {
              const status = item.stock.available === 0 ? 'Agotado' : item.stock.available < 20 ? 'Stock Bajo' : 'Disponible';
              return (
                <tr key={item.sku}>
                  <td><div className="product-icon"><Box size={21} /></div></td>
                  <td>{item.sku}</td>
                  <td>{item.productName}</td>
                  <td><span className="tag">{mode === 'products' ? inferCategory(item.productName) : item.site}</span></td>
                  <td>
                    <div className="stock-cell">
                      <span className={`dot ${status === 'Disponible' ? 'green' : status === 'Agotado' ? 'red' : 'orange'}`} />
                      <strong>{item.stock.available}</strong>
                      <span>/ {item.stock.physical}</span>
                    </div>
                    <div className="stock-bar"><span style={{ width: `${Math.min(100, (item.stock.available / Math.max(item.stock.physical, 1)) * 100)}%` }} /></div>
                  </td>
                  <td><span className={`status-badge ${status === 'Disponible' ? 'ok' : status === 'Agotado' ? 'danger' : 'warning'}`}>{status}</span></td>
                  <td>Santa Clara</td>
                </tr>
              );
            })}
            {!loading && visibleRows.length === 0 ? (
              <tr>
                <td colSpan="7"><div className="empty-state">No hay productos registrados</div></td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrdersPage({ client }) {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('');
  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pendingItems, setPendingItems] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  async function refreshOrders() {
    const result = await client.getOrders();
    setOrders(result.orders || []);
  }

  async function registerOrder() {
    setStatus('');
    if (pendingItems.length === 0) {
      setStatus('Agrega al menos un producto antes de registrar el pedido.');
      return;
    }

    try {
      const result = await client.registerOrder({
        customer: {
          customerId: 'CLI-1001',
          name: 'Cliente Industrial Santa Clara',
          documentNumber: '20600111222'
        },
        order: {
          externalReference: `OC-${Date.now()}`,
          currency: 'PEN'
        },
        items: pendingItems.map((item) => ({ sku: item.sku, quantity: item.quantity }))
      });
      setStatus(`Pedido registrado: ${result.orderId}`);
      setPendingItems([]);
      setSku('');
      setQuantity('');
      await refreshOrders();
    } catch (requestError) {
      setStatus(requestError.response?.data?.message || 'No se pudo registrar el pedido.');
    }
  }

  async function addProduct() {
    setStatus('');
    const normalizedSku = sku.trim().toUpperCase();
    const parsedQuantity = Number(quantity);

    if (!normalizedSku) {
      setStatus('Ingresa el SKU del producto.');
      return;
    }

    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      setStatus('Ingresa una cantidad valida mayor a cero.');
      return;
    }

    try {
      const product = await client.getInventory(normalizedSku);
      if (product.stock.available < parsedQuantity) {
        setStatus(`Stock insuficiente para ${normalizedSku}. Disponible: ${product.stock.available}.`);
        return;
      }

      setPendingItems((current) => {
        const existing = current.find((item) => item.sku === product.sku);
        if (existing) {
          if (existing.quantity + parsedQuantity > product.stock.available) {
            setStatus(`Stock insuficiente para ${product.sku}. Disponible: ${product.stock.available}.`);
            return current;
          }

          return current.map((item) => (
            item.sku === product.sku
              ? { ...item, quantity: item.quantity + parsedQuantity }
              : item
          ));
        }

        return [
          ...current,
          {
            sku: product.sku,
            productName: product.productName,
            quantity: parsedQuantity,
            available: product.stock.available
          }
        ];
      });
      setSku('');
      setQuantity('');
    } catch (requestError) {
      setStatus(requestError.response?.data?.message || 'No se encontro el SKU indicado.');
    }
  }

  useEffect(() => {
    refreshOrders().catch(() => setOrders([]));
    client.getInventoryList()
      .then((result) => setProducts(result.products || []))
      .catch(() => setProducts([]));
  }, []);

  const skuSuggestions = useMemo(() => {
    const query = sku.trim().toLowerCase();
    if (!showSuggestions || query.length === 0) {
      return [];
    }

    return products
      .filter((product) => (
        product.sku.toLowerCase().startsWith(query)
        || product.productName.toLowerCase().startsWith(query)
        || product.productName.toLowerCase().includes(` ${query}`)
      ))
      .slice(0, 6);
  }, [products, showSuggestions, sku]);

  function selectSuggestion(product) {
    setSku(product.sku);
    setShowSuggestions(false);
    setStatus('');
  }

  function updateSkuInput(value) {
    setSku(value);
    setShowSuggestions(true);
  }

  return (
    <div className="page-stack">
      <PageHeading title="Pedidos" subtitle="Registro y seguimiento de ordenes de compra" />

      <section className="split-grid">
        <div className="panel">
          <PanelTitle icon={ClipboardList} title="Nuevo Pedido" />
          <label>
            SKU
            <div className="autocomplete-shell">
              <div className="input-shell">
                <Package size={18} />
                <input value={sku} onChange={(event) => updateSkuInput(event.target.value)} placeholder="Ej. ARROZ001 o leche" />
              </div>
              {skuSuggestions.length > 0 ? (
                <div className="suggestion-list">
                  {skuSuggestions.map((product) => (
                    <button type="button" key={product.sku} onClick={() => selectSuggestion(product)}>
                      <strong>{product.sku}</strong>
                      <span>{product.productName}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </label>
          <label>
            Cantidad
            <div className="input-shell">
              <ShoppingCart size={18} />
              <input inputMode="numeric" value={quantity} onChange={(event) => setQuantity(event.target.value)} placeholder="Ej. 5" />
            </div>
          </label>
          <button className="secondary-button" onClick={addProduct} type="button">Agregar producto</button>

          <div className="order-items-card">
            <div className="order-items-header">
              <strong>Productos del pedido</strong>
              <span>{pendingItems.length} item(s)</span>
            </div>
            <div className="order-items-table">
              <table>
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingItems.map((item) => (
                    <tr key={item.sku}>
                      <td>{item.sku}</td>
                      <td>{item.productName}</td>
                      <td>{item.quantity}</td>
                      <td>{item.available}</td>
                    </tr>
                  ))}
                  {pendingItems.length === 0 ? (
                    <tr>
                      <td colSpan="4"><div className="empty-state compact">Agrega productos desde el SKU del catalogo</div></td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>

          <button className="primary-button" onClick={registerOrder} type="button">Registrar pedido</button>
          {status ? <div className="inline-status">{status}</div> : null}
        </div>

        <div className="panel">
          <PanelTitle icon={Package} title="Pedidos Creados" />
          <div className="order-list">
            {orders.slice(0, 6).map((order) => (
              <div className="order-row" key={order.orderId}>
                <div>
                  <strong>{order.orderId.slice(0, 8)}</strong>
                  <span>{order.customer?.name}</span>
                </div>
                <span className="status-badge ok">{order.status}</span>
              </div>
            ))}
            {orders.length === 0 ? <div className="empty-state">Sin pedidos registrados</div> : null}
          </div>
        </div>
      </section>
    </div>
  );
}

function TransportPage({ client }) {
  const [orderId, setOrderId] = useState('PEDIDO-DE-PRUEBA-001');
  const [quantity, setQuantity] = useState(2);
  const [status, setStatus] = useState('');

  async function confirmDelivery() {
    setStatus('');
    try {
      const result = await client.confirmDelivery({
        orderId,
        items: [{ sku: 'SKU123ABC', quantity: Number(quantity) }]
      });
      setStatus(`Evento publicado: ${result.event.eventId}`);
    } catch (requestError) {
      setStatus(requestError.response?.data?.message || 'No se pudo confirmar la entrega.');
    }
  }

  return (
    <div className="page-stack">
      <PageHeading title="Transporte / Flota" subtitle="Confirmacion de entregas y seguimiento operativo" />

      <div className="transport-panel panel">
        <div className="route-summary">
          <div>
            <span>Origen</span>
            <strong>Lima, Lima</strong>
          </div>
          <div>
            <span>Destino</span>
            <strong>Arequipa, Arequipa</strong>
          </div>
        </div>

        <div className="driver-card">
          <div>
            <span>Conductor Asignado</span>
            <strong>Maria Gonzalez Lopez</strong>
          </div>
          <div>
            <span>Llegada Estimada</span>
            <strong>25/05 18:00</strong>
          </div>
        </div>

        <div className="timeline">
          {['Validado', 'Asignado', 'En Ruta', 'Entregado'].map((step, index) => (
            <div className={`timeline-step ${index < 3 ? 'done' : ''}`} key={step}>
              <span>{index < 3 ? <CheckCircle2 size={18} /> : null}</span>
              <strong>{step}</strong>
              <small>{index < 3 ? '25/05 12:00' : 'Pendiente'}</small>
            </div>
          ))}
        </div>

        <div className="delivery-form">
          <label>
            Pedido
            <div className="input-shell"><ClipboardList size={18} /><input value={orderId} onChange={(event) => setOrderId(event.target.value)} /></div>
          </label>
          <label>
            Cantidad entregada
            <div className="input-shell"><Package size={18} /><input type="number" min="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} /></div>
          </label>
          <button className="primary-button" type="button" onClick={confirmDelivery}>Confirmar entrega fisica</button>
        </div>

        {status ? <div className="inline-status">{status}</div> : null}

        <div className="checkpoint-list">
          <strong>Puntos de Control</strong>
          <span><i className="dot green" /> Lima (Origen) · 25/05 12:00</span>
          <span><i className="dot blue" /> Ica (Checkpoint) · 25/05 15:30</span>
          <span><i className="dot red" /> Arequipa (Destino)</span>
        </div>
      </div>
    </div>
  );
}

function PlaceholderPage({ title, description, icon: Icon }) {
  return (
    <div className="placeholder-page">
      <Icon size={38} />
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function PageHeading({ title, subtitle }) {
  return (
    <div className="page-heading">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  );
}

function PanelTitle({ title, icon: Icon }) {
  return (
    <div className="panel-title">
      {Icon ? <Icon size={20} /> : null}
      <h2>{title}</h2>
    </div>
  );
}

function MetricCard({ label, value, helper, delta, tone, icon: Icon }) {
  return (
    <div className="metric-card">
      <div className={`metric-icon ${tone}`}><Icon size={24} /></div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{delta || helper}</small>
    </div>
  );
}

function ProgressRow({ label, value, percent, color }) {
  return (
    <div className="progress-row">
      <div><span>{label}</span><strong>{value}</strong></div>
      <div className={`progress-bar ${color}`}><span style={{ width: `${percent}%` }} /></div>
    </div>
  );
}

function inferCategory(name) {
  const value = name.toLowerCase();
  if (['arroz', 'azucar', 'aceite', 'fideo', 'avena', 'harina', 'sal', 'lenteja', 'frejol', 'quinua', 'cereal'].some((keyword) => value.includes(keyword))) return 'Abarrotes';
  if (['leche', 'queso', 'yogurt', 'mantequilla', 'huevo'].some((keyword) => value.includes(keyword))) return 'Lacteos';
  if (['pollo', 'carne', 'pescado', 'atun'].some((keyword) => value.includes(keyword))) return 'Proteinas';
  if (['papa', 'cebolla', 'tomate', 'zanahoria', 'platano', 'manzana', 'naranja'].some((keyword) => value.includes(keyword))) return 'Frutas y Verduras';
  if (['agua', 'gaseosa', 'jugo', 'cafe', 'te'].some((keyword) => value.includes(keyword))) return 'Bebidas';
  if (['detergente', 'lejia', 'lavavajilla', 'papel', 'toalla', 'bolsas'].some((keyword) => value.includes(keyword))) return 'Limpieza';
  if (['jabon', 'shampoo', 'pasta dental', 'cepillo', 'panal', 'toallas humedas', 'alcohol', 'mascarillas'].some((keyword) => value.includes(keyword))) return 'Cuidado Personal';
  return 'Supermercado';
}

function Root() {
  const session = useSession();

  if (!session.token) {
    return <LoginPage onLogin={session.saveToken} />;
  }

  return <AppShell token={session.token} identity={session.identity} onLogout={session.logout} />;
}

createRoot(document.getElementById('root')).render(<Root />);
