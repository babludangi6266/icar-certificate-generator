import * as XLSX from 'xlsx';

/**
 * Generates and triggers download of the pre-designed Sample Excel Template
 */
export const downloadSampleExcelTemplate = () => {
    const templateData = [
        {
            'Serial No': '165',
            'Category': 'ICAR Institute',
            'Institute Name': 'ICAR-CIWA',
            'Participant Name': 'Dr. Sweta Sahoo',
            'Training Dates': 'Oct 18-19, 2026'
        },
        {
            'Serial No': '166',
            'Category': 'KVK, ATARI Zone I, Ludhiana',
            'Institute Name': 'KVK, Zone I, Ludhiana',
            'Participant Name': 'Dr. Bharat Chandra Biswal',
            'Training Dates': 'July 22-29, 2026'
        },
        {
            'Serial No': '167',
            'Category': 'SAU',
            'Institute Name': 'PAU',
            'Participant Name': 'Dr. Sandeep Sharma',
            'Training Dates': 'July 27-29, 2026'
        },
        {
            'Serial No': '168',
            'Category': 'CAU',
            'Institute Name': 'RLBCAU Jhansi',
            'Participant Name': 'Bablu Dangi',
            'Training Dates': 'July 27-29, 2026'
        }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    
    // Set column widths for clean presentation
    worksheet['!cols'] = [
        { wch: 14 }, // Serial No
        { wch: 32 }, // Category
        { wch: 35 }, // Institute Name
        { wch: 28 }, // Participant Name
        { wch: 22 }  // Training Dates
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Participant Headcount Registry');

    // Trigger XLSX download
    XLSX.writeFile(workbook, 'ICAR_Participant_Import_Template.xlsx');
};

/**
 * Generates and triggers download of the pre-designed Sample Excel Template for Institute / Organization import
 */
export const downloadSampleOrgExcelTemplate = () => {
    const templateData = [
        {
            'Category': 'ICAR Institute',
            'Short Name': 'CIWA',
            'Full Name': 'ICAR-Central Institute for Women in Agriculture, Bhubaneswar'
        },
        {
            'Category': 'ICAR Institute',
            'Short Name': 'NRRI',
            'Full Name': 'ICAR-National Rice Research Institute, Cuttack'
        },
        {
            'Category': 'KVK',
            'Short Name': 'KVK Zone VIII',
            'Full Name': 'ICAR-Agricultural Technology Application Research Institute, Zone VIII, Pune'
        },
        {
            'Category': 'SAU',
            'Short Name': 'PAU',
            'Full Name': 'Punjab Agricultural University (PAU), Ludhiana'
        },
        {
            'Category': 'CAU',
            'Short Name': 'CAU Imphal',
            'Full Name': 'Central Agricultural University (CAU), Imphal'
        }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);

    worksheet['!cols'] = [
        { wch: 18 }, // Category
        { wch: 22 }, // Short Name
        { wch: 65 }  // Full Name
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Institutes & Organizations');

    XLSX.writeFile(workbook, 'ICAR_Institutes_Organizations_Template.xlsx');
};

/**
 * Parses uploaded Excel file (.xlsx, .xls, .csv) and returns array of object rows
 */
export const parseExcelFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                
                // Convert sheet to JSON rows using first row as headers
                const jsonRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
                resolve(jsonRows);
            } catch (err) {
                console.error("Error parsing Excel file:", err);
                reject(new Error("Failed to parse Excel file. Please ensure it is a valid .xlsx or .xls file."));
            }
        };

        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
};
