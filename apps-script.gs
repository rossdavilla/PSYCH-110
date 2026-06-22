/**
 * INTERACTIVE SYLLABUS — Google Apps Script Backend
 * ═══════════════════════════════════════════════════
 *
 * SETUP INSTRUCTIONS
 * ──────────────────
 * 1. Open your Google Sheets file (create a new one if needed).
 * 2. Click Extensions → Apps Script.
 * 3. Delete the default code and paste this entire file.
 * 4. Create the following four sheets (tabs) in your Spreadsheet:
 *
 *      Roster         — A: Student Name  (one name per row, no header)
 *      Students       — Created/managed automatically
 *      Facts          — A: FactID  B: FactText  (add header row: ID | Fact | AssignedTo)
 *      AnonQuestions  — Created/managed automatically
 *
 * 5. Populate "Roster" with your student names (column A, starting row 1).
 * 6. Populate "Facts" with your facts (starting row 2; row 1 = headers).
 *    Column A = sequential numbers (1, 2, 3…)
 *    Column B = the fact text
 *    Column C = leave blank (filled in automatically when a student is assigned)
 *
 * 7. Click Deploy → New Deployment.
 *    - Type: Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    Click Deploy and copy the Web App URL.
 *
 * 8. In syllabus.html, replace 'YOUR_APPS_SCRIPT_URL_HERE' with that URL.
 *
 * SHEET STRUCTURE (auto-created on first use)
 * ────────────────────────────────────────────
 * Students sheet columns:
 *   A: Name  B: FactID  C: DataJSON  D: LastUpdated
 *
 * AnonQuestions sheet columns:
 *   A: Timestamp  B: Question
 */

// ═══════════════════════════════════════════════════════════
// SHEET NAME CONSTANTS — change these if you rename your tabs
// ═══════════════════════════════════════════════════════════
const SHEET_ROSTER    = 'Roster';
const SHEET_STUDENTS  = 'Students';
const SHEET_FACTS     = 'Facts';
const SHEET_QUESTIONS = 'AnonQuestions';

// ═══════════════════════════════════════════════════════════
// HTTP HANDLERS
// ═══════════════════════════════════════════════════════════

function doGet(e) {
  const params = e.parameter;
  let result;
  try {
    switch (params.action) {
      case 'getStudent':
        result = getOrCreateStudent(params.name);
        break;
      case 'getStudentList':
        result = { success: true, students: getRoster() };
        break;
      default:
        result = { success: false, error: 'Unknown action: ' + params.action };
    }
  } catch (err) {
    result = { success: false, error: err.toString() };
  }
  return jsonResponse(result);
}

function doPost(e) {
  let result;
  try {
    const body = JSON.parse(e.postData.contents);
    switch (body.action) {
      case 'saveStudent':
        result = saveStudentData(body.name, body.data);
        break;
      case 'submitQuestion':
        result = saveAnonQuestion(body.question);
        break;
      default:
        result = { success: false, error: 'Unknown action: ' + body.action };
    }
  } catch (err) {
    result = { success: false, error: err.toString() };
  }
  return jsonResponse(result);
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ═══════════════════════════════════════════════════════════
// STUDENT FUNCTIONS
// ═══════════════════════════════════════════════════════════

/**
 * Returns the student's saved data. Creates a new record (with an assigned
 * fact) if this is the student's first visit.
 */
function getOrCreateStudent(name) {
  if (!name) return { success: false, error: 'No name provided' };

  const ss      = SpreadsheetApp.getActiveSpreadsheet();
  const sheet   = getOrCreateSheet(ss, SHEET_STUDENTS,
    ['Name', 'FactID', 'DataJSON', 'LastUpdated']);
  const rows    = sheet.getDataRange().getValues();

  // Search for existing student (skip header row 0)
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === name) {
      const saved = rows[i][2] ? JSON.parse(rows[i][2]) : {};
      const fact  = getFactById(ss, rows[i][1]);
      return {
        success: true,
        student: {
          name:   name,
          factId: rows[i][1],
          fact:   fact,
          ...saved,
        },
      };
    }
  }

  // New student — assign a unique fact
  const factResult = assignFact(ss, name);
  const blankData  = {
    matchingRevealed: false,
    coins:            [],
    coinReason:       '',
    skills:           {},
    aboutYou:         '',
    quiz:             {},
    quizCorrect:      {},
    anonSubmitted:    false,
  };
  sheet.appendRow([name, factResult.factId, JSON.stringify(blankData),
    new Date().toISOString()]);

  return {
    success: true,
    student: {
      name:   name,
      factId: factResult.factId,
      fact:   factResult.fact,
      ...blankData,
    },
  };
}

/**
 * Merges new data into the student's existing JSON blob and updates the row.
 */
function saveStudentData(name, newData) {
  if (!name) return { success: false, error: 'No name provided' };

  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet(ss, SHEET_STUDENTS,
    ['Name', 'FactID', 'DataJSON', 'LastUpdated']);
  const rows  = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === name) {
      const existing = rows[i][2] ? JSON.parse(rows[i][2]) : {};
      const merged   = deepMerge(existing, newData);
      sheet.getRange(i + 1, 3).setValue(JSON.stringify(merged));
      sheet.getRange(i + 1, 4).setValue(new Date().toISOString());
      return { success: true };
    }
  }
  return { success: false, error: 'Student not found: ' + name };
}

// ═══════════════════════════════════════════════════════════
// FACT ASSIGNMENT
// ═══════════════════════════════════════════════════════════

/**
 * Picks a random unclaimed fact, marks it as claimed, and returns it.
 * If all facts are claimed, falls back to the first fact (edge case for
 * classes larger than the fact pool — add more facts to avoid this).
 */
function assignFact(ss, name) {
  const sheet = ss.getSheetByName(SHEET_FACTS);
  if (!sheet) return { factId: 0, fact: 'Fact sheet not found — please set up the Facts sheet.' };

  const rows = sheet.getDataRange().getValues();
  const unclaimed = [];
  for (let i = 1; i < rows.length; i++) {
    if (!rows[i][2]) {  // Column C is empty = unclaimed
      unclaimed.push({ row: i + 1, id: rows[i][0], text: rows[i][1] });
    }
  }

  if (unclaimed.length === 0) {
    // All claimed — log a warning and reuse row 1 as fallback
    console.warn('All facts have been assigned. Consider adding more to the Facts sheet.');
    return { factId: rows[1][0], fact: rows[1][1] };
  }

  const chosen = unclaimed[Math.floor(Math.random() * unclaimed.length)];
  sheet.getRange(chosen.row, 3).setValue(name);  // Mark as claimed
  return { factId: chosen.id, fact: chosen.text };
}

function getFactById(ss, factId) {
  const sheet = ss.getSheetByName(SHEET_FACTS);
  if (!sheet) return 'Fact not found.';
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(factId)) return rows[i][1];
  }
  return 'Fact not found.';
}

// ═══════════════════════════════════════════════════════════
// ROSTER
// ═══════════════════════════════════════════════════════════

function getRoster() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_ROSTER);
  if (!sheet) return [];
  return sheet.getDataRange().getValues()
    .map(row => row[0])
    .filter(name => name && String(name).trim() !== '');
}

// ═══════════════════════════════════════════════════════════
// ANONYMOUS QUESTIONS
// ═══════════════════════════════════════════════════════════

function saveAnonQuestion(question) {
  if (!question) return { success: false, error: 'Empty question' };
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet(ss, SHEET_QUESTIONS, ['Timestamp', 'Question']);
  sheet.appendRow([new Date().toISOString(), question]);
  return { success: true };
}

// ═══════════════════════════════════════════════════════════
// REPORT GENERATOR
// Run this manually from the Apps Script editor to generate a
// summary report of class responses in a new "Report" sheet.
// ═══════════════════════════════════════════════════════════

function generateReport() {
  const ss         = SpreadsheetApp.getActiveSpreadsheet();
  const studSheet  = ss.getSheetByName(SHEET_STUDENTS);
  if (!studSheet) { Logger.log('No Students sheet found.'); return; }

  const rows = studSheet.getDataRange().getValues();
  if (rows.length < 2) { Logger.log('No student data yet.'); return; }

  // Collect all skill IDs from first student with skills data
  let skillIds = [];
  for (let i = 1; i < rows.length; i++) {
    const d = rows[i][2] ? JSON.parse(rows[i][2]) : {};
    if (d.skills && Object.keys(d.skills).length > 0) {
      skillIds = Object.keys(d.skills);
      break;
    }
  }

  // Build header row
  const headers = ['Name', 'LastUpdated', 'FactID',
    'Coin1', 'Coin2', 'Coin3', 'CoinReason',
    ...skillIds.map(id => 'Rank_' + id),
    'AboutYou', 'QuizAllCorrect', 'AnonSubmitted'];

  const reportRows = [headers];
  for (let i = 1; i < rows.length; i++) {
    const name    = rows[i][0];
    const factId  = rows[i][1];
    const updated = rows[i][3];
    const d       = rows[i][2] ? JSON.parse(rows[i][2]) : {};
    const coins   = d.coins || [];
    const skills  = d.skills || {};
    const quizAllCorrect = d.quizCorrect
      ? Object.values(d.quizCorrect).every(Boolean) : false;
    reportRows.push([
      name, updated, factId,
      coins[0] || '', coins[1] || '', coins[2] || '',
      d.coinReason || '',
      ...skillIds.map(id => skills[id] || ''),
      d.aboutYou || '',
      quizAllCorrect ? 'Yes' : 'No',
      d.anonSubmitted ? 'Yes' : 'No',
    ]);
  }

  // Write to Report sheet (overwrite if exists)
  let reportSheet = ss.getSheetByName('Report');
  if (reportSheet) ss.deleteSheet(reportSheet);
  reportSheet = ss.insertSheet('Report');
  reportSheet.getRange(1, 1, reportRows.length, reportRows[0].length)
    .setValues(reportRows);

  // Bold the header row
  reportSheet.getRange(1, 1, 1, reportRows[0].length).setFontWeight('bold');

  Logger.log('Report generated with ' + (reportRows.length - 1) + ' student rows.');
}

// ═══════════════════════════════════════════════════════════
// UTILITY HELPERS
// ═══════════════════════════════════════════════════════════

/** Creates a sheet if it doesn't exist, with optional header row. */
function getOrCreateSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (headers && headers.length) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    }
  }
  return sheet;
}

/** Shallow-merges b into a, with deep merge for plain objects one level down. */
function deepMerge(a, b) {
  const result = Object.assign({}, a);
  for (const key of Object.keys(b)) {
    if (b[key] !== null && typeof b[key] === 'object' && !Array.isArray(b[key])
        && typeof result[key] === 'object' && !Array.isArray(result[key])) {
      result[key] = Object.assign({}, result[key], b[key]);
    } else {
      result[key] = b[key];
    }
  }
  return result;
}
