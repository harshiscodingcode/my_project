import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { PlanDocument } from "@/models/Plan";

export async function createPlanPdf(plan: Partial<PlanDocument>) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.addPage([700, 900]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  let y = 850;

  const write = (text: string, options?: { size?: number; bold?: boolean; color?: [number, number, number] }) => {
    const size = options?.size ?? 11;
    const currentFont = options?.bold ? bold : font;
    const lines = text.match(/.{1,90}(\s|$)/g) ?? [text];

    for (const line of lines) {
      if (y < 50) {
        pdfDoc.addPage([700, 900]);
        y = 850;
      }

      const page = pdfDoc.getPages()[pdfDoc.getPages().length - 1];
      page.drawText(line.trim(), {
        x: 50,
        y,
        size,
        font: currentFont,
        color: options?.color ? rgb(...options.color) : rgb(0.1, 0.1, 0.1)
      });
      y -= size + 8;
    }
  };

  write("AI Business Planner", { size: 20, bold: true, color: [0.06, 0.45, 0.4] });
  write(plan.businessIdea ?? "", { size: 15, bold: true });
  write(plan.summary ?? "");
  write("30-Day Roadmap", { size: 15, bold: true });
  for (const step of plan.roadmap ?? []) {
    write(`Day ${step.day}: ${step.title} - ${step.description}`);
  }
  write("Required Tools", { size: 15, bold: true });
  write((plan.requiredTools ?? []).join(", "));
  write("Risk Analysis", { size: 15, bold: true });
  write((plan.riskAnalysis ?? []).join(" | "));

  return pdfDoc.save();
}
