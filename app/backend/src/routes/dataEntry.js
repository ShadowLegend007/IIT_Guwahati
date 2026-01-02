import { Router } from "express";
import { textData } from "../controllers/textController.js";
import { requireFields } from "../middleware/requireValidation.js";

const dataEntry = Router();

dataEntry.post(
  "/text",
  requireFields(["product_name", "language"]),
  textData
);

export default dataEntry;
 