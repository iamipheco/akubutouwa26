/**
 * RSVP collector for the Akubutouwa26 invitation: every reply becomes a row in a Google Sheet.
 *
 * Setup (about 5 minutes):
 *  1. Create a Google Sheet. Rename the first tab to "RSVPs".
 *  2. Extensions → Apps Script. Delete the sample code and paste this whole file. Save.
 *  3. Deploy → New deployment → type "Web app".
 *       Execute as: Me
 *       Who has access: Anyone
 *     Click Deploy, approve the permissions, and copy the Web app URL (ends in /exec).
 *  4. In the website project, create a file named .env.local containing:
 *       VITE_RSVP_ENDPOINT=https://script.google.com/macros/s/XXXXXXXX/exec
 *     (or set the same variable in your hosting dashboard), then rebuild / redeploy.
 *
 * If you edit this script later, use Deploy → Manage deployments → Edit → New version,
 * so the same URL keeps working.
 */

const SHEET_NAME = 'RSVPs'
const HEADERS = ['Received', 'Name', 'Attending', 'Guests', 'Phone', 'Message', 'Sent from browser at']

function doPost(e) {
  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const data = JSON.parse(e.postData.contents)
    const sheet = getSheet_()
    sheet.appendRow([
      new Date(),
      clean_(data.name),
      data.attending === 'yes' ? 'Yes' : 'No',
      Number(data.guests) || 0,
      clean_(data.phone),
      clean_(data.message),
      clean_(data.submittedAt),
    ])
    return json_({ ok: true })
  } catch (err) {
    return json_({ ok: false, error: String(err) })
  } finally {
    lock.releaseLock()
  }
}

function doGet() {
  return json_({ ok: true, service: 'akubutouwa26-rsvp' })
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME)
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS)
    sheet.setFrozenRows(1)
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold')
  }
  return sheet
}

/** Keep cells as plain text so a reply can never run as a spreadsheet formula */
function clean_(v) {
  const s = String(v == null ? '' : v).slice(0, 2000)
  return /^[=+\-@]/.test(s) ? "'" + s : s
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}
