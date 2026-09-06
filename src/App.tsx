import {
  IonApp, IonAvatar, IonBadge, IonButton, IonButtons, IonCard, IonCardContent,
  IonChip, IonContent, IonFab, IonFabButton, IonFooter, IonHeader, IonIcon,
  IonInput, IonItem, IonLabel, IonList, IonMenu, IonMenuButton, IonMenuToggle,
  IonModal, IonPage, IonSegment, IonSegmentButton, IonTitle, IonToast, IonToggle, IonToolbar,
  setupIonicReact,
} from '@ionic/react';
import { useEffect, useMemo, useState } from 'react';
import { addOutline, arrowDownOutline, arrowUpOutline, barChartOutline, checkmarkCircle, chevronForwardOutline, homeOutline, lockClosedOutline, menuOutline, moonOutline, peopleOutline, personCircleOutline, searchOutline, shieldCheckmarkOutline, sparklesOutline, sunnyOutline, walletOutline } from 'ionicons/icons';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */

/* Theme variables */
import './theme/variables.css';
import './App.css';

setupIonicReact();

const App: React.FC = () => {
  type Transaction = { id: number; type: 'debt' | 'payment'; amount: number; note: string; date: string };
  type Customer = { id: number; name: string; phone: string; amount: number; due: string; initials: string; color: string; transactions?: Transaction[] };
  const rosterNames = ['Wawan', 'Keket Iya', 'Abirat Cipis', 'Alin', 'Husein', 'Abinaya', 'Rama Baru', 'Cantika', 'Nazril', 'Tiar', 'Aqeku', 'Nadia', 'Mprang', 'Ezi', 'V. Dwi', 'Zio', 'Darnish', 'Eva', 'Vio', 'Lavira', 'Dinda', 'Emira', 'Nike Libro', 'Danda', 'Kelvin', 'Azhar', 'Era Yambi', 'Nadea', 'Rehan', 'Syahdan', 'Sabrina', 'Fatin', 'Putra', 'Dinda', 'Fey', 'Abor', 'Eko', 'Mas Okta', 'Dani Erlang', 'Sauna', 'Matun', 'Zaki', 'Putri', 'Mba Okta', 'Mba Amel', 'Imel', 'Dwi Baru', 'Reca Gede', 'Vika', 'Ana', 'Wahyu', 'Galih', 'Ipec', 'Feri Lampung', 'Yaya', 'Ara', 'Anggun', 'Rendi', 'Elsa', 'Emot', 'Silhan', 'Keyla', 'Lula Baru', 'Arca Cilik', 'Vema', 'Pafibau', 'Brian', 'Sella', 'Kevin', 'Mika', 'Aini', 'Bonge', 'Adam', 'Jazya', 'Inayil', 'Plinger', 'Aita', 'Pr. Opik', 'Antra', 'Haro', 'Bobi', 'Adil', 'Yay', 'Shafri', 'Elang', 'Fadil Ali', 'Hapi', 'Bili', 'RifFi', 'Ciko', 'Aldi', 'Pabel', 'Rizal Baru', 'Cipung', 'Putri', 'Cinta Alvian', 'Faza', 'Jansen', 'Haidar', 'Salshabila', 'RMI Kecil', 'Habib', 'Aurora', 'Lani', 'Tasya'];
  const initialCustomers: Customer[] = rosterNames.map((name, index) => ({ id: index + 1, name, phone: 'Nomor belum diisi', amount: 0, due: 'Belum ditentukan', initials: name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(), color: ['blue', 'green', 'coral', 'purple'][index % 4], transactions: [] }));
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [showAdd, setShowAdd] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('catatanku-owner-session') === 'true');
  const [isDark, setIsDark] = useState(() => localStorage.getItem('catatanku-dark-mode') === 'true');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newNote, setNewNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDebt, setShowDebt] = useState(false);
  const [debtAmount, setDebtAmount] = useState('');
  const [debtNote, setDebtNote] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentTarget, setPaymentTarget] = useState<number | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [feedback, setFeedback] = useState('');
  useEffect(() => {
    const saved = localStorage.getItem('catatanku-customers');
    if (saved) {
      const existing: Customer[] = JSON.parse(saved);
      const knownNames = new Set(existing.map((customer) => customer.name.toLowerCase()));
      const missing = initialCustomers.filter((customer) => !knownNames.has(customer.name.toLowerCase())).map((customer, index) => ({ ...customer, id: Date.now() + index }));
      setCustomers([...existing, ...missing]);
    }
  }, []);
  useEffect(() => { localStorage.setItem('catatanku-customers', JSON.stringify(customers)); }, [customers]);
  const totalDebt = useMemo(() => customers.reduce((total, customer) => total + customer.amount, 0), [customers]);
  const formatRupiah = (amount: number) => `Rp ${amount.toLocaleString('id-ID')}`;
  const parseRupiah = (value: string) => Number(value.replace(/\D/g, '')) || 0;
  const formatRupiahInput = (value: string) => { const amount = parseRupiah(value); return amount ? formatRupiah(amount) : ''; };
  const openOwnerAction = (action: () => void) => { if (isAuthenticated) { action(); return; } setPendingAction(() => action); setPin(''); setShowPin(true); };
  const verifyPin = () => { if (pin === '1234') { localStorage.setItem('catatanku-owner-session', 'true'); setIsAuthenticated(true); setShowPin(false); pendingAction?.(); setPendingAction(null); } };
  const toggleDarkMode = (enabled: boolean) => { setIsDark(enabled); localStorage.setItem('catatanku-dark-mode', String(enabled)); };
  const lockOwner = () => { localStorage.removeItem('catatanku-owner-session'); setIsAuthenticated(false); };
  const addCustomer = () => {
    const cleanName = newName.trim();
    const amount = parseRupiah(newAmount);
    if (!cleanName || !amount) return;
    const initials = cleanName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
    setCustomers((current) => [...current, { id: Date.now(), name: cleanName, phone: newPhone || 'Nomor belum diisi', amount, due: 'Belum ditentukan', initials, color: 'purple', transactions: [{ id: Date.now() + 1, type: 'debt', amount, note: newNote || 'Hutang pertama', date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) }] }]);
    setNewName(''); setNewPhone(''); setNewAmount(''); setNewNote(''); setShowAdd(false);
    setFeedback('Pelanggan baru berhasil ditambahkan');
  };
  const selectedDetail = selectedCustomer ? customers.find((customer) => customer.id === selectedCustomer.id) ?? selectedCustomer : null;
  const openDebtModal = () => { if (!selectedDetail) return; setDebtAmount(''); setDebtNote(''); setShowDebt(true); };
  const addDebt = () => {
    const amount = parseRupiah(debtAmount);
    if (!selectedDetail || !amount) return;
    setCustomers((current) => current.map((customer) => customer.id === selectedDetail.id ? { ...customer, amount: customer.amount + amount, transactions: [...(customer.transactions ?? []), { id: Date.now(), type: 'debt', amount, note: debtNote.trim() || 'Penambahan hutang', date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) }] } : customer));
    setShowDebt(false); setFeedback(`Hutang ${formatRupiah(amount)} ditambahkan`);
  };
  const openPaymentModal = (id: number) => { setPaymentTarget(id); setPaymentAmount(''); setPaymentNote(''); setShowPayment(true); };
  const addPayment = () => {
    const amount = parseRupiah(paymentAmount);
    const target = customers.find((customer) => customer.id === paymentTarget);
    if (!target || !amount || amount > target.amount) return;
    setCustomers((current) => current.map((customer) => customer.id === target.id ? { ...customer, amount: customer.amount - amount, transactions: [...(customer.transactions ?? []), { id: Date.now(), type: 'payment', amount, note: paymentNote.trim() || 'Pembayaran hutang', date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) }] } : customer));
    setShowPayment(false); setFeedback(`Pembayaran ${formatRupiah(amount)} dicatat`);
  };
  const openEditModal = () => { if (!selectedDetail) return; setEditName(selectedDetail.name); setEditPhone(selectedDetail.phone); setShowEdit(true); };
  const saveEdit = () => {
    if (!selectedDetail || !editName.trim()) return;
    const initials = editName.trim().split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
    setCustomers((current) => current.map((customer) => customer.id === selectedDetail.id ? { ...customer, name: editName.trim(), phone: editPhone || 'Nomor belum diisi', initials } : customer));
    setSelectedCustomer((current) => current ? { ...current, name: editName.trim(), phone: editPhone || 'Nomor belum diisi', initials } : current);
    setShowEdit(false); setFeedback('Data pelanggan berhasil diperbarui');
  };
  const shareCustomer = async () => {
    if (!selectedDetail) return;
    const shareText = `${selectedDetail.name} memiliki sisa hutang ${formatRupiah(selectedDetail.amount)}.`;
    if (navigator.clipboard) await navigator.clipboard.writeText(shareText);
    setFeedback('Ringkasan hutang disalin ke clipboard');
  };
  const settleCustomer = (id: number) => { const target = customers.find((customer) => customer.id === id); if (!target || target.amount <= 0) return; setCustomers((current) => current.map((customer) => customer.id === id ? { ...customer, amount: 0, transactions: [...(customer.transactions ?? []), { id: Date.now(), type: 'payment', amount: target.amount, note: 'Pelunasan seluruh hutang', date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) }] } : customer)); setFeedback('Pelanggan berhasil dilunasi'); };
  const deleteCustomer = (id: number) => {
    const target = customers.find((customer) => customer.id === id);
    if (!target || !window.confirm(`Hapus data ${target.name}? Data yang dihapus tidak dapat dikembalikan.`)) return;
    setCustomers((current) => current.filter((customer) => customer.id !== id));
    setSelectedCustomer(null); setShowEdit(false); setFeedback(`${target.name} berhasil dihapus`);
  };
  return (
    <IonApp className={isDark ? 'theme-dark' : ''}>
      <IonMenu contentId="main" className="app-drawer"><IonHeader className="ion-no-border drawer-header"><IonToolbar className="drawer-toolbar" /></IonHeader><IonContent><div className="drawer-profile"><IonAvatar className="large-avatar"><span>ML</span></IonAvatar><strong>MbakLin</strong><small>Catatan piutang pribadi</small></div><IonList lines="none" className="drawer-list"><IonMenuToggle autoHide={true}><IonItem button onClick={() => setActiveTab('home')}><IonIcon icon={homeOutline} slot="start" /><IonLabel>Beranda</IonLabel></IonItem></IonMenuToggle><IonMenuToggle autoHide={true}><IonItem button onClick={() => { setSelectedCustomer(null); setActiveTab('customers'); }}><IonIcon icon={peopleOutline} slot="start" /><IonLabel>Pelanggan</IonLabel></IonItem></IonMenuToggle><IonMenuToggle autoHide={true}><IonItem button onClick={() => setActiveTab('reports')}><IonIcon icon={barChartOutline} slot="start" /><IonLabel>Laporan</IonLabel></IonItem></IonMenuToggle><IonMenuToggle autoHide={true}><IonItem button onClick={() => setActiveTab('profile')}><IonIcon icon={personCircleOutline} slot="start" /><IonLabel>Profil</IonLabel></IonItem></IonMenuToggle></IonList></IonContent></IonMenu>
      <IonPage id="main" className="app-shell">
        <IonHeader className="ion-no-border"><IonToolbar className="topbar"><IonButtons slot="start"><IonMenuButton className="menu-button" autoHide={false}><IonIcon icon={menuOutline} /></IonMenuButton></IonButtons><IonTitle>MbakLin</IonTitle></IonToolbar></IonHeader>
        <IonContent fullscreen className="main-content">
          {activeTab === 'home' && <HomeView customers={customers} totalDebt={totalDebt} formatRupiah={formatRupiah} onAdd={() => openOwnerAction(() => setShowAdd(true))} onCustomers={() => setActiveTab('customers')} onSelectCustomer={(customer) => { setSelectedCustomer(customer); setActiveTab('customers'); }} onPay={(id) => openOwnerAction(() => setCustomers((current) => current.map((customer) => customer.id === id ? { ...customer, amount: 0 } : customer)))} />}
          {activeTab === 'customers' && !selectedCustomer && <CustomersView customers={customers.filter((customer) => `${customer.name} ${customer.phone}`.toLowerCase().includes(searchTerm.toLowerCase()))} formatRupiah={formatRupiah} searchTerm={searchTerm} onSearch={setSearchTerm} onAdd={() => openOwnerAction(() => setShowAdd(true))} onSelect={setSelectedCustomer} onPay={(id) => openOwnerAction(() => { settleCustomer(id); })} />}
          {activeTab === 'customers' && selectedCustomer && <CustomerDetail customer={selectedDetail!} formatRupiah={formatRupiah} onBack={() => setSelectedCustomer(null)} onAddDebt={() => openOwnerAction(openDebtModal)} onPay={(id) => openOwnerAction(() => openPaymentModal(id))} onShare={shareCustomer} onEdit={() => openOwnerAction(openEditModal)} onDelete={(id) => openOwnerAction(() => deleteCustomer(id))} onSettle={(id) => openOwnerAction(() => settleCustomer(id))} />}
          {activeTab === 'reports' && <ReportsView customers={customers} totalDebt={totalDebt} formatRupiah={formatRupiah} onCustomers={() => setActiveTab('customers')} onPay={(id) => openOwnerAction(() => openPaymentModal(id))} />}
          {activeTab === 'profile' && <ProfileView isDark={isDark} isAuthenticated={isAuthenticated} onToggleDark={toggleDarkMode} onLock={lockOwner} />}
        </IonContent>
        <IonFooter className="ion-no-border"><IonToolbar className="tab-toolbar"><div className="tabbar">{[[homeOutline, 'home', 'Beranda'], [peopleOutline, 'customers', 'Pelanggan'], [barChartOutline, 'reports', 'Laporan'], [personCircleOutline, 'profile', 'Profil']].map(([icon, key, label]) => <button className={activeTab === key ? 'tab active' : 'tab'} key={key} onClick={() => setActiveTab(key as string)}><IonIcon icon={icon as string} /><span>{label}</span></button>)}</div></IonToolbar></IonFooter>
      </IonPage>
      <IonModal isOpen={showAdd} onDidDismiss={() => setShowAdd(false)} className="sheet-modal"><IonHeader><IonToolbar><IonTitle>Pelanggan baru</IonTitle><IonButtons slot="end"><IonButton onClick={() => setShowAdd(false)}>Tutup</IonButton></IonButtons></IonToolbar></IonHeader><IonContent className="modal-content"><p className="modal-kicker">SHEET BARU</p><h2>Tambah catatan hutang</h2><p className="muted">Setiap pelanggan akan punya sheet catatan sendiri.</p><IonList lines="none" className="form-list"><IonItem><IonLabel position="stacked">Nama pelanggan</IonLabel><IonInput value={newName} onIonInput={(event) => setNewName(event.detail.value ?? '')} placeholder="Contoh: Rina Wijaya" /></IonItem><IonItem><IonLabel position="stacked">Nomor WhatsApp</IonLabel><IonInput value={newPhone} onIonInput={(event) => setNewPhone(event.detail.value ?? '')} placeholder="08xx xxxx xxxx" /></IonItem><IonItem className="currency-item"><IonLabel position="stacked">Jumlah hutang pertama</IonLabel><IonInput type="text" inputmode="numeric" value={newAmount} onIonInput={(event) => setNewAmount(formatRupiahInput(event.detail.value ?? ''))} placeholder="Rp 250.000" /></IonItem><IonItem><IonLabel position="stacked">Keterangan hutang pertama</IonLabel><IonInput value={newNote} onIonInput={(event) => setNewNote(event.detail.value ?? '')} placeholder="Contoh: Belanja sembako" /></IonItem></IonList><IonButton expand="block" className="primary-button" onClick={addCustomer}>Simpan pelanggan</IonButton></IonContent></IonModal>
      <IonModal isOpen={showDebt} onDidDismiss={() => setShowDebt(false)} className="sheet-modal"><IonHeader><IonToolbar><IonTitle>Tambah hutang</IonTitle><IonButtons slot="end"><IonButton onClick={() => setShowDebt(false)}>Tutup</IonButton></IonButtons></IonToolbar></IonHeader><IonContent className="modal-content"><p className="modal-kicker">CATAT TRANSAKSI</p><h2>{selectedDetail?.name}</h2><p className="muted">Tambahkan nominal baru ke sheet pelanggan ini.</p><IonList lines="none" className="form-list"><IonItem className="currency-item"><IonLabel position="stacked">Jumlah hutang</IonLabel><IonInput type="text" inputmode="numeric" value={debtAmount} onIonInput={(event) => setDebtAmount(formatRupiahInput(event.detail.value ?? ''))} placeholder="Rp 150.000" /></IonItem><IonItem><IonLabel position="stacked">Keterangan</IonLabel><IonInput value={debtNote} onIonInput={(event) => setDebtNote(event.detail.value ?? '')} placeholder="Contoh: Belanja sembako" /></IonItem></IonList><IonButton expand="block" className="primary-button" onClick={addDebt}>Simpan hutang</IonButton></IonContent></IonModal>
      <IonModal isOpen={showPayment} onDidDismiss={() => setShowPayment(false)} className="sheet-modal"><IonHeader><IonToolbar><IonTitle>Catat pembayaran</IonTitle><IonButtons slot="end"><IonButton onClick={() => setShowPayment(false)}>Tutup</IonButton></IonButtons></IonToolbar></IonHeader><IonContent className="modal-content"><p className="modal-kicker">TRANSAKSI PEMBAYARAN</p><h2>{customers.find((customer) => customer.id === paymentTarget)?.name}</h2><p className="muted">Masukkan nominal yang benar-benar dibayarkan.</p><IonList lines="none" className="form-list"><IonItem className="currency-item"><IonLabel position="stacked">Nominal dibayar</IonLabel><IonInput type="text" inputmode="numeric" value={paymentAmount} onIonInput={(event) => setPaymentAmount(formatRupiahInput(event.detail.value ?? ''))} placeholder="Rp 100.000" /></IonItem><IonItem><IonLabel position="stacked">Keterangan pembayaran</IonLabel><IonInput value={paymentNote} onIonInput={(event) => setPaymentNote(event.detail.value ?? '')} placeholder="Contoh: Bayar cicilan" /></IonItem></IonList><IonButton expand="block" className="primary-button" onClick={addPayment}>Simpan pembayaran</IonButton></IonContent></IonModal>
      <IonModal isOpen={showEdit} onDidDismiss={() => setShowEdit(false)} className="sheet-modal"><IonHeader><IonToolbar><IonTitle>Edit pelanggan</IonTitle><IonButtons slot="end"><IonButton onClick={() => setShowEdit(false)}>Tutup</IonButton></IonButtons></IonToolbar></IonHeader><IonContent className="modal-content"><p className="modal-kicker">DATA PELANGGAN</p><h2>Perbarui informasi</h2><IonList lines="none" className="form-list"><IonItem><IonLabel position="stacked">Nama pelanggan</IonLabel><IonInput value={editName} onIonInput={(event) => setEditName(event.detail.value ?? '')} /></IonItem><IonItem><IonLabel position="stacked">Nomor WhatsApp</IonLabel><IonInput value={editPhone} onIonInput={(event) => setEditPhone(event.detail.value ?? '')} /></IonItem></IonList><IonButton expand="block" className="primary-button" onClick={saveEdit}>Simpan perubahan</IonButton><IonButton expand="block" fill="clear" color="danger" className="delete-button" onClick={() => selectedDetail && openOwnerAction(() => deleteCustomer(selectedDetail.id))}><IonIcon icon={lockClosedOutline} /> Hapus pelanggan</IonButton></IonContent></IonModal>
      <IonModal isOpen={showPin} onDidDismiss={() => setShowPin(false)} className="pin-modal"><IonContent className="pin-content"><div className="pin-icon"><IonIcon icon={lockClosedOutline} /></div><p className="modal-kicker">AKSES OWNER</p><h2>Masukkan PIN</h2><p className="muted">Kelola data hutang dengan aman di perangkat ini.</p><IonInput className="pin-input" type="password" inputmode="numeric" maxlength={4} value={pin} onIonInput={(event) => setPin(event.detail.value ?? '')} placeholder="••••" /><IonButton expand="block" className="primary-button" onClick={verifyPin}>Buka akses</IonButton><p className="pin-hint">Demo PIN: 1234</p></IonContent></IonModal>
      <IonToast isOpen={Boolean(feedback)} message={feedback} duration={1800} position="bottom" onDidDismiss={() => setFeedback('')} />
    </IonApp>
  );
};

type ViewProps = { customers: { id: number; name: string; phone: string; amount: number; due: string; initials: string; color: string; transactions?: { id: number; type: 'debt' | 'payment'; amount: number; note: string; date: string }[] }[]; formatRupiah: (amount: number) => string; onAdd: () => void; onPay: (id: number) => void };
const HomeView: React.FC<ViewProps & { totalDebt: number; onCustomers: () => void; onSelectCustomer: (customer: ViewProps['customers'][number]) => void }> = ({ customers, totalDebt, formatRupiah, onAdd, onPay, onCustomers, onSelectCustomer }) => {
  const biggestDebt = customers.reduce((biggest, customer) => customer.amount > biggest.amount ? customer : biggest, customers[0]);
  return <><div className="dashboard-hero"><div><h2>Catatan Hutang</h2><p>Kelola piutang warung,<br />pembayaran, dan laporan<br />secara rapi.</p></div><div className="bill-art"><span>Rp</span><i>✓</i></div><div className="hero-dots"><b /><span /><span /></div></div><div className="dashboard-metrics"><div><div className="metric-icon">Rp</div><span>Total Piutang</span><strong>{formatRupiah(totalDebt)}</strong></div><div><div className="metric-icon people">●●</div><span>Pelanggan</span><strong>{customers.length}</strong></div></div><div className="biggest-card"><IonAvatar className={`customer-avatar ${biggestDebt?.color ?? 'green'}`}><span>{biggestDebt?.initials ?? '--'}</span></IonAvatar><div><small>Hutang terbesar</small><strong>{biggestDebt?.name ?? 'Belum ada pelanggan'}</strong><b>{formatRupiah(biggestDebt?.amount ?? 0)}</b></div><button onClick={() => biggestDebt && onSelectCustomer(biggestDebt)}>Lihat detail</button></div><div className="section-heading"><h3>Pelanggan terbaru</h3><button onClick={onCustomers}>Lihat semua</button></div><div className="customer-list">{customers.filter((customer) => customer.amount > 0).slice(0, 3).map((customer) => <CustomerRow key={customer.id} customer={customer} formatRupiah={formatRupiah} onPay={onPay} onSelect={() => onSelectCustomer(customer)} showAmountLabel={false} showPaymentAction={false} />)}</div><IonFab className="reference-fab-container" slot="fixed"><IonFabButton className="reference-fab" onClick={onAdd}><IonIcon icon={addOutline} /><span>Pelanggan</span></IonFabButton></IonFab></>;
};
const CustomersView: React.FC<ViewProps & { onSelect: (customer: ViewProps['customers'][number]) => void; searchTerm: string; onSearch: (value: string) => void }> = ({ customers, formatRupiah, onAdd, onPay, onSelect, searchTerm, onSearch }) => <div className="inner-page"><div className="page-heading compact"><div><p className="eyebrow">DATA PELANGGAN</p><h1>Pelanggan</h1></div></div><div className="search-field"><IonIcon icon={searchOutline} /><IonInput value={searchTerm} onIonInput={(event) => onSearch(event.detail.value ?? '')} placeholder="Cari nama atau nomor HP" /></div><p className="list-count">{customers.length} pelanggan terdaftar</p><div className="customer-list full-list">{customers.map((customer) => <CustomerRow key={customer.id} customer={customer} formatRupiah={formatRupiah} onPay={onPay} onSelect={() => onSelect(customer)} showAmountLabel={false} showPaymentAction={false} />)}</div><IonFab className="reference-fab-container" slot="fixed"><IonFabButton className="reference-fab compact-fab" onClick={onAdd}><IonIcon icon={addOutline} /><span>Tambah</span></IonFabButton></IonFab></div>;
const CustomerRow: React.FC<{ customer: ViewProps['customers'][number]; formatRupiah: (amount: number) => string; onPay: (id: number) => void; onSelect?: () => void; showAmountLabel?: boolean; showPaymentAction?: boolean }> = ({ customer, formatRupiah, onPay, onSelect, showAmountLabel = true, showPaymentAction = true }) => <div className="customer-row" onClick={onSelect}><IonAvatar className={`customer-avatar ${customer.color}`}><span>{customer.initials}</span></IonAvatar><div className="customer-info"><strong>{customer.name}</strong><small>{customer.phone}</small></div><div className="customer-amount">{showAmountLabel && <small>Total Hutang</small>}<strong>{formatRupiah(customer.amount)}</strong>{showPaymentAction && <button onClick={(event) => { event.stopPropagation(); onPay(customer.id); }}>Bayar</button>}</div><IonIcon className="row-chevron" icon={chevronForwardOutline} /></div>;
const CustomerDetail: React.FC<{ customer: ViewProps['customers'][number]; formatRupiah: (amount: number) => string; onBack: () => void; onAddDebt: () => void; onPay: (id: number) => void; onShare: () => void; onEdit: () => void; onDelete: (id: number) => void; onSettle: (id: number) => void }> = ({ customer, formatRupiah, onBack, onAddDebt, onPay, onShare, onEdit, onDelete, onSettle }) => <div className="detail-page"><div className="detail-header"><button onClick={onBack}>‹</button><strong>Detail Pelanggan</strong></div><div className="detail-hero"><div className="detail-profile"><IonAvatar className={`customer-avatar ${customer.color}`}><span>{customer.initials}</span></IonAvatar><div><h2>{customer.name}</h2><p>{customer.phone}</p></div></div><p className="detail-label">Sisa hutang</p><strong className="detail-total">{formatRupiah(customer.amount)}</strong><div className="bill-art small"><span>Rp</span><i>✓</i></div></div><div className="detail-actions"><button onClick={onAddDebt}><IonIcon icon={addOutline} /><span>Tambah<br />Hutang</span></button><button onClick={() => onPay(customer.id)}><IonIcon icon={walletOutline} /><span>Bayar</span></button><button onClick={onShare}><IonIcon icon={sparklesOutline} /><span>Bagikan</span></button><button onClick={() => onSettle(customer.id)}><IonIcon icon={checkmarkCircle} /><span>Lunasi<br />Semua</span></button></div><button className="edit-customer" onClick={onEdit}>✎ &nbsp; Edit Pelanggan</button><button className="detail-delete" onClick={() => onDelete(customer.id)}>Hapus pelanggan</button><div className="transaction-panel"><h3>Riwayat transaksi</h3>{(customer.transactions ?? []).length === 0 ? <p className="empty-transactions">Belum ada transaksi tercatat.</p> : customer.transactions?.slice().reverse().map((transaction) => <div className="transaction" key={transaction.id}><span className={`transaction-icon ${transaction.type === 'debt' ? 'debt' : 'paid'}`}>{transaction.type === 'debt' ? '+' : '-'}</span><div><strong>{transaction.type === 'debt' ? 'Hutang' : 'Pembayaran'}</strong><small>{transaction.date}<br />{transaction.note}</small></div><b className={transaction.type === 'payment' ? 'paid-text' : ''}>{transaction.type === 'debt' ? '+' : '-'}{formatRupiah(transaction.amount)}</b></div>)}</div></div>;
const ReportsView: React.FC<{ customers: ViewProps['customers']; totalDebt: number; formatRupiah: (amount: number) => string; onCustomers: () => void; onPay: (id: number) => void }> = ({ customers, totalDebt, formatRupiah, onCustomers, onPay }) => {
  const [period, setPeriod] = useState('6');
  const heights = period === '6' ? ['30%', '43%', '48%', '63%', '76%', '91%'] : ['24%', '35%', '44%', '54%', '69%', '78%', '88%', '96%'];
  return <div className="inner-page report-page"><div className="page-heading compact"><div><p className="eyebrow">RINGKASAN PIUTANG</p><h1>Laporan Piutang</h1></div><IonIcon className="report-icon" icon={barChartOutline} /></div><div className="report-hero"><div><h2>Ringkasan Piutang</h2><p>Lihat total piutang, komposisi pelanggan, dan tagihan yang belum lunas.</p></div><div className="bill-art report-art"><span>Rp</span><i>↗</i></div></div><div className="report-title-row"><h3>Grafik Piutang</h3><IonSegment value={period} onIonChange={(event) => setPeriod(event.detail.value as string)} className="report-filter"><IonSegmentButton value="6">6 Bulan</IonSegmentButton><IonSegmentButton value="12">12 Bulan</IonSegmentButton></IonSegment></div><IonCard className="report-card"><IonCardContent><div className="chart-legend"><span><i className="legend-bar" /> Total Piutang (Rp)</span><span><i className="legend-line" /> Jumlah Pelanggan</span></div><div className="bar-chart detailed-chart">{heights.map((height, index) => <span key={index} className={index === heights.length - 1 ? 'current' : ''} style={{ height }} />)}</div><div className="chart-labels">{(period === '6' ? ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'] : ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu']).map((month) => <span key={month}>{month}</span>)}</div></IonCardContent></IonCard><div className="section-heading report-list-heading"><h3>Daftar piutang</h3><button onClick={onCustomers}>Lihat semua</button></div><div className="customer-list report-list">{customers.slice(0, 4).map((customer) => <CustomerRow key={customer.id} customer={customer} formatRupiah={formatRupiah} onPay={onPay} />)}</div><p className="report-total">Total berjalan: {formatRupiah(totalDebt)}</p></div>;
};
const ProfileView: React.FC<{ isDark: boolean; isAuthenticated: boolean; onToggleDark: (enabled: boolean) => void; onLock: () => void }> = ({ isDark, isAuthenticated, onToggleDark, onLock }) => <div className="inner-page"><div className="profile-hero"><IonAvatar className="large-avatar"><span>ML</span></IonAvatar><p className="eyebrow">PEMILIK TOKO</p><h1>Mbak Lin</h1><p className="muted">Catatan hutang pribadi</p></div><div className="settings-list"><div><IonIcon icon={shieldCheckmarkOutline} /><span>Backup lokal aktif<small>Terakhir disimpan barusan</small></span><IonBadge color="success">Aktif</IonBadge></div><div className="setting-control"><IonIcon icon={isDark ? moonOutline : sunnyOutline} /><span>Tampilan {isDark ? 'gelap' : 'terang'}<small>Mode warna aplikasi</small></span><IonToggle checked={isDark} onIonChange={(event) => onToggleDark(event.detail.checked)} /></div><div><IonIcon icon={sparklesOutline} /><span>Mode aplikasi<small>Clean dan fokus pada catatan</small></span><IonIcon icon={chevronForwardOutline} /></div><button onClick={onLock} disabled={!isAuthenticated}><IonIcon icon={lockClosedOutline} /><span>{isAuthenticated ? 'Kunci akses owner' : 'Akses owner terkunci'}<small>{isAuthenticated ? 'PIN diperlukan saat membuka kembali' : 'Masukkan PIN untuk membuka akses'}</small></span><IonIcon icon={chevronForwardOutline} /></button></div><p className="footer-note">Catatanku v1.0 · Data disimpan di perangkat ini</p></div>;

export default App;
