import ExcelJS from "exceljs";
import { dialog } from "electron";
function styleWorksheet(
  worksheet: ExcelJS.Worksheet,
) {
  const header = worksheet.getRow(1);

  header.font = {
    bold: true,
    color: {
      argb: "FFFFFF",
    },
  };

  header.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: "1F4E78",
    },
  };

  header.alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });
}
function prettifyHeader(text: string) {
  return text
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase());
}

export async function exportToExcel<T extends Record<string, any>>(
  fileName: string,
  sheetName: string,
  data: T[],
) {
  if (!data.length) {
    throw new Error("No data available to export.");
  }

  const workbook = new ExcelJS.Workbook();

  workbook.creator = "Elameed System";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(sheetName);

  // Generate columns automatically
  worksheet.columns = Object.keys(data[0]).map((key) => ({
    header: prettifyHeader(key),
    key,
    width: 20,
  }));

  // Add rows
  data.forEach((row) => worksheet.addRow(row));

  styleWorksheet(worksheet);

  const { filePath } = await dialog.showSaveDialog({
    defaultPath: `${fileName}.xlsx`,
    filters: [
      {
        name: "Excel Workbook",
        extensions: ["xlsx"],
      },
    ],
  });

  if (!filePath) return;

  await workbook.xlsx.writeFile(filePath);
}