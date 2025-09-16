// === 設定 ===
const SHEET_ID = '＜あなたのスプレッドシートID＞';
const SHEET_NAME = 'RSVP';

// === エントリポイント ===
function doPost(e) {
  try {
    const data = parseRequest_(e); // { name, attend_for_wedding, attend_for_second_party, entertainment }

    // 必須チェック
    if (!data.name) {
      return json_({ ok: false, error: 'name は必須です' });
    }
    // 文字列("true"/"false") を Boolean へ
    const toBool = v => {
      if (typeof v === 'boolean') return v;
      if (v === 'true' || v === true) return true;
      if (v === 'false' || v === false) return false;
      return false; // 未指定時は false（必要なら変更）
    };

    const record = {
      time: new Date(),
      name: String(data.name).trim(),
      attend_for_wedding: toBool(data.attend_for_wedding),
      attend_for_second_party: toBool(data.attend_for_second_party),
      entertainment: toBool(data.entertainment)
    };

    const sheet = getSheet_();
    ensureHeader_(sheet);

    // 追記（列順はヘッダーに合わせる）
    sheet.appendRow([
      record.time,
      record.name,
      record.attend_for_wedding,
      record.attend_for_second_party,
      record.entertainment
    ]);

    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: String(err) });
  }
}

// === ユーティリティ ===

// フォーム/JSONの両対応でパラメータを取り出す
function parseRequest_(e) {
  if (e && e.postData && e.postData.type &&
      e.postData.type.indexOf('application/json') > -1) {
    return JSON.parse(e.postData.contents || '{}');
  }
  if (e && e.parameter && Object.keys(e.parameter).length) {
    return e.parameter;
  }
  return {};
}

function getSheet_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
}

function ensureHeader_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['time', 'name', 'attend_for_wedding', 'attend_for_second_party', 'entertainment']);
  } else {
    // 既存ヘッダーが異なる場合に合わせたいときはここで調整
  }
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
