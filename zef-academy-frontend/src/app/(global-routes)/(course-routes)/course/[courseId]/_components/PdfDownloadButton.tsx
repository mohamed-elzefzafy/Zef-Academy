import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

const PdfDownloadButton = ({ url,originalName ="Download PDF" }: { url: string , originalName :string}) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = url;
    link.download = ""; // Optional: specify a filename
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      variant="contained"
      size="small"
      color="primary"
      startIcon={<DownloadIcon />}
      onClick={handleDownload}
    >
    {originalName}
    </Button>
  );
};

export default PdfDownloadButton;
