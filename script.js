const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const authShell = document.getElementById('authShell');
const approvalShell = document.getElementById('approvalShell');
const adminShell = document.getElementById('adminShell');
const storeShell = document.getElementById('storeShell');
const storeFunctionShell = document.getElementById('storeFunctionShell');
const storeFeatureDetailShell = document.getElementById('storeFeatureDetailShell');

const loginAlert = document.getElementById('loginAlert');
const signupAlert = document.getElementById('signupAlert');
const adminAlert = document.getElementById('adminAlert');

const loginNameInput = document.getElementById('loginName');
const signupNameInput = document.getElementById('signupName');
const signupPhoneInput = document.getElementById('signupPhone');
const backendStatus = document.getElementById('backendStatus');

const adminUserList = document.getElementById('adminUserList');
const storeList = document.getElementById('storeList');
const featureGrid = document.getElementById('featureGrid');
const detailTitle = document.getElementById('detailTitle');
const detailMeta = document.getElementById('detailMeta');
const detailBody = document.getElementById('detailBody');
const approvalStatus = document.getElementById('approvalStatus');
const approvalNameText = document.getElementById('approvalName');
const storeFunctionTitle = document.getElementById('storeFunctionTitle');

const tabs = document.querySelectorAll('.tab');
const backToAuthBtn = document.getElementById('backToAuth');
const adminRefreshBtn = document.getElementById('adminRefresh');
const adminLogoutBtn = document.getElementById('adminLogout');
const storeLogoutBtn = document.getElementById('storeLogout');
const toStoreListBtn = document.getElementById('toStoreList');
const backToFunctionsBtn = document.getElementById('backToFunctions');
const backToStoreListBtn = document.getElementById('backToStoreList');
const storeActionRankBtn = document.getElementById('storeActionRank');
const storeActionWorkBtn = document.getElementById('storeActionWork');
const storeActionCheckinBtn = document.getElementById('storeActionCheckin');
const storeActionScheduleBtn = document.getElementById('storeActionSchedule');

const STORAGE_KEY = 'teamsurfer-users-v1';
const ADMIN_NAME = 'ghddlsvy7734';

const STORES = [
  { id: 'sung', name: '성안점', status: '운영중', badge: 'open', meta: '본사 출근 피크 점검 강화' },
  { id: 'dong', name: '고요 동남점', status: '운영중', badge: 'open', meta: '배달 주문 동선 점검 필요' },
  { id: 'san', name: '고요 산남점', status: '운영중', badge: 'open', meta: '신규 직원 정착 기간 운영' },
  { id: 'mua', name: '무아지경', status: '운영중', badge: 'open', meta: '재고 점검 주간 루틴 적용' },
  { id: 'open', name: '오픈준비중', status: '오픈준비', badge: 'prep', meta: '오픈 이후 항목 전환' }
];

const STORE_FUNCTIONS = [
  { key: 'feedback', title: '피드백/컴플레인', desc: '고객 민원 및 내부 전달 항목을 관리' },
  { key: 'todo', title: '투두리스트', desc: '매장별 할일과 처리 상태 관리' },
  { key: 'order', title: '발주체크', desc: '발주 요청과 입고 상태 체크' },
  { key: 'staff', title: '직원관리', desc: '직원 근무표, 역할, 전달사항 확인' }
];

const storeFeatureData = {
  성안점: {
    feedback: { subtitle: '성안점 피드백/컴플레인', items: ['반품/환불 이슈', '칭찬/불만 분류'], note: '우선순위 큐 기반 처리예정' },
    todo: { subtitle: '성안점 투두리스트', items: ['재고 점검', '마감 정산'], note: '완료시 점장 승인' },
    order: { subtitle: '성안점 발주체크', items: ['발주량 추이', '입고 지연'], note: '추후 공급사 연동 예정' },
    staff: { subtitle: '성안점 직원관리', items: ['근무교대', '휴무요청'], note: '알림 자동화 예정' }
  },
  '고요 동남점': {
    feedback: { subtitle: '동남점 피드백/컴플레인', items: ['배달 민원', '대기시간'], note: '교대 전달 자동화 예정' },
    todo: { subtitle: '동남점 투두리스트', items: ['오픈 전 준비', '마감 후 정리'], note: '피크타임 체크리스트 확장' },
    order: { subtitle: '동남점 발주체크', items: ['육류/채소 수량', '유통기한 경고'], note: '재고 경고 연동 예정' },
    staff: { subtitle: '동남점 직원관리', items: ['신입 교육', '교대 확인'], note: '평가 지표는 추후 추가' }
  },
  '고요 산남점': {
    feedback: { subtitle: '산남점 피드백/컴플레인', items: ['직원 피드백', '고객 불만'], note: '주간 리포트 집계 예정' },
    todo: { subtitle: '산남점 투두리스트', items: ['기기 점검', '주간 세팅'], note: '완료율 대시보드 확장' },
    order: { subtitle: '산남점 발주체크', items: ['입고 검수', '품질 이상 처리'], note: '이상 건 알림 예정' },
    staff: { subtitle: '산남점 직원관리', items: ['휴일 인력', '인력 적정 수'], note: '템플릿 기반 배정 예정' }
  },
  무아지경: {
    feedback: { subtitle: '무아지경 피드백/컴플레인', items: ['조리 지연', '시설 이슈'], note: '24시간 내 재검토 예정' },
    todo: { subtitle: '무아지경 투두리스트', items: ['점검', '폐점 정산'], note: '현재 텍스트 체크만 적용' },
    order: { subtitle: '무아지경 발주체크', items: ['원부자재', '긴급 구매'], note: '메뉴별 소진량 분석 예정' },
    staff: { subtitle: '무아지경 직원관리', items: ['근무 분산', '교체 승인'], note: '권한 분리 적용 예정' }
  },
  '오픈준비중': {
    feedback: { subtitle: '오픈준비 피드백', items: ['시설 점검', '준비 단계 이슈'], note: '오픈 후 운영 템플릿 전환' },
    todo: { subtitle: '오픈준비 투두', items: ['인허가', '교육'], note: '정식 오픈 전 체크리스트' },
    order: { subtitle: '오픈준비 발주체크', items: ['초도 비품', '기초 자재'], note: '운영 시작 시 변경' },
    staff: { subtitle: '오픈준비 직원관리', items: ['초기 채용', '역할 배치'], note: '정규 운영으로 이전' }
  }
};

let useBackend = false;
let supabaseClient = null;
let currentStore = null;
let currentFeature = null;

function normalize(value) {
  return (value || '').trim();
}

function safeKey(value) {
  return normalize(value).toLowerCase();
}

function isAdminName(value) {
  return safeKey(value) === safeKey(ADMIN_NAME);
}

function setAlert(el, message, isSuccess = false) {
  el.textContent = message || '';
  el.className = message ? (isSuccess ? 'alert success' : 'alert') : 'alert';
}

function on(element, event, handler) {
  if (!element) return;
  element.addEventListener(event, handler);
}

function showPanel(panel) {
  const loginPanel = document.querySelector('[data-panel="login"]');
  const signupPanel = document.querySelector('[data-panel="signup"]');
  if (panel === 'login') {
    loginPanel.classList.remove('hidden');
    signupPanel.classList.add('hidden');
  } else {
    loginPanel.classList.add('hidden');
    signupPanel.classList.remove('hidden');
  }
}

function activateTab(tab) {
  tabs.forEach((btn) => {
    const active = btn.dataset.tab === tab;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', active ? 'true' : 'false');
  });
}

function showView(view) {
  [authShell, approvalShell, adminShell, storeShell, storeFunctionShell, storeFeatureDetailShell].forEach((el) => {
    if (el) {
      el.classList.add('hidden');
    }
  });
  if (view === 'auth' && authShell) authShell.classList.remove('hidden');
  if (view === 'approval' && approvalShell) approvalShell.classList.remove('hidden');
  if (view === 'admin' && adminShell) adminShell.classList.remove('hidden');
  if (view === 'stores' && storeShell) storeShell.classList.remove('hidden');
  if (view === 'functions' && storeFunctionShell) storeFunctionShell.classList.remove('hidden');
  if (view === 'detail' && storeFeatureDetailShell) storeFeatureDetailShell.classList.remove('hidden');
}

function showApproval(name, status = 'pending') {
  approvalStatus.textContent = status === 'approved'
    ? '승인 완료: 로그인 가능합니다.'
    : status === 'rejected'
      ? '승인 거절: 관리자에게 문의하세요.'
      : '승인대기중입니다. 관리자 승인 완료 후 이용 가능합니다.';
  approvalNameText.textContent = `입력한 이름: ${name}`;
  showView('approval');
}

function getStoreData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  const parsed = raw ? JSON.parse(raw) : {};
  if (!parsed[safeKey(ADMIN_NAME)]) {
    parsed[safeKey(ADMIN_NAME)] = {
      name: ADMIN_NAME,
      phone: '관리자 계정',
      status: 'approved',
      role: 'admin',
      requestedAt: new Date().toISOString(),
      approvedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  }
  return parsed;
}

function setStoreData(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function normalizeLocalPayload(user) {
  return {
    name: user.name || user,
    phone: user.phone || '-',
    status: user.status || 'pending',
    role: user.role || 'user',
    requestedAt: user.requestedAt || null,
    approvedAt: user.approvedAt || null,
    updatedAt: user.updatedAt || null
  };
}

function localRowsFromStore(usersObj) {
  return Object.entries(usersObj || {}).map(([key, user]) => ({
    ...normalizeLocalPayload(user),
    key
  }));
}

function normalizePhone(phone) {
  return (phone || '').replace(/[^0-9]/g, '');
}

function isValidPhone(phone) {
  return /^01[016789]\d{7,8}$/.test(phone);
}

async function initBackend() {
  if (
    typeof window.supabase === 'undefined' ||
    !SUPABASE_URL.includes('http') ||
    SUPABASE_URL.includes('YOUR_PROJECT_REF') ||
    SUPABASE_ANON_KEY.includes('YOUR_SUPABASE_ANON_KEY')
  ) {
    backendStatus.textContent = '백엔드 미설정: localStorage 데모 모드';
    useBackend = false;
    return;
  }

  try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
    });

    const { error } = await supabaseClient.from('users').select('id', { head: true, count: 'exact' });
    if (error) {
      useBackend = false;
      backendStatus.textContent = `백엔드 연결 실패: ${error.message || error}`;
      return;
    }

    useBackend = true;
    backendStatus.textContent = '백엔드 연결: Supabase 활성';
  } catch (error) {
    useBackend = false;
    backendStatus.textContent = `백엔드 초기화 오류: ${error.message || error}`;
  }
}

async function ensureAdminRecord() {
  if (useBackend && supabaseClient) {
    const { data: existing, error } = await supabaseClient
      .from('users')
      .select('name,status,role')
      .or(`name.eq.${ADMIN_NAME},name_normalized.eq.${safeKey(ADMIN_NAME)}`)
      .limit(1);

    if (error) {
      throw error;
    }

    if (!existing || existing.length === 0) {
      const { error: insertError } = await supabaseClient.from('users').insert({
        name: ADMIN_NAME,
        phone: '관리자 계정',
        status: 'approved',
        role: 'admin',
        requested_at: new Date().toISOString(),
        approved_at: new Date().toISOString()
      });
      if (insertError) {
        throw insertError;
      }
      return;
    }

    if (existing[0].status !== 'approved' || existing[0].role !== 'admin') {
      const { error: updateError } = await supabaseClient
        .from('users')
        .update({ status: 'approved', role: 'admin', updated_at: new Date().toISOString() })
        .eq('name', existing[0].name);
      if (updateError) {
        throw updateError;
      }
    }
    return;
  }

  const users = getStoreData();
  users[safeKey(ADMIN_NAME)] = {
    name: ADMIN_NAME,
    phone: '관리자 계정',
    status: 'approved',
    role: 'admin',
    requestedAt: new Date().toISOString(),
    approvedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  setStoreData(users);
}

async function getUsers() {
  if (!useBackend) {
    return localRowsFromStore(getStoreData());
  }

  const { data, error } = await supabaseClient
    .from('users')
    .select('name,phone,status,role,requested_at,approved_at,updated_at')
    .order('name', { ascending: true });

  if (error) throw error;

  return (data || []).map((r) => ({
    name: r.name,
    phone: r.phone,
    status: r.status,
    role: r.role,
    requestedAt: r.requested_at,
    approvedAt: r.approved_at,
    updatedAt: r.updated_at
  }));
}

async function findUserByName(name) {
  const users = await getUsers();
  return users.find((user) => safeKey(user.name) === safeKey(name)) || null;
}

async function saveUserRecord(payload) {
  if (useBackend) {
    const record = {
      name: payload.name,
      phone: payload.phone,
      status: payload.status,
      role: payload.role,
      requested_at: payload.requestedAt,
      approved_at: payload.approvedAt || null,
      updated_at: payload.updatedAt || null
    };

    const upsertResult = await supabaseClient.from('users').upsert(record, { onConflict: 'name_normalized' });
    if (!upsertResult.error) {
      return;
    }

    if (!/on conflict specification/.test(upsertResult.error.message || '')) {
      throw upsertResult.error;
    }

    const { error } = await supabaseClient
      .from('users')
      .update(record)
      .eq('name', payload.name);

    if (error) throw error;
    return;
  }

  const users = getStoreData();
  users[safeKey(payload.name)] = normalizeLocalPayload({
    name: payload.name,
    phone: payload.phone,
    status: payload.status,
    role: payload.role,
    requestedAt: payload.requestedAt,
    approvedAt: payload.approvedAt || null,
    updatedAt: payload.updatedAt || null
  });
  setStoreData(users);
}

async function changeUserStatus(name, status) {
  if (useBackend) {
    const patch = { status, updated_at: new Date().toISOString() };
    if (status === 'approved') {
      patch.approved_at = new Date().toISOString();
    }

    const { error } = await supabaseClient.from('users').update(patch).eq('name', name);
    if (error) throw error;
    return;
  }

  const users = getStoreData();
  const key = safeKey(name);
  if (!users[key]) return;
  users[key].status = status;
  users[key].updatedAt = new Date().toISOString();
  if (status === 'approved') users[key].approvedAt = new Date().toISOString();
  setStoreData(users);
}

function renderStoreList() {
  const storeListEl = document.getElementById('storeList') || storeList;
  if (!storeListEl) {
    console.error('[renderStoreList] storeList element not found');
    setAlert(loginAlert, '매장 목록 UI를 찾지 못했습니다. 브라우저를 새로고침해 주세요.');
    return;
  }

  storeListEl.innerHTML = STORES.map((store) => {
    const badgeClass = store.badge === 'prep' ? 'badge prep' : 'badge open';
    return `
      <button class="store-item" type="button" data-store-id="${store.id}">
        <div>
          <p class="store-name">${store.name}</p>
          <p class="store-meta">${store.meta}</p>
        </div>
        <span class="store-right"><span class="badge ${badgeClass}">${store.status}</span></span>
      </button>
    `;
  }).join('');

  showView('stores');
}

function renderFunctionPage(store) {
  currentStore = store;
  const featureGridEl = document.getElementById('featureGrid') || featureGrid;
  const storeFunctionTitleEl = document.getElementById('storeFunctionTitle') || storeFunctionTitle;

  if (!featureGridEl || !storeFunctionTitleEl) {
    console.error('[renderFunctionPage] function page UI not found');
    setAlert(loginAlert, '매장 기능 UI를 찾지 못했습니다. 브라우저를 새로고침해 주세요.');
    return;
  }

  storeFunctionTitleEl.textContent = `${store.name} 기능`;
  featureGridEl.innerHTML = STORE_FUNCTIONS.map((fn) => `
    <button class="feature-btn" type="button" data-feature="${fn.key}">
      <h3>${fn.title}</h3>
      <p>${fn.desc}</p>
    </button>
  `).join('');
  showView('functions');
}

function renderFeatureDetail(featureKey) {
  currentFeature = featureKey;
  const detailTitleEl = document.getElementById('detailTitle') || detailTitle;
  const detailMetaEl = document.getElementById('detailMeta') || detailMeta;
  const detailBodyEl = document.getElementById('detailBody') || detailBody;

  if (!detailTitleEl || !detailMetaEl || !detailBodyEl) {
    console.error('[renderFeatureDetail] feature detail UI not found');
    setAlert(loginAlert, '기능 상세 UI를 찾지 못했습니다. 브라우저를 새로고침해 주세요.');
    return;
  }

  const feature = STORE_FUNCTIONS.find((f) => f.key === featureKey);
  const data = (storeFeatureData[currentStore.name] && storeFeatureData[currentStore.name][featureKey]) || {
    subtitle: '준비중',
    items: ['이 매장/기능은 추가 구성 예정'],
    note: '다음 단계에서 상세 입력 반영'
  };

  detailTitleEl.textContent = `${currentStore.name} - ${feature ? feature.title : featureKey}`;
  detailMetaEl.textContent = data.subtitle;
  detailBodyEl.innerHTML = `
    <p>${data.subtitle}</p>
    <ul>${(data.items || []).map((i) => `<li>${i}</li>`).join('')}</ul>
    <p style="margin-top:.8rem">${data.note}</p>
  `;

  showView('detail');
}

async function renderAdminList() {
  const users = await getUsers();
  const order = { pending: 0, rejected: 1, approved: 2 };
  const sorted = users
    .filter((user) => user && user.name)
    .sort((a, b) => (order[a.status] || 3) - (order[b.status] || 3));

  if (!sorted.length) {
    adminUserList.innerHTML = '<p class="admin-empty">등록된 사용자 데이터가 없습니다.</p>';
    return;
  }

  adminUserList.innerHTML = sorted
    .map((user) => {
      const status = user.status || 'pending';
      return `
        <article class="admin-item" data-name="${user.name}">
          <div class="admin-item-head">
            <p class="admin-name">${user.name}</p>
            <span class="status-pill ${status}">${status.toUpperCase()}</span>
          </div>
          <p class="admin-meta">전화: ${user.phone || '-'} / 마지막 변경: ${user.updatedAt || user.requestedAt || '-'}</p>
          <div class="admin-actions">
            <button type="button" class="btn btn-primary admin-approve" ${status === 'pending' ? '' : 'disabled'}>승인</button>
            <button type="button" class="btn btn-ghost admin-reject" ${status === 'pending' ? '' : 'disabled'}>거절</button>
          </div>
        </article>
      `;
    })
    .join('');
}

on(backToAuthBtn, 'click', () => {
  showView('auth');
  activateTab('login');
  showPanel('login');
  loginNameInput.focus();
});

on(adminRefreshBtn, 'click', async () => {
  try {
    await renderAdminList();
    setAlert(adminAlert, '목록 갱신 완료', true);
  } catch (error) {
    setAlert(adminAlert, `목록 갱신 실패: ${error.message || error}`);
  }
});

on(adminLogoutBtn, 'click', () => {
  showView('auth');
  activateTab('login');
  showPanel('login');
  loginNameInput.focus();
  setAlert(loginAlert, '로그아웃되었습니다.');
});

on(storeLogoutBtn, 'click', () => {
  showView('auth');
  activateTab('login');
  showPanel('login');
  loginNameInput.focus();
  setAlert(loginAlert, '로그아웃되었습니다.');
});

on(toStoreListBtn, 'click', () => {
  renderStoreList();
});

on(backToFunctionsBtn, 'click', () => {
  if (!currentStore) return;
  renderFunctionPage(currentStore);
});

on(backToStoreListBtn, 'click', () => {
  renderStoreList();
});

[storeActionRankBtn, storeActionWorkBtn, storeActionCheckinBtn, storeActionScheduleBtn].forEach((btn) => {
  if (!btn) return;
  btn.addEventListener('click', () => {
    setAlert(loginAlert, '매장을 먼저 선택해 주세요.');
  });
});

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    activateTab(tab.dataset.tab);
    showPanel(tab.dataset.tab);
  });
});

on(storeList, 'click', (event) => {
  const target = event.target.closest('.store-item');
  if (!target) return;
  const store = STORES.find((s) => s.id === target.dataset.storeId);
  if (store) renderFunctionPage(store);
});

on(featureGrid, 'click', (event) => {
  const target = event.target.closest('.feature-btn');
  if (!target) return;
  renderFeatureDetail(target.dataset.feature);
});

on(adminUserList, 'click', async (event) => {
  const item = event.target.closest('.admin-item');
  if (!item) return;
  const name = item.dataset.name;

  if (event.target.classList.contains('admin-approve')) {
    if (event.target.disabled) return;
    try {
      await changeUserStatus(name, 'approved');
      await renderAdminList();
      setAlert(adminAlert, `${name}님 승인 처리됨`, true);
    } catch (error) {
      setAlert(adminAlert, `승인 처리 실패: ${error.message || error}`);
    }
  }

  if (event.target.classList.contains('admin-reject')) {
    if (event.target.disabled) return;
    try {
      await changeUserStatus(name, 'rejected');
      await renderAdminList();
      setAlert(adminAlert, `${name}님 거절 처리됨`);
    } catch (error) {
      setAlert(adminAlert, `거절 처리 실패: ${error.message || error}`);
    }
  }
});


loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = normalize(loginNameInput.value);

  if (!name) {
    setAlert(loginAlert, '이름을 입력해 주세요.');
    return;
  }

  // 관리자 전용 경로: 승인 상태와 무관하게 관리자 화면 강제 진입
  if (isAdminName(name)) {
    try {
      await ensureAdminRecord();
      await renderAdminList();
      showView('admin');
      setAlert(adminAlert, `${name}님, 관리자 페이지입니다.`, true);
    } catch (error) {
      console.error('[login-admin] error', error);
      setAlert(loginAlert, `관리자 전환 중 오류: ${error.message || error}`);
    }
    return;
  }

  try {
    console.log('[login] start', { name, useBackend, SUPABASE_URL: SUPABASE_URL ? 'set' : 'empty' });
    const user = await findUserByName(name);

    if (!user) {
      setAlert(loginAlert, '등록되지 않은 사용자입니다. 먼저 회원가입을 진행해 주세요.');
      return;
    }

    if (user.status !== 'approved') {
      showApproval(name, user.status);
      return;
    }

    if (user.role === 'admin') {
      await ensureAdminRecord();
      await renderAdminList();
      showView('admin');
      setAlert(adminAlert, `${name}님, 관리자 페이지입니다.`, true);
      return;
    }

    renderStoreList();
  } catch (error) {
    console.error('[login] error', error);
    setAlert(loginAlert, `로그인 처리 중 오류: ${error.message || error}`);
  }
});

signupForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = normalize(signupNameInput.value);
  const phone = normalize(signupPhoneInput.value);

  if (!name) {
    setAlert(signupAlert, '이름을 입력해 주세요.');
    return;
  }

  const cleaned = normalizePhone(phone);
  if (!isValidPhone(cleaned)) {
    setAlert(signupAlert, '전화번호 형식이 올바르지 않습니다.');
    return;
  }

  try {
    const existed = await findUserByName(name);
    if (existed && existed.status === 'approved') {
      setAlert(signupAlert, '이미 승인된 계정입니다. 로그인 버튼을 눌러 주세요.');
      return;
    }

    const payload = {
      name,
      phone,
      status: safeKey(name) === safeKey(ADMIN_NAME) ? 'approved' : 'pending',
      role: safeKey(name) === safeKey(ADMIN_NAME) ? 'admin' : 'user',
      requestedAt: new Date().toISOString(),
      approvedAt: safeKey(name) === safeKey(ADMIN_NAME) ? new Date().toISOString() : null
    };

    await saveUserRecord(payload);

    if (safeKey(name) === safeKey(ADMIN_NAME)) {
      setAlert(signupAlert, '관리자 계정은 승인 없이 접근 가능합니다.', true);
      await renderAdminList();
      showView('admin');
      return;
    }

    setAlert(signupAlert, '가입 요청이 접수되었습니다. 승인 대기중입니다.', true);
    showApproval(name, 'pending');
  } catch (error) {
    setAlert(signupAlert, `회원가입 처리 중 오류: ${error.message || error}`);
  }
});

(async function bootstrap() {
  showPanel('login');
  activateTab('login');
  await initBackend();
  setStoreData(getStoreData());
})();
