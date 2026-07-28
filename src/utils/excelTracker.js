import * as XLSX from 'xlsx';

const EXCEL_STORAGE_KEY = 'icar_certificate_download_history';

/**
 * Get all recorded download history from LocalStorage
 */
export const getDownloadHistory = () => {
  try {
    const data = localStorage.getItem(EXCEL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error reading download history:', err);
    return [];
  }
};

/**
 * Sync records to the server-side Excel file in admin data folder.
 * Returns a promise that resolves when the server has written the file.
 */
const syncWithServer = async (records) => {
  try {
    const response = await fetch('/api/save-excel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ records }),
    });
    if (!response.ok) {
      console.error('Server sync failed:', response.status);
    } else {
      console.log('Excel file synced to admin data folder successfully.');
    }
  } catch (err) {
    console.log('Server sync skipped (offline or unavailable):', err.message);
  }
};

/**
 * Record a new certificate download event, update counts & exact time,
 * and sync the updated data to the server-side Excel file automatically.
 * This does NOT trigger a browser file download.
 */
export const recordDownloadAndGenerateExcel = async (participantName, kvkName, atariZone) => {
  const history = getDownloadHistory();
  const now = new Date();
  
  // Format exact timestamp (e.g., 2026-07-28 23:11:22)
  const pad = (n) => String(n).padStart(2, '0');
  const exactTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  const cleanParticipant = participantName || 'Anonymous Participant';
  const cleanKvk = kvkName || 'Not Specified';
  const cleanZone = atariZone || 'Not Specified';

  // Find existing record for this participant to increment download count
  const existingRecordIndex = history.findIndex(
    (item) => item.participantName === cleanParticipant && item.kvkName === cleanKvk && item.atariZone === cleanZone
  );

  let newHistory;
  if (existingRecordIndex !== -1) {
    // Update existing record with new timestamp and incremented count
    newHistory = [...history];
    const currentCount = newHistory[existingRecordIndex].downloadCount || 1;
    newHistory[existingRecordIndex] = {
      ...newHistory[existingRecordIndex],
      lastTimeOfDownload: exactTime,
      downloadCount: currentCount + 1,
    };
  } else {
    // Add new record for new participant
    newHistory = [
      ...history,
      {
        participantName: cleanParticipant,
        kvkName: cleanKvk,
        atariZone: cleanZone,
        lastTimeOfDownload: exactTime,
        downloadCount: 1,
      },
    ];
  }

  // Save updated history in localStorage
  try {
    localStorage.setItem(EXCEL_STORAGE_KEY, JSON.stringify(newHistory));
  } catch (err) {
    console.error('Error saving download history:', err);
  }

  // Sync to server-side Excel file (admin data/certificate_downloads.xlsx)
  // This updates the file on disk so the admin can see it in file manager
  await syncWithServer(newHistory);

  return newHistory;
};

/**
 * Export Excel report — downloads the admin Excel file from the server.
 * This is called ONLY when the admin clicks "Export Admin Excel" button.
 */
export const exportExcelReport = async () => {
  // First, make sure the server file is up-to-date with latest localStorage data
  const records = getDownloadHistory();
  await syncWithServer(records);

  try {
    const response = await fetch('/api/download-admin-excel');
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'certificate_downloads.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      return;
    }
  } catch (err) {
    console.log('Server file download fallback to client generation:', err);
  }

  // Client-side fallback if server API is unavailable
  const excelData = records.map((item, index) => ({
    'S.No': index + 1,
    'Participant Name': item.participantName,
    'KVK Name': item.kvkName,
    'ATARI Zone': item.atariZone,
    'Time of Download': item.lastTimeOfDownload,
    'Download Count': item.downloadCount,
  }));

  if (excelData.length === 0) {
    excelData.push({
      'S.No': 1,
      'Participant Name': 'No downloads yet',
      'KVK Name': 'N/A',
      'ATARI Zone': 'N/A',
      'Time of Download': 'N/A',
      'Download Count': 0,
    });
  }

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  worksheet['!cols'] = [
    { wch: 6 },
    { wch: 30 },
    { wch: 30 },
    { wch: 45 },
    { wch: 22 },
    { wch: 16 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Certificate Downloads');
  XLSX.writeFile(workbook, 'certificate_downloads.xlsx');
};
