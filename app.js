// Integrasi frontend-backend API
const API_URL = '/api/data'; // Vercel serverless function
let allData = [];
let currentPage = 1;
const PAGE_SIZE = 10;
let deleteTargetRecord = null;
let editingRecord = null;
let programTarget = 5000;
let activityYear = new Date().getFullYear();
let chartInstances = {};

// Fetch all data
async function fetchAllData() {
	try {
		const res = await fetch(API_URL);
		allData = await res.json();
		updateDashboardStats();
		renderDataTable();
		updateDashRecentTable();
		updateRekapPage();
		updateLandingStats();
	} catch (err) {
		showToast('Gagal mengambil data', 'error');
	}
}

// Create data
async function handleSaveData(e) {
	e.preventDefault();
	const btn = document.getElementById('btnSave');
	const btnText = document.getElementById('btnSaveText');
	btn.disabled = true;
	btnText.textContent = 'Menyimpan...';

	const record = {
		tanggal_pemeriksaan: document.getElementById('fTanggal').value,
		nama: document.getElementById('fNama').value,
		nik: document.getElementById('fNIK').value,
		tanggal_lahir: document.getElementById('fTglLahir').value,
		jenis_kelamin: document.getElementById('fJK').value,
		kelurahan: document.getElementById('fKelurahan').value,
		status_kehadiran: document.getElementById('fKehadiran').value,
		status_skrining: document.getElementById('fSkrining').value,
		status_pelayanan: document.getElementById('fPelayanan').value,
		jenis_pemeriksaan: document.getElementById('fJenisPemeriksaan').value || 'Pemeriksaan Umum'
	};

	let result = null;
	try {
		if (editingRecord) {
			// Update
			const res = await fetch(`${API_URL}?id=${editingRecord.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(record)
			});
			result = await res.json();
			showToast('Data berhasil diperbarui!');
		} else {
			// Create
			const res = await fetch(API_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(record)
			});
			result = await res.json();
			showToast('Data berhasil disimpan!');
		}
		resetForm();
		fetchAllData();
	} catch (err) {
		showToast('Gagal menyimpan data', 'error');
	}
	btn.disabled = false;
	btnText.textContent = 'Simpan Data';
}

function resetForm() {
	document.getElementById('inputForm').reset();
	document.getElementById('fUmurThn').value = '';
	document.getElementById('fUmurBln').value = '';
	document.getElementById('fUmurHri').value = '';
	document.getElementById('editRecordId').value = '';
	document.getElementById('btnSaveText').textContent = 'Simpan Data';
	editingRecord = null;
}

function editRecord(id) {
	const rec = allData.find(r => r.id === parseInt(id));
	if (!rec) return;
	editingRecord = rec;
	document.getElementById('fTanggal').value = rec.tanggal_pemeriksaan || '';
	document.getElementById('fNama').value = rec.nama || '';
	document.getElementById('fNIK').value = rec.nik || '';
	document.getElementById('fTglLahir').value = rec.tanggal_lahir || '';
	calcAge();
	document.getElementById('fJK').value = rec.jenis_kelamin || '';
	document.getElementById('fKelurahan').value = rec.kelurahan || '';
	document.getElementById('fKehadiran').value = rec.status_kehadiran || '';
	document.getElementById('fSkrining').value = rec.status_skrining || '';
	document.getElementById('fPelayanan').value = rec.status_pelayanan || '';
	document.getElementById('fJenisPemeriksaan').value = rec.jenis_pemeriksaan || '';
	document.getElementById('btnSaveText').textContent = 'Update Data';
	showDashPage('inputData');
}

function requestDelete(id) {
	deleteTargetRecord = allData.find(r => r.id === parseInt(id));
	document.getElementById('deleteModal').classList.remove('hidden');
	lucide.createIcons();
}
function closeDeleteModal() {
	document.getElementById('deleteModal').classList.add('hidden');
	deleteTargetRecord = null;
}
async function confirmDelete() {
	if (!deleteTargetRecord) return;
	const btn = document.getElementById('btnConfirmDelete');
	btn.disabled = true; btn.textContent = 'Menghapus...';
	try {
		await fetch(`${API_URL}?id=${deleteTargetRecord.id}`, { method: 'DELETE' });
		showToast('Data berhasil dihapus');
		fetchAllData();
	} catch (err) {
		showToast('Gagal menghapus data', 'error');
	}
	btn.disabled = false; btn.textContent = 'Hapus';
	closeDeleteModal();
}

// Panggil fetchAllData saat halaman dimuat
window.addEventListener('DOMContentLoaded', fetchAllData);
