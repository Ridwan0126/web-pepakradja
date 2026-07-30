const API_BASE = 'https://rpp.bapenda.jatengprov.go.id/penatausahaan-dev/api/pepakraja'
const API_BASE_PENAKBUSITI = 'https://rpp.bapenda.jatengprov.go.id/penatausahaan/api/penakbusiti'
const TOKEN = 'mQ8xL2vNpR7kHdYcTa4ZwEuBjF1sGn9'

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${TOKEN}`,
}

// Register new WR (Wajib Retribusi)
export async function registerWR(data) {
  try {
    const response = await fetch(`${API_BASE}/wr`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })
    const result = await response.json()
    return { success: response.ok, data: result }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Check set password token
export async function checkPasswordToken(token) {
  try {
    const response = await fetch(`${API_BASE}/wr/set-password?set_password_token=${token}`, {
      method: 'GET',
      headers,
    })
    const result = await response.json()
    return { success: response.ok, data: result }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Set password
export async function setPassword(data) {
  try {
    const response = await fetch(`${API_BASE}/wr/set-password`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })
    const result = await response.json()
    return { success: response.ok, data: result }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Login / Get WR Data
export async function loginWR(email, password) {
  try {
    const response = await fetch(`${API_BASE}/wr/data?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
      method: 'GET',
      headers,
    })
    const result = await response.json()
    return { success: response.ok, data: result }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Request password reset (forgot password)
export async function requestPasswordReset(email) {
  try {
    const response = await fetch(`${API_BASE}/wr/forgot-password`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email }),
    })
    const result = await response.json()
    return { success: response.ok, data: result }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Get provinsi list
export async function getProvinsi() {
  try {
    const response = await fetch(`${API_BASE}/provinsi`, {
      method: 'GET',
      headers,
    })
    const result = await response.json()
    return { success: response.ok, data: result }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Get kota/kabupaten by provinsi
export async function getKota(provinsiCode) {
  try {
    const response = await fetch(`${API_BASE}/kota?provinsi=${provinsiCode}`, {
      method: 'GET',
      headers,
    })
    const result = await response.json()
    return { success: response.ok, data: result }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Get obyek retribusi list
export async function getObyekRetribusi() {
  try {
    const response = await fetch(`${API_BASE_PENAKBUSITI}/obyek-retribusi`, {
      method: 'GET',
      headers,
    })
    const result = await response.json()
    return { success: response.ok, data: result }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Get obyek retribusi detail
export async function getObyekDetail(id) {
  try {
    const response = await fetch(`${API_BASE_PENAKBUSITI}/obyek-retribusi/${id}`, {
      method: 'GET',
      headers,
    })
    const result = await response.json()
    return { success: response.ok, data: result }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Get SKRD data
export async function getSKRD(idWR, idObyek, tahun, bulan) {
  try {
    const params = new URLSearchParams({
      id_wr: idWR,
      id_obyek: idObyek,
      tahun,
      bulan,
    })
    const response = await fetch(`${API_BASE}/skrd?${params.toString()}`, {
      method: 'GET',
      headers,
    })
    const result = await response.json()
    return { success: response.ok, data: result }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Check SKRD by number (for payment status)
export async function checkSKRDStatus(noSKRD) {
  try {
    const response = await fetch(`${API_BASE}/skrd/check?no_skrd=${encodeURIComponent(noSKRD)}`, {
      method: 'GET',
      headers,
    })
    const result = await response.json()
    return { success: response.ok, data: result }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
