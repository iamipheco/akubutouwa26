/**
 * RSVP collector for the Akubutouwa26 invitation: every guest gets ONE row in a Google Sheet.
 * When a guest changes their reply, their existing row is updated (matched by the reply id
 * their browser sends), and the "Updated" column records when.
 *
 * Setup (about 5 minutes):
 *  1. Create a Google Sheet. (The script creates the "Akubutouwa's RSVPs" tab itself.)
 *  2. Extensions → Apps Script. Delete the sample code and paste this whole file. Save.
 *  3. Deploy → New deployment → type "Web app".
 *       Execute as: Me
 *       Who has access: Anyone
 *     Click Deploy, approve the permissions, and copy the Web app URL (ends in /exec).
 *  4. Set VITE_RSVP_ENDPOINT to that URL (.env.local, or your host's dashboard) and redeploy the site.
 *
 * Updating this script later: paste the new code, Save, then
 * Deploy → Manage deployments → ✏️ Edit → Version: "New version" → Deploy.
 * (That keeps the same URL. A brand-new deployment would give you a new URL.)
 */

const SHEET_NAME = "Akubutouwa's RSVPs"
const OLD_SHEET_NAMES = ['RSVPs'] // renamed automatically, so earlier replies stay put
const HEADERS = ['Received', 'Name', 'Attending', 'Guests', 'Phone', 'Message', 'Sent from browser at', 'Reply ID', 'Updated']
const COL = { received: 1, name: 2, attending: 3, guests: 4, phone: 5, message: 6, sentAt: 7, id: 8, updated: 9 }

function doPost(e) {
  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const data = JSON.parse(e.postData.contents)
    const sheet = getSheet_()
    const id = clean_(data.id)
    const values = [
      clean_(data.name),
      data.attending === 'yes' ? 'Yes' : 'No',
      Number(data.guests) || 0,
      clean_(data.phone),
      clean_(data.message),
      clean_(data.submittedAt),
    ]

    const row = id ? findRow_(sheet, id) : 0
    if (row) {
      // same guest changing their reply: update their row in place
      sheet.getRange(row, COL.phone).setNumberFormat('@')
      sheet.getRange(row, COL.name, 1, values.length).setValues([values])
      sheet.getRange(row, COL.updated).setValue(new Date())
      return json_({ ok: true, updated: true })
    }

    const next = sheet.getLastRow() + 1
    sheet.getRange(next, COL.phone).setNumberFormat('@') // keep the leading 0 on phone numbers
    sheet.getRange(next, 1, 1, HEADERS.length).setValues([[new Date(), ...values, id, '']])
    return json_({ ok: true, updated: false })
  } catch (err) {
    return json_({ ok: false, error: String(err) })
  } finally {
    lock.releaseLock()
  }
}

function doGet() {
  return json_({ ok: true, service: 'akubutouwa26-rsvp' })
}

function findRow_(sheet, id) {
  const last = sheet.getLastRow()
  if (last < 2) return 0
  const hit = sheet.getRange(2, COL.id, last - 1, 1).createTextFinder(id).matchEntireCell(true).findNext()
  return hit ? hit.getRow() : 0
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(SHEET_NAME)
  if (!sheet) {
    const old = OLD_SHEET_NAMES.map(n => ss.getSheetByName(n)).find(Boolean)
    sheet = old ? old.setName(SHEET_NAME) : ss.insertSheet(SHEET_NAME)
  }
  // create the header row, or extend an older one with the new columns
  const head = sheet.getLastRow() === 0 ? [] : sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0]
  if (head.join('|') !== HEADERS.join('|')) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold')
    sheet.setFrozenRows(1)
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
