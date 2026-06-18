import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import {
  AlertTriangle,
  Bell,
  Box,
  ChevronRight,
  ClipboardList,
  Eye,
  EyeOff,
  FileText,
  Home,
  LifeBuoy,
  Lock,
  Mail,
  MapPin,
  Package,
  Search,
  Settings,
  Shield,
  ShoppingCart,
  Truck,
  Warehouse
} from 'lucide-react';
import carleyLogo from './assets/carley-logo.png';
import pepeGrilloAvatar from './assets/pepe-grillo.png';
import './styles.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const STORE_OPTIONS = [
  { name: 'PlazaVea', code: 'VEA', customerId: 'STORE-PLAZAVEA' },
  { name: 'Tottus', code: 'TOTTUS', customerId: 'STORE-TOTTUS' },
  { name: 'La tiendita de Don Pepe', code: 'DONPEPE', customerId: 'STORE-DONPEPE' },
  { name: 'Vivanda', code: 'VIVANDA', customerId: 'STORE-VIVANDA' },
  { name: 'Wong', code: 'WONG', customerId: 'STORE-WONG' },
  { name: 'Makro', code: 'MAKRO', customerId: 'STORE-MAKRO' }
];

const TRUCKS = Array.from({ length: 50 }, (_, index) => `CAMION#${index + 1}`);

const LIMA_DISTRICTS = [
  'ATE',
  'ANCON',
  'BARRANCO',
  'BREÑA',
  'CARABAYLLO',
  'CHACLACAYO',
  'CHORRILLOS',
  'CIENEGUILLA',
  'COMAS',
  'EL AGUSTINO',
  'INDEPENDENCIA',
  'JESUS MARIA',
  'LA MOLINA',
  'LA VICTORIA',
  'LINCE',
  'LOS OLIVOS',
  'LURIGANCHO (CHOSICA)',
  'LURIN',
  'MAGDALENA DEL MAR',
  'MIRAFLORES',
  'PACHACAMAC',
  'PUCUSANA',
  'PUEBLO LIBRE',
  'PUENTE PIEDRA',
  'PUNTA HERMOSA',
  'PUNTA NEGRA',
  'RIMAC',
  'SAN BARTOLO',
  'SAN BORJA',
  'SAN ISIDRO'
];

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
    async updateInventoryStock(payload) {
      const response = await api.post('/api/inventario/actualizar-stock', payload, {
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
    },
    async generateInvoice(payload) {
      const response = await api.post('/api/facturacion/generar', payload, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
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
  { id: 'products', label: 'Inventario', icon: Warehouse },
  { id: 'orders', label: 'Pedidos', icon: ShoppingCart },
  { id: 'transport', label: 'Transporte / Flota', icon: Truck },
  { id: 'billing', label: 'Facturacion', icon: FileText },
  { id: 'settings', label: 'Configuracion', icon: Settings }
];

function AppShell({ token, identity, onLogout }) {
  const [active, setActive] = useState('dashboard');
  const [profileOpen, setProfileOpen] = useState(false);
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
            <div className="profile-menu">
              <button className="user-chip" type="button" onClick={() => setProfileOpen((current) => !current)}>
                <img src={pepeGrilloAvatar} alt="Pepe Grillo" />
                <span>Bienvenido PEPE GRILLO</span>
              </button>
              {profileOpen ? (
                <div className="profile-card">
                  <img src={pepeGrilloAvatar} alt="Pepe Grillo" />
                  <strong>PEPE GRILLO</strong>
                  <span>Administrador del sistema</span>
                  <button type="button" onClick={onLogout}>Salir</button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <main className="page-content">
          {active === 'dashboard' && <DashboardPage client={client} />}
          {active === 'products' && <ProductsPage client={client} />}
          {active === 'orders' && <OrdersPage client={client} />}
          {active === 'transport' && <TransportPlannerPage client={client} />}
          {active === 'billing' && <BillingPage client={client} />}
          {active === 'settings' && <SettingsPage />}
        </main>
      </section>
    </div>
  );
}

function DashboardPage({ client }) {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [transportAssignments, setTransportAssignments] = useState(() => readTransportAssignments());

  useEffect(() => {
    Promise.allSettled([client.getOrders(), client.getInventoryList()]).then(([ordersResult, inventoryResult]) => {
      if (ordersResult.status === 'fulfilled') {
        setOrders(ordersResult.value.orders || []);
      }
      if (inventoryResult.status === 'fulfilled') {
        setProducts(inventoryResult.value.products || []);
      }
    });
    setTransportAssignments(readTransportAssignments());
  }, [client]);

  const lowStock = products.filter((product) => product.stock.available > 0 && product.stock.available < 20).length;
  const criticalStock = products.filter((product) => product.stock.available === 0).length;
  const availableTruckCount = Math.max(TRUCKS.length - transportAssignments.length, 0);
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
        <MetricCard label="Camiones Disponibles" value={`${availableTruckCount}/50`} helper={`${transportAssignments.length} camiones asignados`} tone="orange" icon={Truck} />
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
      title="Inventario"
      subtitle="Consulta productos sincronizados con el stock logistico"
      mode="products"
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
  const [editingSku, setEditingSku] = useState('');
  const [stockDraft, setStockDraft] = useState('');
  const [savingSku, setSavingSku] = useState('');

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

  function startStockEdit(item) {
    setEditingSku(item.sku);
    setStockDraft(String(item.stock.physical));
    setError('');
  }

  function cancelStockEdit() {
    setEditingSku('');
    setStockDraft('');
  }

  async function saveStockEdit(item) {
    setError('');
    const nextPhysicalStock = Number(stockDraft);

    if (!Number.isInteger(nextPhysicalStock) || nextPhysicalStock < 0) {
      setError('Ingresa una cantidad valida para el stock.');
      return;
    }

    setSavingSku(item.sku);
    try {
      const updated = await client.updateInventoryStock({
        sku: item.sku,
        physicalStock: nextPhysicalStock
      });

      setRows((current) => current.map((row) => (row.sku === updated.sku ? updated : row)));
      setEditingSku('');
      setStockDraft('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'No se pudo actualizar el stock.');
    } finally {
      setSavingSku('');
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
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8"><div className="empty-state">Cargando productos...</div></td>
              </tr>
            ) : null}
            {visibleRows.map((item) => {
              const status = item.stock.available === 0 ? 'Agotado' : item.stock.available < 20 ? 'Stock Bajo' : 'Disponible';
              const isEditing = editingSku === item.sku;
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
                  <td>
                    {isEditing ? (
                      <div className="stock-edit">
                        <input
                          inputMode="numeric"
                          value={stockDraft}
                          onChange={(event) => setStockDraft(event.target.value)}
                          aria-label={`Stock fisico para ${item.sku}`}
                        />
                        <button type="button" onClick={() => saveStockEdit(item)} disabled={savingSku === item.sku}>
                          {savingSku === item.sku ? '...' : 'Guardar'}
                        </button>
                        <button type="button" className="ghost" onClick={cancelStockEdit}>Cancelar</button>
                      </div>
                    ) : (
                      <button className="table-action" type="button" onClick={() => startStockEdit(item)}>Editar</button>
                    )}
                  </td>
                </tr>
              );
            })}
            {!loading && visibleRows.length === 0 ? (
              <tr>
                <td colSpan="8"><div className="empty-state">No hay productos registrados</div></td>
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
  const [selectedStoreName, setSelectedStoreName] = useState('');

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

    const selectedStore = STORE_OPTIONS.find((store) => store.name === selectedStoreName);
    if (!selectedStore) {
      setStatus('Selecciona la tienda a enviar antes de registrar el pedido.');
      return;
    }

    const nextOrderNumber = orders.length + 1;

    try {
      const result = await client.registerOrder({
        customer: {
          customerId: selectedStore.customerId,
          name: selectedStore.name,
          documentNumber: '20600111222'
        },
        order: {
          externalReference: `${selectedStore.code}#${nextOrderNumber}`,
          currency: 'PEN'
        },
        items: pendingItems.map((item) => ({ sku: item.sku, quantity: item.quantity }))
      });
      setStatus(`Pedido registrado: ${selectedStore.code}#${nextOrderNumber}`);
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
          <label className="select-shell store-select">
            Tienda a Enviar
            <select value={selectedStoreName} onChange={(event) => setSelectedStoreName(event.target.value)}>
              <option value="">Selecciona una tienda</option>
              {STORE_OPTIONS.map((store) => (
                <option key={store.code} value={store.name}>{store.name}</option>
              ))}
            </select>
          </label>
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
            {orders.slice(0, 6).map((order, index) => (
              <div className="order-row" key={order.orderId}>
                <div>
                  <strong>{formatOrderDisplayCode(order, index, orders.length)}</strong>
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

function TransportPlannerPage({ client }) {
  const [orders, setOrders] = useState([]);
  const [assignments, setAssignments] = useState(() => readTransportAssignments());
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [selectedTruck, setSelectedTruck] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    client.getOrders()
      .then((result) => setOrders(result.orders || []))
      .catch(() => setOrders([]));
  }, [client]);

  useEffect(() => {
    localStorage.setItem('carley_transport_assignments', JSON.stringify(assignments));
  }, [assignments]);

  const assignedTruckSet = useMemo(() => new Set(assignments.map((assignment) => assignment.truck)), [assignments]);
  const assignedOrderSet = useMemo(() => new Set(assignments.map((assignment) => assignment.orderId)), [assignments]);
  const availableTrucks = useMemo(() => TRUCKS.filter((truck) => !assignedTruckSet.has(truck)), [assignedTruckSet]);
  const availableOrders = useMemo(() => orders.filter((order) => !assignedOrderSet.has(order.orderId)), [assignedOrderSet, orders]);

  function assignTruck() {
    setStatus('');

    const selectedOrderIndex = orders.findIndex((order) => order.orderId === selectedOrderId);
    const selectedOrder = orders[selectedOrderIndex];

    if (!selectedOrder) {
      setStatus('Selecciona un pedido creado.');
      return;
    }

    if (!selectedTruck) {
      setStatus('Selecciona un camion disponible.');
      return;
    }

    if (!selectedDistrict) {
      setStatus('Selecciona el distrito destino.');
      return;
    }

    const orderCode = formatOrderDisplayCode(selectedOrder, selectedOrderIndex, orders.length);
    setAssignments((current) => [
      {
        id: `${selectedOrder.orderId}-${selectedTruck}`,
        truck: selectedTruck,
        orderId: selectedOrder.orderId,
        orderCode,
        district: selectedDistrict
      },
      ...current
    ]);
    setSelectedOrderId('');
    setSelectedTruck('');
    setSelectedDistrict('');
    setStatus(`${orderCode} asignado a ${selectedTruck}.`);
  }

  return (
    <div className="page-stack">
      <PageHeading title="Transporte / Flota" subtitle="Asignacion manual de pedidos a camiones operativos" />

      <section className="transport-grid">
        <div className="metric-card panel">
          <div className="metric-icon blue"><Truck size={24} /></div>
          <span>Camiones Disponibles</span>
          <strong>{availableTrucks.length}/50</strong>
          <small>{assignments.length} camiones asignados</small>
        </div>

        <div className="metric-card panel">
          <div className="metric-icon green"><ClipboardList size={24} /></div>
          <span>Pedidos Pendientes</span>
          <strong>{availableOrders.length}</strong>
          <small>Pedidos creados sin camion</small>
        </div>
      </section>

      <div className="transport-panel panel">
        <PanelTitle icon={Truck} title="Asignar camion a pedido" />

        <div className="assignment-form">
          <label className="select-shell">
            Pedido creado
            <select value={selectedOrderId} onChange={(event) => setSelectedOrderId(event.target.value)}>
              <option value="">Selecciona un pedido</option>
              {availableOrders.map((order) => {
                const orderIndex = orders.findIndex((candidate) => candidate.orderId === order.orderId);
                return (
                  <option key={order.orderId} value={order.orderId}>
                    {formatOrderDisplayCode(order, orderIndex, orders.length)} - {order.customer?.name}
                  </option>
                );
              })}
            </select>
          </label>

          <label className="select-shell">
            Camion disponible
            <select value={selectedTruck} onChange={(event) => setSelectedTruck(event.target.value)}>
              <option value="">Selecciona un camion</option>
              {availableTrucks.map((truck) => (
                <option key={truck} value={truck}>{truck}</option>
              ))}
            </select>
          </label>

          <label className="select-shell">
            Distrito a enviar
            <select value={selectedDistrict} onChange={(event) => setSelectedDistrict(event.target.value)}>
              <option value="">Selecciona distrito</option>
              {LIMA_DISTRICTS.map((district) => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </label>

          <button className="primary-button" type="button" onClick={assignTruck}>Asignar camion</button>
        </div>

        {status ? <div className="inline-status">{status}</div> : null}
      </div>

      <div className="panel">
        <PanelTitle icon={ClipboardList} title="Asignaciones de Transporte" />
        <div className="assignment-table">
          <table>
            <thead>
              <tr>
                <th>CAMION</th>
                <th>PEDIDO</th>
                <th>DISTRITO</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment.id}>
                  <td>{assignment.truck}</td>
                  <td>{assignment.orderCode}</td>
                  <td>{assignment.district}</td>
                </tr>
              ))}
              {assignments.length === 0 ? (
                <tr>
                  <td colSpan="3"><div className="empty-state compact">Aun no hay camiones asignados</div></td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function BillingPage({ client }) {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('');
  const [loadingOrderId, setLoadingOrderId] = useState('');

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

  const productBySku = useMemo(() => (
    products.reduce((accumulator, product) => {
      accumulator[product.sku] = product;
      return accumulator;
    }, {})
  ), [products]);

  async function openInvoice(order, index) {
    setStatus('');
    setLoadingOrderId(order.orderId);

    try {
      const payload = buildInvoicePayload(order, index, orders.length, productBySku);
      const pdfWindow = window.open('', '_blank', 'noopener,noreferrer');
      const pdfBlob = await client.generateInvoice(payload);
      const url = URL.createObjectURL(pdfBlob);
      if (pdfWindow) {
        pdfWindow.location.href = url;
      } else {
        const link = document.createElement('a');
        link.href = url;
        link.download = `${payload.orderId}.pdf`;
        link.click();
      }
      setStatus(`PDF generado para ${payload.orderId}.`);
      window.setTimeout(() => URL.revokeObjectURL(url), 30000);
    } catch (requestError) {
      setStatus(requestError.response?.data?.message || 'No se pudo generar el comprobante PDF.');
    } finally {
      setLoadingOrderId('');
    }
  }

  return (
    <div className="page-stack">
      <PageHeading title="Facturacion" subtitle="Comprobantes PDF generados desde los pedidos registrados" />

      <div className="panel">
        <PanelTitle icon={FileText} title="Comprobantes PDF" />
        <div className="billing-list">
          {orders.map((order, index) => {
            const invoiceCode = formatOrderDisplayCode(order, index, orders.length);
            return (
              <div className="billing-row" key={order.orderId}>
                <div className="billing-doc-icon">
                  <FileText size={22} />
                </div>
                <div>
                  <strong>{invoiceCode}.pdf</strong>
                  <span>{order.customer?.name} - {order.items?.length || 0} producto(s)</span>
                </div>
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => openInvoice(order, index)}
                  disabled={loadingOrderId === order.orderId}
                >
                  {loadingOrderId === order.orderId ? 'Generando...' : 'Ver PDF'}
                </button>
              </div>
            );
          })}
          {orders.length === 0 ? <div className="empty-state">Aun no hay pedidos para facturar</div> : null}
        </div>
        {status ? <div className="inline-status">{status}</div> : null}
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

function SettingsPage() {
  const companyRows = [
    { label: 'Razon Social', value: 'Grupo Carley S.A.C.' },
    { label: 'Correo electronico', value: 'operaciones@carley.local' },
    { label: 'Celular corporativo', value: '+51 927 442 969' },
    { label: 'Direccion', value: 'Sede Logistica Santa Clara, Ate, Lima' },
    { label: 'Responsable tecnico', value: 'Frank Alexzander Paraguay' },
    { label: 'Administrador del sistema', value: 'PEPE GRILLO' }
  ];

  const operationRows = [
    { label: 'Base de datos inventario', value: 'PostgreSQL carley_inventario' },
    { label: 'Base de datos pedidos', value: 'PostgreSQL carley_pedidos' },
    { label: 'Broker de mensajeria', value: 'RabbitMQ local' },
    { label: 'API Gateway', value: 'Puerto 8000' }
  ];

  return (
    <div className="page-stack">
      <PageHeading title="Configuracion" subtitle="Datos corporativos y parametros operativos del ecosistema CARLEY" />

      <section className="settings-grid">
        <div className="settings-card panel">
          <PanelTitle icon={Settings} title="Datos de la Empresa" />
          <div className="settings-list">
            {companyRows.map((row) => (
              <div className="settings-row" key={row.label}>
                <div>
                  <strong>{row.label}</strong>
                  <span>{row.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="settings-card panel">
          <PanelTitle icon={Shield} title="Configuracion Tecnica" />
          <div className="settings-list">
            {operationRows.map((row) => (
              <div className="settings-row" key={row.label}>
                <div>
                  <strong>{row.label}</strong>
                  <span>{row.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
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

function getStoreCode(storeName = '') {
  const store = STORE_OPTIONS.find((option) => option.name.toLowerCase() === storeName.toLowerCase());
  return store?.code || 'PED';
}

function formatOrderDisplayCode(order, index, totalOrders) {
  const reference = order.order?.externalReference;
  if (reference && reference.includes('#')) {
    return reference;
  }

  return `${getStoreCode(order.customer?.name)}#${Math.max(totalOrders - index, 1)}`;
}

function buildInvoicePayload(order, index, totalOrders, productBySku) {
  const orderCode = formatOrderDisplayCode(order, index, totalOrders);
  const items = (order.items || []).map((item) => {
    const product = productBySku[item.sku];
    const productName = product?.productName || item.productName || item.sku;
    return {
      sku: item.sku,
      name: productName,
      qty: item.quantity,
      price: inferUnitPrice(productName)
    };
  });

  return {
    orderId: orderCode,
    cliente: order.customer?.name || 'Cliente CARLEY',
    fecha: new Date().toISOString().slice(0, 10),
    items
  };
}

function inferUnitPrice(productName = '') {
  const category = inferCategory(productName);
  const prices = {
    Abarrotes: 8.9,
    Lacteos: 6.5,
    Proteinas: 14.9,
    'Frutas y Verduras': 4.8,
    Bebidas: 3.9,
    Limpieza: 11.5,
    'Cuidado Personal': 9.8,
    Supermercado: 7.5
  };

  return prices[category] || 7.5;
}

function readTransportAssignments() {
  try {
    return JSON.parse(localStorage.getItem('carley_transport_assignments') || '[]');
  } catch (error) {
    return [];
  }
}

function Root() {
  const session = useSession();

  if (!session.token) {
    return <LoginPage onLogin={session.saveToken} />;
  }

  return <AppShell token={session.token} identity={session.identity} onLogout={session.logout} />;
}

createRoot(document.getElementById('root')).render(<Root />);
