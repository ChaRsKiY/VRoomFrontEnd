import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const file = req.body; 
    const filePath = path.join(process.cwd(), "public/uploads", "subtitles.vtt");
    fs.writeFileSync(filePath, file);

    return res.status(200).json({ message: "Файл успешно сохранён." });
  }

  res.status(405).json({ message: "Метод не поддерживается." });
}
