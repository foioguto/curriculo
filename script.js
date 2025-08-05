// PDF Generation functionality
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Function to generate PDF
async function generatePDF() {
  const button = document.getElementById('pdf-button');
  const originalText = button.textContent;
  
  try {
    // Show loading state
    button.textContent = 'Gerando PDF...';
    button.disabled = true;
    
    // Get the container element
    const element = document.querySelector('.container');
    
    // Configure html2canvas options for better quality
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight
    });
    
    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Calculate dimensions to fit A4
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 0;
    
    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Save the PDF
    pdf.save('curriculo-cesar-maia.pdf');
    
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    alert('Erro ao gerar PDF. Tente novamente.');
  } finally {
    // Reset button state
    button.textContent = originalText;
    button.disabled = false;
  }
}

// Add event listener when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const pdfButton = document.getElementById('pdf-button');
  if (pdfButton) {
    pdfButton.addEventListener('click', generatePDF);
  }
});