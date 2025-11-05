import { NextResponse } from "next/server";
import { PDFDocument, PDFPage, rgb, StandardFonts, type PDFFont } from "pdf-lib";

const pageSize = {
  width: 595.28,
  height: 841.89
};

async function createPdf() {
  const pdfDoc = await PDFDocument.create();
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const accent = rgb(43 / 255, 122 / 255, 120 / 255);
  const accentLight = rgb(222 / 255, 242 / 255, 241 / 255);
  const textPrimary = rgb(16 / 255, 42 / 255, 67 / 255);
  const textSecondary = rgb(72 / 255, 101 / 255, 129 / 255);

  const margin = 60;
  const maxWidth = pageSize.width - margin * 2;

  function wrapText(text: string, font: PDFFont, fontSize: number, availableWidth: number) {
    const paragraphs = text.split("\n");
    const lines: string[] = [];
    paragraphs.forEach((paragraph) => {
      const words = paragraph.split(/\s+/);
      let currentLine = "";
      words.forEach((word) => {
        const tentative = currentLine ? `${currentLine} ${word}` : word;
        const width = font.widthOfTextAtSize(tentative, fontSize);
        if (width <= availableWidth) {
          currentLine = tentative;
        } else {
          if (currentLine) {
            lines.push(currentLine);
          }
          currentLine = word;
        }
      });
      if (currentLine) {
        lines.push(currentLine);
      }
      lines.push("\n");
    });
    if (lines.length && lines[lines.length - 1] === "\n") {
      lines.pop();
    }
    return lines;
  }

  function drawParagraph(args: {
    page: PDFPage;
    text: string;
    font: PDFFont;
    size: number;
    x: number;
    y: number;
    lineHeight?: number;
    color?: ReturnType<typeof rgb>;
  }) {
    const { page, text, font, size, x, y, lineHeight = size * 1.4, color = textSecondary } = args;
    const lines = wrapText(text, font, size, maxWidth);
    let cursorY = y;
    lines.forEach((line) => {
      if (line === "\n") {
        cursorY -= lineHeight * 0.6;
      } else {
        page.drawText(line, { x, y: cursorY, size, font, color });
        cursorY -= lineHeight;
      }
    });
    return cursorY;
  }

  function drawHeading(page: PDFPage, text: string, y: number, size = 26) {
    page.drawText(text, {
      x: margin,
      y,
      size,
      font: boldFont,
      color: accent
    });
    page.drawRectangle({
      x: margin,
      y: y - 6,
      width: boldFont.widthOfTextAtSize(text, size),
      height: 2,
      color: accent
    });
  }

  function drawBulletList(args: {
    page: PDFPage;
    items: string[];
    y: number;
    fontSize?: number;
  }) {
    const { page, items, y, fontSize = 12 } = args;
    let cursorY = y;
    items.forEach((item) => {
      const bullet = "•";
      page.drawText(bullet, {
        x: margin,
        y: cursorY,
        size: fontSize,
        font: boldFont,
        color: textPrimary
      });
      cursorY = drawParagraph({
        page,
        text: item,
        font: regularFont,
        size: fontSize,
        x: margin + 14,
        y: cursorY,
        lineHeight: fontSize * 1.35,
        color: textPrimary
      });
      cursorY -= 4;
    });
    return cursorY;
  }

  // Página 1 - Capa
  let page = pdfDoc.addPage([pageSize.width, pageSize.height]);
  page.drawRectangle({
    x: 0,
    y: 0,
    width: pageSize.width,
    height: pageSize.height,
    color: accentLight
  });
  page.drawRectangle({
    x: margin,
    y: pageSize.height - 220,
    width: pageSize.width - margin * 2,
    height: 160,
    color: accent
  });
  page.drawText("Apostila de Matemática", {
    x: margin + 24,
    y: pageSize.height - 100,
    size: 24,
    font: regularFont,
    color: rgb(1, 1, 1)
  });
  page.drawText("Operações Fundamentais com Números Naturais", {
    x: margin + 24,
    y: pageSize.height - 140,
    size: 32,
    font: boldFont,
    color: rgb(1, 1, 1)
  });

  page.drawRectangle({
    x: margin,
    y: pageSize.height - 340,
    width: pageSize.width - margin * 2,
    height: 280,
    borderWidth: 1,
    borderColor: accent,
    color: rgb(1, 1, 1),
    opacity: 0
  });

  const introY = pageSize.height - 360;
  drawParagraph({
    page,
    text: "Esta apostila apresenta os principais conceitos, representações visuais e estratégias de resolução das quatro operações fundamentais com números naturais. Acompanhe mapas conceituais, exemplos resolvidos passo a passo e uma coleção de exercícios contextualizados para consolidar o aprendizado.",
    font: regularFont,
    size: 13,
    x: margin,
    y: introY,
    lineHeight: 18,
    color: textPrimary
  });

  drawParagraph({
    page,
    text: "Inclui: teoria com linguagem simples, diagramas ilustrados, algoritmos tradicionais com comentários, exercícios graduados e atividades investigativas com tabelas, gráficos e representações visuais consistentes.",
    font: regularFont,
    size: 13,
    x: margin,
    y: introY - 120,
    lineHeight: 18,
    color: textPrimary
  });

  page.drawRectangle({
    x: margin,
    y: pageSize.height - 520,
    width: pageSize.width - margin * 2,
    height: 120,
    color: rgb(1, 1, 1),
    borderColor: accent,
    borderWidth: 1
  });
  page.drawText("Sumário", {
    x: margin + 16,
    y: pageSize.height - 410,
    size: 18,
    font: boldFont,
    color: accent
  });
  const sumario = [
    "1. Introdução às operações básicas",
    "2. Adição e subtração com representações visuais",
    "3. Multiplicação e divisão com estratégias variadas",
    "4. Propriedades e conexões entre as operações",
    "5. Lista de exercícios graduados e contextualizados"
  ];
  sumario.forEach((item, index) => {
    page.drawText(item, {
      x: margin + 16,
      y: pageSize.height - 440 - index * 22,
      size: 12,
      font: regularFont,
      color: textSecondary
    });
  });

  // Página 2 - Teoria de adição e subtração
  page = pdfDoc.addPage([pageSize.width, pageSize.height]);
  drawHeading(page, "1. Adição", pageSize.height - 80);
  let cursorY = pageSize.height - 120;
  cursorY = drawParagraph({
    page,
    text: "Somar é juntar quantidades. Utilizamos a soma para acrescentar, combinar e comparar coleções. Representamos a adição como a união de conjuntos ou o deslocamento positivo em uma reta numérica.",
    font: regularFont,
    size: 12,
    x: margin,
    y: cursorY,
    lineHeight: 16,
    color: textPrimary
  });
  cursorY = drawBulletList({
    page,
    items: [
      "Propriedade comutativa: a ordem das parcelas não altera o resultado (a + b = b + a).",
      "Propriedade associativa: podemos agrupar as parcelas de diferentes maneiras (a + (b + c) = (a + b) + c).",
      "Elemento neutro: adicionar zero não modifica a quantidade (a + 0 = a)."
    ],
    y: cursorY - 8,
    fontSize: 12
  });

  // Diagrama de barras para adição
  const diagramY = cursorY - 30;
  page.drawRectangle({
    x: margin,
    y: diagramY - 80,
    width: maxWidth,
    height: 90,
    color: accentLight,
    opacity: 0.7
  });
  page.drawText("Modelo de barras: 48 + 27", {
    x: margin + 12,
    y: diagramY + 6,
    size: 12,
    font: boldFont,
    color: accent
  });
  const barBaseY = diagramY - 20;
  page.drawRectangle({
    x: margin + 12,
    y: barBaseY,
    width: 200,
    height: 20,
    color: accent
  });
  page.drawRectangle({
    x: margin + 212,
    y: barBaseY,
    width: 112,
    height: 20,
    color: rgb(58 / 255, 175 / 255, 169 / 255)
  });
  page.drawText("48", {
    x: margin + 92,
    y: barBaseY + 4,
    size: 12,
    font: boldFont,
    color: rgb(1, 1, 1)
  });
  page.drawText("27", {
    x: margin + 256,
    y: barBaseY + 4,
    size: 12,
    font: boldFont,
    color: rgb(1, 1, 1)
  });
  page.drawText("Resultado: 75", {
    x: margin + 12,
    y: barBaseY - 24,
    size: 12,
    font: regularFont,
    color: textPrimary
  });

  // Subtração
  const subHeadingY = barBaseY - 60;
  drawHeading(page, "2. Subtração", subHeadingY);
  cursorY = subHeadingY - 40;
  cursorY = drawParagraph({
    page,
    text: "Subtrair é retirar ou comparar quantidades. A subtração responde a perguntas como: quantos faltam, quantos sobraram ou qual é a diferença entre duas medidas.",
    font: regularFont,
    size: 12,
    x: margin,
    y: cursorY,
    lineHeight: 16,
    color: textPrimary
  });
  cursorY = drawBulletList({
    page,
    items: [
      "Modelos: retirar objetos de um conjunto, completar uma quantidade ou comparar valores.",
      "Reta numérica: deslocamento para a esquerda representa a subtração.",
      "Relação inversa com a adição: podemos verificar uma subtração por meio da soma." 
    ],
    y: cursorY - 4,
    fontSize: 12
  });

  // Reta numérica
  const numberLineY = cursorY - 20;
  page.drawRectangle({
    x: margin,
    y: numberLineY - 80,
    width: maxWidth,
    height: 90,
    color: rgb(1, 1, 1),
    borderColor: accent,
    borderWidth: 1,
    opacity: 0
  });
  page.drawText("Reta numérica: 84 - 27", {
    x: margin + 16,
    y: numberLineY,
    size: 12,
    font: boldFont,
    color: accent
  });
  const lineY = numberLineY - 18;
  page.drawLine({
    start: { x: margin + 20, y: lineY },
    end: { x: pageSize.width - margin - 20, y: lineY },
    thickness: 2,
    color: textPrimary
  });
  for (let i = 0; i <= 6; i++) {
    const x = margin + 20 + i * 70;
    page.drawLine({
      start: { x, y: lineY - 6 },
      end: { x, y: lineY + 6 },
      thickness: 1.5,
      color: textPrimary
    });
    const value = 84 - i * 5;
    page.drawText(String(value), {
      x: x - 8,
      y: lineY - 20,
      size: 10,
      font: regularFont,
      color: textSecondary
    });
  }
  page.drawLine({
    start: { x: margin + 20, y: lineY + 2 },
    end: { x: margin + 20 + 54, y: lineY + 40 },
    thickness: 1,
    color: accent
  });
  page.drawLine({
    start: { x: margin + 20 + 54, y: lineY + 40 },
    end: { x: margin + 20 + 108, y: lineY + 2 },
    thickness: 1,
    color: accent
  });
  page.drawText("-20", { x: margin + 35, y: lineY + 18, size: 10, font: boldFont, color: accent });
  page.drawText("-7", { x: margin + 100, y: lineY + 18, size: 10, font: boldFont, color: accent });

  // Página 3 - Multiplicação e divisão
  page = pdfDoc.addPage([pageSize.width, pageSize.height]);
  drawHeading(page, "3. Multiplicação", pageSize.height - 80);
  cursorY = pageSize.height - 120;
  cursorY = drawParagraph({
    page,
    text: "Multiplicar é formar grupos iguais ou repetir uma mesma quantidade. Pode ser representada por matrizes, retângulos, combinações e deslocamentos múltiplos na reta numérica.",
    font: regularFont,
    size: 12,
    x: margin,
    y: cursorY,
    lineHeight: 16,
    color: textPrimary
  });
  cursorY = drawBulletList({
    page,
    items: [
      "Propriedade comutativa: 4 × 3 produz o mesmo resultado que 3 × 4, embora o arranjo visual possa mudar.",
      "Propriedade distributiva: podemos decompor fatores para facilitar cálculos mentais (8 × 12 = 8 × (10 + 2)).",
      "Relação com a área: retângulos ajudam a visualizar produtos como o total de pequenos quadrados." 
    ],
    y: cursorY - 6,
    fontSize: 12
  });

  // Matriz multiplicativa
  const arrayY = cursorY - 16;
  page.drawRectangle({
    x: margin,
    y: arrayY - 120,
    width: maxWidth,
    height: 140,
    color: accentLight,
    opacity: 0.6
  });
  page.drawText("Arranjo retangular: 4 × 6", {
    x: margin + 16,
    y: arrayY,
    size: 12,
    font: boldFont,
    color: accent
  });
  const startX = margin + 40;
  const startY = arrayY - 30;
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 6; col++) {
      page.drawRectangle({
        x: startX + col * 28,
        y: startY - row * 28,
        width: 24,
        height: 24,
        borderColor: accent,
        borderWidth: 1.2,
        color: rgb(1, 1, 1)
      });
    }
  }
  page.drawText("Total = 24 unidades", {
    x: margin + 16,
    y: startY - 120,
    size: 11,
    font: regularFont,
    color: textPrimary
  });

  // Divisão
  const divisionHeadingY = startY - 160;
  drawHeading(page, "4. Divisão", divisionHeadingY);
  cursorY = divisionHeadingY - 40;
  cursorY = drawParagraph({
    page,
    text: "Dividir é repartir em partes iguais ou descobrir quantas vezes um número cabe em outro. Na divisão exata não há resto; na divisão não exata, interpretamos o resto de acordo com o contexto.",
    font: regularFont,
    size: 12,
    x: margin,
    y: cursorY,
    lineHeight: 16,
    color: textPrimary
  });
  cursorY = drawBulletList({
    page,
    items: [
      "Estratégias: partilhar (distribuir igualmente) ou medir (ver quantas vezes cabe).",
      "Ligação com multiplicação: se 7 × 8 = 56, então 56 ÷ 7 = 8.",
      "Estimativa: aproximar dividendos e divisores facilita divisões com números grandes." 
    ],
    y: cursorY - 4,
    fontSize: 12
  });

  // Diagrama de partilha
  const sharingY = cursorY - 10;
  page.drawRectangle({
    x: margin,
    y: sharingY - 120,
    width: maxWidth,
    height: 130,
    borderColor: accent,
    borderWidth: 1,
    color: rgb(1, 1, 1)
  });
  page.drawText("Partilha Equitativa: 96 ÷ 4", {
    x: margin + 16,
    y: sharingY,
    size: 12,
    font: boldFont,
    color: accent
  });
  const centerX = margin + maxWidth / 2;
  page.drawCircle({ x: centerX, y: sharingY - 40, size: 45, color: accentLight });
  const offsets = [-120, -40, 40, 120];
  offsets.forEach((offset, idx) => {
    const boxX = centerX + offset;
    page.drawLine({
      start: { x: centerX, y: sharingY - 40 },
      end: { x: boxX, y: sharingY - 120 },
      thickness: 1.2,
      color: accent
    });
    page.drawRectangle({ x: boxX - 32, y: sharingY - 160, width: 64, height: 40, borderColor: accent, borderWidth: 1.2, color: accentLight });
    page.drawText(`${96 / 4}`, {
      x: boxX - 12,
      y: sharingY - 135,
      size: 12,
      font: boldFont,
      color: accent
    });
    page.drawText(`Grupo ${idx + 1}`, {
      x: boxX - 22,
      y: sharingY - 178,
      size: 9,
      font: regularFont,
      color: textSecondary
    });
  });

  // Página 4 - Exercícios
  page = pdfDoc.addPage([pageSize.width, pageSize.height]);
  drawHeading(page, "5. Exercícios Graduados", pageSize.height - 80);
  cursorY = pageSize.height - 120;

  const exerciciosIntro = "Resolva os exercícios a seguir utilizando estratégias variadas. Organize os cálculos em tabelas, diagramas ou representações gráficas quando solicitado.";
  cursorY = drawParagraph({
    page,
    text: exerciciosIntro,
    font: regularFont,
    size: 12,
    x: margin,
    y: cursorY,
    lineHeight: 16,
    color: textPrimary
  });

  const listaExercicios = [
    "Calcule mentalmente: 37 + 25, 48 + 36 e 125 + 59. Explique como reagrupou dezenas e unidades.",
    "Resolva 905 - 478 utilizando o algoritmo tradicional e verifique o resultado por meio da adição.",
    "Construa uma tabela para as parcelas de 6 em 6 até alcançar 72. Qual é o produto 6 × 12? Represente por um gráfico de barras.",
    "Um caminhão descarregou 168 caixas em pilhas com 8 caixas cada. Quantas pilhas completas foram formadas e quantas caixas restaram?",
    "Escreva duas situações-problema para a operação 84 ÷ 6. Uma no modelo partilha e outra no modelo medida.",
    "Desafio investigativo: usando os números 3, 4, 5 e 6 uma única vez, construa duas expressões diferentes que resultem em 42."
  ];
  cursorY = drawBulletList({ page, items: listaExercicios, y: cursorY - 8, fontSize: 12 });

  // Gráfico de barras contextual
  const graphTop = cursorY - 10;
  page.drawRectangle({ x: margin, y: graphTop - 200, width: maxWidth, height: 210, color: accentLight, opacity: 0.4 });
  page.drawText("Gráfico de barras - Distância percorrida por volta", {
    x: margin + 16,
    y: graphTop - 10,
    size: 12,
    font: boldFont,
    color: accent
  });
  const axisOriginX = margin + 60;
  const axisOriginY = graphTop - 170;
  page.drawLine({
    start: { x: axisOriginX, y: axisOriginY },
    end: { x: axisOriginX, y: graphTop - 170 + 140 },
    thickness: 1.2,
    color: textPrimary
  });
  page.drawLine({
    start: { x: axisOriginX, y: axisOriginY },
    end: { x: margin + maxWidth - 40, y: axisOriginY },
    thickness: 1.2,
    color: textPrimary
  });
  for (let i = 0; i <= 4; i++) {
    const yTick = axisOriginY + i * 28;
    page.drawLine({
      start: { x: axisOriginX - 6, y: yTick },
      end: { x: axisOriginX, y: yTick },
      thickness: 1,
      color: textPrimary
    });
    page.drawText(`${i * 2} km`, {
      x: axisOriginX - 50,
      y: yTick - 4,
      size: 10,
      font: regularFont,
      color: textSecondary
    });
  }
  const laps = [1, 4, 8, 12];
  laps.forEach((lap, idx) => {
    const barHeight = (lap * 0.85) * 10; // escala
    const barWidth = 40;
    const barX = axisOriginX + 20 + idx * (barWidth + 24);
    page.drawRectangle({
      x: barX,
      y: axisOriginY,
      width: barWidth,
      height: barHeight,
      color: accent,
      opacity: 0.8
    });
    page.drawText(`${lap}ª`, {
      x: barX + 8,
      y: axisOriginY - 20,
      size: 10,
      font: regularFont,
      color: textSecondary
    });
  });

  // Quadro de autoavaliação
  const tableY = axisOriginY - 80;
  page.drawRectangle({ x: margin, y: tableY - 120, width: maxWidth, height: 130, borderColor: accent, borderWidth: 1.2, color: rgb(1, 1, 1) });
  page.drawText("Autoavaliação", { x: margin + 16, y: tableY + 6, size: 12, font: boldFont, color: accent });
  const columns = ["Competência", "Como me sinto?", "O que revisar?"];
  const colWidths = [220, 150, 200];
  let colX = margin + 16;
  columns.forEach((col, idx) => {
    page.drawText(col, { x: colX, y: tableY - 14, size: 11, font: boldFont, color: textPrimary });
    if (idx < columns.length - 1) {
      colX += colWidths[idx];
    }
  });
  for (let row = 0; row < 3; row++) {
    const rowY = tableY - 40 - row * 28;
    page.drawLine({
      start: { x: margin + 16, y: rowY },
      end: { x: margin + maxWidth - 16, y: rowY },
      thickness: 0.8,
      color: accentLight
    });
  }
  colX = margin + 16;
  const competencias = [
    "Resolvo adições e subtrações com compreensão.",
    "Relaciono multiplicação e divisão em problemas.",
    "Utilizo diagramas e gráficos para explicar raciocínios."
  ];
  competencias.forEach((comp, idx) => {
    const rowY = tableY - 34 - idx * 28;
    page.drawText(comp, { x: colX, y: rowY, size: 10, font: regularFont, color: textSecondary });
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

export async function GET() {
  const pdfBytes = await createPdf();
  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=apostila-operacoes-naturais.pdf"
    }
  });
}
