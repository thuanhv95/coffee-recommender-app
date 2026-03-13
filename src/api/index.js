const API_BASE = 'http://localhost:8000/api';

export async function fetchShops(params = {}) {
  const url = new URL(`${API_BASE}/shops`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => url.searchParams.append(key, v));
      } else {
        url.searchParams.append(key, value);
      }
    }
  });

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu shops:', error);
    return null;
  }
}

export async function fetchShopBySlug(slug) {
  try {
    const response = await fetch(`${API_BASE}/shops/slug/${slug}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi tải chi tiết shop:', error);
    return null;
  }
}

export async function fetchFilters() {
  try {
    const response = await fetch(`${API_BASE}/filters`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi tải bộ lọc:', error);
    return null;
  }
}

export async function submitSuggestion(data) {
  try {
    const response = await fetch(`${API_BASE}/suggestions`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'bypass-tunnel-reminder': 'true'
      },
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error('Lỗi khi gửi đề xuất:', error);
    throw error;
  }
}
