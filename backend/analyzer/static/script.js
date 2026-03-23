// Build API base dynamically to support port fallback (8000 or 8001) and same-origin deployment
const API_BASE = `${window.location.origin}/api`;

const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const uploadLabel = document.getElementById('uploadLabel');
const uploadSpinner = document.getElementById('uploadSpinner');
const message = document.getElementById('message');

const previewSection = document.getElementById('previewSection');
const previewTable = document.getElementById('previewTable');

const statsSection = document.getElementById('statsSection');
const statsTable = document.getElementById('statsTable');

const insightsSection = document.getElementById('insightsSection');
const insightsContent = document.getElementById('insightsContent');

const outliersSection = document.getElementById('outliersSection');
const outliersContent = document.getElementById('outliersContent');

const graphsSection = document.getElementById('graphsSection');
const graphsContent = document.getElementById('graphsContent');

const downloadSection = document.getElementById('downloadSection');
const dlCsv = document.getElementById('dlCsv');
const dlExcel = document.getElementById('dlExcel');
const dlPdf = document.getElementById('dlPdf');
const dlDocx = document.getElementById('dlDocx');

function setLoading(isLoading) {
  uploadBtn.disabled = isLoading;
  uploadSpinner.classList.toggle('d-none', !isLoading);
  uploadLabel.textContent = isLoading ? 'Processing...' : 'Upload & Analyze';
}

function showMessage(type, text) {
  message.innerHTML = '';
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = text;
  message.appendChild(alert);
}

function buildTable(el, rows) {
  if (!rows || rows.length === 0) {
    el.innerHTML = '<tbody><tr><td>No data</td></tr></tbody>';
    return;
  }
  const headers = Object.keys(rows[0]);
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  const hr = document.createElement('tr');
  headers.forEach(h => {
    const th = document.createElement('th');
    th.textContent = h;
    hr.appendChild(th);
  });
  thead.appendChild(hr);
  rows.forEach(r => {
    const tr = document.createElement('tr');
    headers.forEach(h => {
      const td = document.createElement('td');
      td.textContent = r[h];
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  el.innerHTML = '';
  el.appendChild(thead);
  el.appendChild(tbody);
}

uploadBtn.addEventListener('click', async () => {
  previewSection.classList.add('d-none');
  statsSection.classList.add('d-none');
  insightsSection.classList.add('d-none');
  outliersSection.classList.add('d-none');
  graphsSection.classList.add('d-none');
  downloadSection.classList.add('d-none');
  message.innerHTML = '';

  const file = fileInput.files[0];
  if (!file) {
    showMessage('warning', 'Please choose a CSV or Excel (.xlsx) file.');
    return;
  }
  const ext = file.name.split('.').pop().toLowerCase();
  if (!['csv', 'xlsx'].includes(ext)) {
    showMessage('danger', 'Only CSV and Excel (.xlsx) are allowed.');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  setLoading(true);
  try {
    const res = await fetch(`${API_BASE}/upload/`, { method: 'POST', body: formData });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Upload failed');
    }
    showMessage('success', data.message || 'Analysis ready');

    buildTable(previewTable, data.preview || []);
    previewSection.classList.remove('d-none');

    if (Array.isArray(data.describe) && data.describe.length > 0) {
      buildTable(statsTable, data.describe);
      statsSection.classList.remove('d-none');
    }

    insightsContent.innerHTML = '';
    const numeric = data.statements?.numeric || {};
    const objectS = data.statements?.object || {};
    const addSection = (title) => {
      const h = document.createElement('h6');
      h.textContent = title;
      insightsContent.appendChild(h);
    };
    Object.keys(numeric).forEach(col => {
      const h = document.createElement('div'); h.className = 'mb-1 fw-semibold'; h.textContent = col;
      const ul = document.createElement('ul');
      (numeric[col] || []).forEach(s => { const li = document.createElement('li'); li.textContent = s; ul.appendChild(li); });
      insightsContent.appendChild(h); insightsContent.appendChild(ul);
    });
    if (Object.keys(objectS).length > 0) addSection('Object Columns');
    Object.keys(objectS).forEach(col => {
      const h = document.createElement('div'); h.className = 'mb-1 fw-semibold'; h.textContent = col;
      const ul = document.createElement('ul');
      (objectS[col] || []).forEach(s => { const li = document.createElement('li'); li.textContent = s; ul.appendChild(li); });
      insightsContent.appendChild(h); insightsContent.appendChild(ul);
    });
    insightsSection.classList.toggle('d-none', (Object.keys(numeric).length + Object.keys(objectS).length) === 0);

    outliersContent.innerHTML = '';
    const outMap = data.outliers || {};
    if (Object.keys(outMap).length > 0) {
      const table = document.createElement('table');
      table.className = 'table table-sm mb-0';
      const thead = document.createElement('thead');
      const hr = document.createElement('tr');
      ['Column', 'Outlier Count'].forEach(h => { const th = document.createElement('th'); th.textContent = h; hr.appendChild(th); });
      thead.appendChild(hr);
      const tbody = document.createElement('tbody');
      Object.keys(outMap).forEach(c => {
        const tr = document.createElement('tr');
        const td1 = document.createElement('td'); td1.textContent = c;
        const td2 = document.createElement('td'); td2.textContent = outMap[c];
        tr.appendChild(td1); tr.appendChild(td2);
        tbody.appendChild(tr);
      });
      table.appendChild(thead); table.appendChild(tbody);
      outliersContent.appendChild(table);
      outliersSection.classList.remove('d-none');
    }

    graphsContent.innerHTML = '';
    (data.graphs || []).forEach(url => {
      const img = document.createElement('img');
      const absolute = url.startsWith('http') ? url : `http://127.0.0.1:8000${url}`;
      img.src = absolute;
      img.className = 'img-fluid me-2 mb-2';
      img.style.maxWidth = '360px';
      img.style.maxHeight = '240px';
      graphsContent.appendChild(img);
    });
    graphsSection.classList.toggle('d-none', (data.graphs || []).length === 0);

    dlCsv.href = data.downloads?.csv || '#';
    dlCsv.href = `${API_BASE}/download/excel/`.replace('/api', '/api'); // CSV not provided now; use Excel/PDF/DOCX
    dlExcel.href = `${API_BASE}/download/excel/`;
    dlPdf.href = `${API_BASE}/download/pdf/`;
    dlDocx.href = `${API_BASE}/download/docx/`;
  } catch (err) {

    // Dashboard cards
    const totals = data.totals || {};
    const cards = document.getElementById('dashboardCards');
    if (cards) {
      document.getElementById('totalRecords').textContent = totals.rows ?? '—';
      document.getElementById('numericCols').textContent = totals.numeric_cols ?? '—';
      document.getElementById('objectCols').textContent = totals.object_cols ?? '—';
      cards.classList.remove('d-none');
    }

    // Outlier insights
    const insightsBox = document.getElementById('outlierInsights');
    if (insightsBox) {
      const outMap = data.outliers || {};
      const lines = ['Outlier analysis was performed using the IQR method.'];
      const keys = Object.keys(outMap);
      if (keys.length === 0) {
        lines.push('No significant outliers detected.');
      } else {
        keys.forEach(c => {
          const n = outMap[c] ?? 0;
          if (n > 0) {
            lines.push(`${c} column has ${n} detected outliers.`);
          } else {
            lines.push(`No significant outliers detected in ${c}.`);
          }
        });
        lines.push('Outliers represent unusually high or low values.');
      }
      insightsBox.innerHTML = lines.map(t => `<div>${t}</div>`).join('');
    }
  } catch (err) {
    showMessage('danger', err.message || 'Something went wrong');
  } finally {
    setLoading(false);
  }
});
