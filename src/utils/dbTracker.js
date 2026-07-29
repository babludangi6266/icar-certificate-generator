import { createClient } from "@libsql/client";
import * as XLSX from 'xlsx';

// Get Turso Database client using Vite environment variables
const getDb = () => {
    const url = import.meta.env.VITE_TURSO_DB_URL;
    const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN;

    if (!url) {
        console.warn("Turso DB credentials missing in .env: Please set VITE_TURSO_DB_URL and VITE_TURSO_AUTH_TOKEN");
        return null;
    }

    return createClient({
        url,
        authToken,
    });
};

/**
 * Initialize table if it doesn't exist
 */
export const initializeDB = async () => {
    const db = getDb();
    if (!db) return;

    try {
        await db.execute(`
        CREATE TABLE IF NOT EXISTS certificate_downloads (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          registered_name TEXT,
          certificate_name TEXT,
          email TEXT,
          mobile TEXT,
          wp_no TEXT,
          kvk_name TEXT,
          atari_zone TEXT,
          serial_number TEXT,
          download_time DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
        console.log("Turso Database initialized securely!");
    } catch (err) {
        console.error("Failed to initialize DB:", err);
    }
};

/**
 * Record a new certificate download directly to Turso DB.
 */
export const recordDownloadToTurso = async (data) => {
    const db = getDb();
    if (!db) return;

    try {
        await db.execute({
            sql: `INSERT INTO certificate_downloads (
            registered_name, certificate_name, email, mobile, wp_no, kvk_name, atari_zone, serial_number
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                data.registeredName || 'Unknown',
                data.certificateName || 'Unknown',
                data.email || 'N/A',
                data.mobile || 'N/A',
                data.wp || 'N/A',
                data.kvkName || 'Unknown',
                data.atariZone || 'Unknown',
                data.serialNumber || 'Unknown'
            ]
        });
        console.log("Successfully saved record to Turso Database!");
    } catch (err) {
        console.error("Error saving to Turso:", err);
    }
};

/**
 * Fetch all records from Turso DB and trigger Excel download.
 */
export const exportDBToExcel = async () => {
    const db = getDb();
    if (!db) {
        alert("Database is not configured properly or missing credentials.");
        return;
    }

    try {
        const result = await db.execute("SELECT * FROM certificate_downloads ORDER BY download_time DESC");

        // Map DB rows to Excel columns
        const excelData = result.rows.map((item, index) => ({
            'S.No': index + 1,
            'Registered Name': item.registered_name,
            'Certificate Name': item.certificate_name,
            'Email': item.email,
            'Mobile No': item.mobile,
            'WhatsApp No': item.wp_no,
            'KVK Name': item.kvk_name,
            'ATARI Zone': item.atari_zone,
            'Serial Number': item.serial_number,
            'Time of Download': item.download_time
        }));

        if (excelData.length === 0) {
            excelData.push({
                'S.No': 1,
                'Registered Name': 'No downloads yet',
                'Email': 'N/A',
                'Mobile No': 'N/A',
                'WhatsApp No': 'N/A',
                'KVK Name': 'N/A',
                'ATARI Zone': 'N/A',
                'Serial Number': 'N/A',
                'Time of Download': 'N/A'
            });
        }

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        worksheet['!cols'] = [
            { wch: 6 },  // S.No
            { wch: 25 }, // Registered Name
            { wch: 25 }, // Certificate Name
            { wch: 30 }, // Email
            { wch: 15 }, // Mobile
            { wch: 15 }, // WA
            { wch: 25 }, // KVK
            { wch: 35 }, // ATARI
            { wch: 22 }, // Serial Number
            { wch: 25 }  // Time Downloaded
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Certificate Downloads');
        XLSX.writeFile(workbook, 'admin_certificate_downloads.xlsx');

    } catch (err) {
        console.error("Failed to export DB to Excel:", err);
        alert("Failed to export. Check console for details.");
    }
};
