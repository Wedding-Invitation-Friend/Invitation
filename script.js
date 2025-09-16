// ここにGASの Webアプリ URL（/exec）を設定
const GAS_ENDPOINT = "https://script.google.com/macros/s/XXXXXXXXXXXXXXXX/exec";

const form = document.getElementById("rsvp-form");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  message.textContent = "";
  message.classList.remove("error");

  // 必須チェック（ブラウザのrequiredに加えて念のため）
  if (!form.name.value.trim()) {
    message.textContent = "お名前を入力してください。";
    message.classList.add("error");
    return;
  }

  const params = new URLSearchParams(new FormData(form));

  try {
    const res = await fetch(GAS_ENDPOINT, { method: "POST", body: params });
    const json = await res.json();
    if (json.ok) {
      message.textContent = "送信しました。ありがとうございます！";
      form.reset();
    } else {
      message.textContent = `エラー: ${json.error || "送信に失敗しました"}`;
      message.classList.add("error");
    }
  } catch (err) {
    message.textContent = "通信エラーが発生しました。";
    message.classList.add("error");
  }
});
