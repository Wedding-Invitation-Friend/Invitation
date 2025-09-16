document.addEventListener('DOMContentLoaded', () => {
  const invitationHeader = document.querySelector('.invitation-header');
  const messageSection = document.querySelector('.message-section');

  setTimeout(() => {
    invitationHeader.classList.add('visible');
  }, 1500); // h1のアニメーションが2sなので、少し早めに開始

  setTimeout(() => {
    messageSection.classList.add('visible');
  }, 2000); // h1のアニメーションが終わる頃に開始
});

// ここにGASの Webアプリ URL（/exec）を設定
const GAS_ENDPOINT = "https://script.google.com/macros/s/AKfycbySBt50LJ8zvQmxFWRlhhuq3tT3fIMKm-Hiflk0AgKwmgkVWkWb01zN7r1ZmFc-9jxAMw/exec";

const form = document.getElementById("rsvp-form");
const message = document.getElementById("message");
const loader = document.getElementById("loader");

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

  loader.style.display = "flex";

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
  } finally {
    loader.style.display = "none";
  }
});


// ラジオボタンの必須チェックを制御
const radioGroups = document.querySelectorAll('fieldset');

radioGroups.forEach(group => {
  const radios = group.querySelectorAll('input[type="radio"]');
  const legend = group.querySelector('legend');
  const originalText = legend.textContent;

  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      // グループ内のどれかが選択されたら、他のラジオボタンのrequiredを外す
      if (radio.checked) {
        radios.forEach(r => r.removeAttribute('required'));
        legend.textContent = originalText; // エラーメッセージを消す
        legend.style.color = '';
      }
    });
  });
});

// 送信時のラジオボタン必須チェック
form.addEventListener('submit', (e) => {
  radioGroups.forEach(group => {
    const radios = group.querySelectorAll('input[type="radio"]');
    const isChecked = Array.from(radios).some(r => r.checked);
    const legend = group.querySelector('legend');
    const originalText = legend.textContent.replace('（選択してください）', ''); // エラーメッセージを除去

    if (!isChecked) {
      e.preventDefault(); // 送信を中止
      legend.textContent = `${originalText}（選択してください）`;
      legend.style.color = 'red';
    } else {
      legend.textContent = originalText;
      legend.style.color = '';
    }
  });
});
