import dotenv from "dotenv";

import { google } from "googleapis";

dotenv.config();

export default async function updateSheet([values], sheetId) {
  const jwt = new google.auth.JWT({
    email: process.env.SERVICE_ACCOUNT_EMAIL,
    // replace function is used to replace the escaped newline characters with actual newline characters
    key: process.env.SERVICE_ACCOUNT_KEY.replace(/\\n/g, "\n"),
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
