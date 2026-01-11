// Momi 앱 URL (개발용: localhost, 배포 시 변경 필요)
const MOMI_URL = 'http://localhost:5173';

// 확장 프로그램 아이콘 클릭 시 실행
chrome.action.onClicked.addListener(async (tab) => {
  // chrome:// 또는 edge:// 등 브라우저 내부 페이지는 제외
  if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('edge://')) {
    console.log('Cannot save browser internal pages');
    return;
  }

  const params = new URLSearchParams({
    add: 'true',
    url: tab.url,
    title: tab.title || ''
  });

  // Momi 앱을 새 탭에서 열기
  chrome.tabs.create({
    url: `${MOMI_URL}?${params.toString()}`
  });
});
