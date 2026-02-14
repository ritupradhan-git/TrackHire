import ExcelJS from 'exceljs';
import path from 'path';
import { fileURLToPath } from 'url';
import { formatDateForDisplay } from '../utils/dateFormatter.js';

// recreate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateExcelFromTemplate = async (jobs) => {
  const workbook = new ExcelJS.Workbook();

  // Correct template path
  const templatePath = path.resolve(
  process.cwd(),
  'templates/job_template.xlsx'
);


  try {
    await workbook.xlsx.readFile(templatePath);
  } catch (error) {
    console.error(`Error reading Excel template at ${templatePath}:`, error);
    throw new Error(
      'Failed to load Excel template. Ensure job_template.xlsx exists in templates folder.'
    );
  }

  const sheet = workbook.getWorksheet(1);

  jobs.forEach(job => {
    sheet.addRow([
      formatDateForDisplay(job.dateAdded),
      job.title,
      job.company,
      job.location,
      job.salary,
      job.experience,
      job.status,
      job.notes,
      job.sourceUrl
    ]);
  });

  return await workbook.xlsx.writeBuffer();
};

export default generateExcelFromTemplate;
