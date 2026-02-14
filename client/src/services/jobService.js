import api from './api';

export const createJob = async (jobData) => {
  const response = await api.post('/jobs', jobData);
  return response.data;
};

export const getAllJobs = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  const response = await api.get(`/jobs?${query}`);
  return response.data;
};

export const updateJob = async (id, jobData) => {
  const response = await api.put(`/jobs/${id}`, jobData);
  return response.data;
};

export const deleteJob = async (id) => {
  const response = await api.delete(`/jobs/${id}`);
  return response.data;
};

export const scrapeJob = async (url) => {
  const response = await api.post('/jobs/scrape', { url });
  return response.data;
};

export const exportJobsToExcel = async () => { // Make this an async function
  try {
    const response = await api.get('/export/excel', {
      responseType: 'blob', // IMPORTANT: This tells Axios to expect binary data (the Excel file)
    });

    // Create a Blob from the response data
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // Dynamically create a link and click it to trigger the download
    const link = document.createElement('a');
    link.href = url;
    // Extract filename from response headers, or use a default
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'jobs.xlsx';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }
    link.setAttribute('download', filename); // Set the filename for download
    document.body.appendChild(link);
    link.click();
    link.remove(); // Clean up the element
    window.URL.revokeObjectURL(url); // Clean up the URL object

    return { success: true, message: 'Export successful' }; // Or whatever you need to return
  } catch (error) {
    console.error("Error exporting jobs:", error);
    throw error; // Re-throw to be caught by the component
  }
};