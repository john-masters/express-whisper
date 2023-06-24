import express from "express";
import dotenv from "dotenv";

import { google } from "googleapis";
import { readFileSync } from "fs";

dotenv.config();

export default async function updateSheet([values], sheetId) {
  const serviceAccount = JSON.parse(
    readFileSync("service_account.json", "utf8")
  );

  const jwt = new google.auth.JWT({
    email: serviceAccount.client_email,
    key: serviceAccount.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth: jwt });
  try {
    const response = (
      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: "Sheet1!A1:D1",
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        resource: {
          values: [values],
        },
      })
    ).data;

    return response;
  } catch (err) {
    console.log("Error updating sheet: ", err);
    return err;
  }
}
