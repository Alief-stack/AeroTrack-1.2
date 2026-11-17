/* ==========================================================================
   AeroTrack ID — Sistem Informasi & Manajemen Penerbangan (FIDS)
   ========================================================================== */

const STORAGE_KEY = 'aerotrack_id_flights_v3';

// Database Bandara Aktif
const AIRPORTS = {
    YIA: { iata: 'YIA', icao: 'WAHI', name: 'Yogyakarta International Airport', elev: 68, runways: [{ id: '11', heading: 110, opposite: '29', length: '3.250m' }, { id: '29', heading: 290, opposite: '11', length: '3.250m' }] },
    CGK: { iata: 'CGK', icao: 'WIII', name: 'Soekarno-Hatta International Airport', elev: 34, runways: [{ id: '07R', heading: 70, opposite: '25L', length: '3.660m' }, { id: '25L', heading: 250, opposite: '07R', length: '3.660m' }] },
    SUB: { iata: 'SUB', icao: 'WARR', name: 'Juanda International Airport Surabaya', elev: 9, runways: [{ id: '10', heading: 100, opposite: '28', length: '3.000m' }, { id: '28', heading: 280, opposite: '10', length: '3.000m' }] },
    DPS: { iata: 'DPS', icao: 'WADD', name: 'I Gusti Ngurah Rai International Airport', elev: 14, runways: [{ id: '09', heading: 90, opposite: '27', length: '3.000m' }, { id: '27', heading: 270, opposite: '09', length: '3.000m' }] },
    UPG: { iata: 'UPG', icao: 'WAAA', name: 'Sultan Hasanuddin Airport Makassar', elev: 47, runways: [{ id: '03', heading: 30, opposite: '21', length: '3.100m' }, { id: '21', heading: 210, opposite: '03', length: '3.100m' }] },
    KNO: { iata: 'KNO', icao: 'WIMM', name: 'Kualanamu International Airport Medan', elev: 23, runways: [{ id: '05', heading: 50, opposite: '23', length: '3.750m' }, { id: '23', heading: 230, opposite: '05', length: '3.750m' }] },
    DJB: { iata: 'DJB', icao: 'WIJJ', name: 'Sultan Thaha Airport Jambi', elev: 82, runways: [{ id: '13', heading: 130, opposite: '31', length: '2.220m' }, { id: '31', heading: 310, opposite: '13', length: '2.220m' }] }
};

// Skenario Simulasi Cuaca & METAR
const WEATHER_SCENARIOS = {
    CAVOK: {
        id: 'CAVOK',
        label: 'Cerah (CAVOK)',
        icon: 'fa-sun text-amber-500',
        hdrIcon: 'fa-sun text-amber-300',
        temp: 30,
        dew: 23,
        humidity: 66,
        windDir: 290,
        windSpeed: 12,
        windGust: 0,
        visKm: 10.0,
        ceiling: 'FEW 2.500 ft',
        qnh: 1011,
        metarSuffix: 'CAVOK 30/23 Q1011 NOSIG',
        taf: '28010KT 9999 FEW020 TX31/1806Z TN24/1721Z BECMG 1715/1717 12006KT',
        alert: null
    },
    LIGHT_RAIN: {
        id: 'LIGHT_RAIN',
        label: 'Hujan Ringan (-RA)',
        icon: 'fa-cloud-rain text-sky-500',
        hdrIcon: 'fa-cloud-rain text-sky-200',
        temp: 26,
        dew: 24,
        humidity: 89,
        windDir: 240,
        windSpeed: 14,
        windGust: 20,
        visKm: 6.0,
        ceiling: 'BKN 1.500 ft',
        qnh: 1009,
        metarSuffix: '6000 -RA SCT012 BKN015 26/24 Q1009 TEMPO 4000 RA',
        taf: '24014G20KT 6000 -RA BKN015 TEMPO 1713/1718 3500 RA BKN010',
        alert: null
    },
    CROSSWIND: {
        id: 'CROSSWIND',
        label: 'Crosswind Kencang',
        icon: 'fa-wind text-amber-500',
        hdrIcon: 'fa-wind text-amber-300',
        temp: 29,
        dew: 21,
        humidity: 62,
        windDir: 20,
        windSpeed: 24,
        windGust: 34,
        visKm: 9.0,
        ceiling: 'SCT 3.000 ft',
        qnh: 1008,
        metarSuffix: '9999 SCT030 29/21 Q1008 WS ALL RWY',
        taf: '02024G34KT 9999 SCT030 TEMPO 1712/1716 03028G38KT',
        alert: {
            title: 'Peringatan Wind Shear & Crosswind Tinggi (Gust 34 kt)!',
            desc: 'Kecepatan angin silang mendekati batas maksimum operasional pesawat narrow-body. Periksa kalkulator crosswind sebelum clearance.'
        }
    },
    FOG: {
        id: 'FOG',
        label: 'Kabut Tebal (FG / LIFR)',
        icon: 'fa-smog text-purple-500',
        hdrIcon: 'fa-smog text-purple-200',
        temp: 22,
        dew: 22,
        humidity: 100,
        windDir: 110,
        windSpeed: 4,
        windGust: 0,
        visKm: 0.8,
        ceiling: 'OVC 300 ft',
        qnh: 1013,
        metarSuffix: '0800 R11/0900N FG OVC003 22/22 Q1013 BECMG 2000 BR',
        taf: '11004KT 0800 FG OVC003 BECMG 1716/1718 3000 BR SCT010',
        alert: {
            title: 'Low Visibility Procedures (LVP) Aktif — Jarak Pandang 800m!',
            desc: 'Kategori cuaca LIFR. Jarak pandang di bawah minimum pendaratan visual standar, potensi holding dan delay keberangkatan.'
        }
    },
    THUNDERSTORM: {
        id: 'THUNDERSTORM',
        label: 'Badai Petir (+TSRA CB)',
        icon: 'fa-cloud-bolt text-rose-500',
        hdrIcon: 'fa-cloud-bolt text-rose-300',
        temp: 24,
        dew: 23,
        humidity: 94,
        windDir: 330,
        windSpeed: 28,
        windGust: 42,
        visKm: 2.5,
        ceiling: 'FEW 1.200 ft CB',
        qnh: 1005,
        metarSuffix: '2500 +TSRA FEW012CB BKN018 24/23 Q1005 RETS',
        taf: '33028G42KT 2500 +TSRA FEW012CB BKN018 TEMPO 1712/1716 1500 +TSRA SQ',
        alert: {
            title: 'BAHAYA: Badai Petir & Awan Cumulonimbus (+TSRA CB) di Area Bandara!',
            desc: 'Aktivitas petir aktif dan gust hingga 42 kt. Ground handling ditangguhkan sementara dan keberangkatan/kedatangan berisiko delay.'
        }
    }
};

// Cuaca Hub Rute Domestik
const HUB_WEATHER = {
    CGK: { city: 'Jakarta', temp: 31, condition: 'Cerah Berawan', wind: '070°/10kt', vis: '10km', cat: 'VFR', icon: 'fa-cloud-sun text-amber-500' },
    SUB: { city: 'Surabaya', temp: 32, condition: 'Cerah (CAVOK)', wind: '100°/14kt', vis: '10km', cat: 'VFR', icon: 'fa-sun text-amber-500' },
    DPS: { city: 'Denpasar', temp: 29, condition: 'Hujan Ringan', wind: '120°/16kt', vis: '6km', cat: 'MVFR', icon: 'fa-cloud-rain text-sky-500' },
    UPG: { city: 'Makassar', temp: 30, condition: 'Berawan', wind: '210°/11kt', vis: '9km', cat: 'VFR', icon: 'fa-cloud text-slate-500' },
    KNO: { city: 'Medan', temp: 25, condition: 'Badai Petir (TS)', wind: '050°/22kt', vis: '3km', cat: 'IFR', icon: 'fa-cloud-bolt text-rose-500' },
    DJB: { city: 'Jambi', temp: 28, condition: 'Kabut Tipis (BR)', wind: '130°/06kt', vis: '5km', cat: 'MVFR', icon: 'fa-smog text-amber-500' },
    YIA: { city: 'Yogyakarta', temp: 30, condition: 'Cerah (CAVOK)', wind: '290°/12kt', vis: '10km', cat: 'VFR', icon: 'fa-sun text-amber-500' },
    SIN: { city: 'Singapura', temp: 29, condition: 'Hujan Lokal', wind: '180°/12kt', vis: '7km', cat: 'MVFR', icon: 'fa-cloud-showers-heavy text-sky-500' }
};

// Data Awal (Contoh Jadwal Realistis)
const defaultFlights = [
    {
        id: 'FL-001',
        type: 'ARRIVAL',
        flightNumber: 'GA-402',
        airline: 'Garuda Indonesia',
        aircraft: 'B738 • PK-GFA',
        city: 'Jakarta (CGK)',
        time: '08:15',
        estimatedTime: '08:15',
        terminal: 'Terminal 3',
        gate: 'Gate A1',
        baggage: 'Belt 01',
        status: 'Landed',
        delayReason: ''
    },
    {
        id: 'FL-002',
        type: 'DEPARTURE',
        flightNumber: 'QG-714',
        airline: 'Citilink',
        aircraft: 'A320 • PK-GQU',
        city: 'Surabaya (SUB)',
        time: '08:45',
        estimatedTime: '08:45',
        terminal: 'Terminal 1',
        gate: 'Gate B3',
        baggage: '-',
        status: 'Departed',
        delayReason: ''
    },
    {
        id: 'FL-003',
        type: 'DEPARTURE',
        flightNumber: 'JT-604',
        airline: 'Lion Air',
        aircraft: 'B739 • PK-LQS',
        city: 'Denpasar (DPS)',
        time: '09:30',
        estimatedTime: '09:30',
        terminal: 'Terminal 1',
        gate: 'Gate B2',
        baggage: '-',
        status: 'Boarding',
        delayReason: ''
    },
    {
        id: 'FL-004',
        type: 'ARRIVAL',
        flightNumber: 'ID-6803',
        airline: 'Batik Air',
        aircraft: 'A320 • PK-LUZ',
        city: 'Makassar (UPG)',
        time: '09:50',
        estimatedTime: '09:50',
        terminal: 'Terminal 2',
        gate: 'Gate B2',
        baggage: 'Belt 03',
        status: 'In Flight',
        delayReason: ''
    },
    {
        id: 'FL-005',
        type: 'DEPARTURE',
        flightNumber: 'QZ-510',
        airline: 'AirAsia',
        aircraft: 'A320 • PK-AXV',
        city: 'Singapura (SIN)',
        time: '10:20',
        estimatedTime: '11:05',
        terminal: 'Internasional',
        gate: 'Gate C1',
        baggage: '-',
        status: 'Delayed',
        delayReason: 'Keterlambatan rotasi pesawat dari rute sebelumnya'
    },
    {
        id: 'FL-006',
        type: 'ARRIVAL',
        flightNumber: 'IU-322',
        airline: 'Super Air Jet',
        aircraft: 'A320 • PK-SAJ',
        city: 'Medan (KNO)',
        time: '11:10',
        estimatedTime: '11:10',
        terminal: 'Terminal 2',
        gate: 'Gate A4',
        baggage: 'Belt 02',
        status: 'Baggage Claim',
        delayReason: ''
    },
    {
        id: 'FL-007',
        type: 'DEPARTURE',
        flightNumber: 'IP-208',
        airline: 'Pelita Air',
        aircraft: 'A320 • PK-PWA',
        city: 'Jakarta (CGK)',
        time: '12:00',
        estimatedTime: '12:00',
        terminal: 'Terminal 3',
        gate: 'Gate A2',
        baggage: '-',
        status: 'Scheduled',
        delayReason: ''
    }
];

// State Aplikasi
let flights = [];
let currentMainView = 'ALL';
let isFidsMode = false;
let fidsAutoSwitchInterval = null;
let flightIdToDelete = null;
let activeAirportCode = 'YIA';
let currentWeatherScenario = 'CAVOK';

// Inisialisasi Aplikasi (Mendukung DOMContentLoaded maupun window.onload)
function initApp() {
    loadFlights();
    startClock();
    populateRunwaySelector();
    updateWeatherUI();
    renderApp();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Load & Save Data ke LocalStorage dengan Safe Memory Fallback
function loadFlights() {
    try {
        const saved = window.localStorage ? localStorage.getItem(STORAGE_KEY) : null;
        if (saved) {
            flights = JSON.parse(saved);
            return;
        }
    } catch (e) {
        console.warn('LocalStorage tidak tersedia, menggunakan memori sesi.');
    }
    flights = [...defaultFlights];
    saveFlightsToStorage();
}

function saveFlightsToStorage() {
    try {
        if (window.localStorage) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(flights));
        }
    } catch (e) {
        // Tetap berjalan di memori apabila storage dibatasi
    }
}

function resetDemoData() {
    flights = [...defaultFlights];
    saveFlightsToStorage();
    resetFilters();
    showToast('Data contoh berhasil dimuat ulang.');
}

// Jam Digital Real-Time
function startClock() {
    function update() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const clockEl = document.getElementById('live-clock');
        if (clockEl) clockEl.textContent = `${hours}:${minutes}:${seconds} WIB`;

        const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
        const dateEl = document.getElementById('live-date');
        if (dateEl) dateEl.textContent = now.toLocaleDateString('id-ID', options);

        const day = String(now.getUTCDate()).padStart(2, '0');
        const utcH = String(now.getUTCHours()).padStart(2, '0');
        const zuluTime = `${day}${utcH}00Z`;
        const metarTs = document.getElementById('metar-timestamp');
        if (metarTs) metarTs.textContent = zuluTime;
    }
    update();
    setInterval(update, 1000);
}

// Ubah Bandara Aktif
function changeActiveAirport() {
    activeAirportCode = document.getElementById('active-airport-select').value;
    const airport = AIRPORTS[activeAirportCode];
    document.getElementById('fids-airport-subtitle').textContent = `Layar Informasi Penerbangan Real-Time • ${airport.name} (${airport.iata})`;
    populateRunwaySelector();
    updateWeatherUI();
    showToast(`Bandara aktif diubah ke ${airport.iata} (${airport.icao})`);
}

function populateRunwaySelector() {
    const airport = AIRPORTS[activeAirportCode];
    const select = document.getElementById('runway-select');
    if (!select) return;
    select.innerHTML = '';
    airport.runways.forEach(rwy => {
        const opt = document.createElement('option');
        opt.value = rwy.heading;
        opt.dataset.rwyId = rwy.id;
        opt.dataset.oppId = rwy.opposite;
        opt.textContent = `RWY ${rwy.id} (Heading ${String(rwy.heading).padStart(3, '0')}° • Panjang ${rwy.length})`;
        select.appendChild(opt);
    });
}

// Ubah Skenario Cuaca
function changeWeatherScenario() {
    currentWeatherScenario = document.getElementById('weather-scenario-select').value;
    updateWeatherUI();
    showToast(`Simulasi cuaca diubah ke: ${WEATHER_SCENARIOS[currentWeatherScenario].label}`);
}

// Kategori Penerbangan VFR / MVFR / IFR / LIFR
function getFlightCategory(visKm, scenarioId) {
    if (scenarioId === 'FOG' || visKm < 1.6) {
        return { code: 'LIFR', label: 'LIFR • LOW INSTRUMENT FLIGHT RULES', badgeClass: 'bg-purple-100 text-purple-800 border-purple-300', hdrClass: 'bg-purple-100 text-purple-800 border-purple-200' };
    }
    if (scenarioId === 'THUNDERSTORM' || visKm < 5.0) {
        return { code: 'IFR', label: 'IFR • INSTRUMENT FLIGHT RULES', badgeClass: 'bg-rose-100 text-rose-800 border-rose-300', hdrClass: 'bg-rose-100 text-rose-800 border-rose-200' };
    }
    if (visKm < 8.0) {
        return { code: 'MVFR', label: 'MVFR • MARGINAL VFR', badgeClass: 'bg-amber-100 text-amber-800 border-amber-300', hdrClass: 'bg-amber-100 text-amber-800 border-amber-200' };
    }
    return { code: 'VFR', label: 'VFR • VISUAL FLIGHT RULES', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300', hdrClass: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
}

// Update UI Panel Cuaca & Widget
function updateWeatherUI() {
    const airport = AIRPORTS[activeAirportCode];
    const wx = WEATHER_SCENARIOS[currentWeatherScenario];
    const cat = getFlightCategory(wx.visKm, wx.id);

    const windDirStr = String(wx.windDir).padStart(3, '0');
    const windSpdStr = String(wx.windSpeed).padStart(2, '0');
    const gustStr = wx.windGust > 0 ? `G${wx.windGust}` : '';
    const metarWind = `${windDirStr}${windSpdStr}${gustStr}KT`;

    // 1. Header Compact Widget
    document.getElementById('hdr-wx-icon').className = `fa-solid ${wx.hdrIcon} text-lg drop-shadow-sm`;
    document.getElementById('hdr-wx-temp').textContent = `${wx.temp}°C`;
    const hdrCat = document.getElementById('hdr-wx-cat');
    hdrCat.textContent = cat.code;
    hdrCat.className = `px-1.5 py-0.2 text-[10px] font-mono font-bold rounded border ${cat.hdrClass}`;
    document.getElementById('hdr-wx-details').textContent = `${windDirStr}°/${wx.windSpeed}kt • Vis ${wx.visKm}km • QNH ${wx.qnh}`;

    // 2. FIDS Banner Weather
    document.getElementById('fids-wx-icon').className = `fa-solid ${wx.icon} text-xl`;
    document.getElementById('fids-wx-condition').textContent = wx.label;
    document.getElementById('fids-wx-temp').textContent = `${wx.temp}°C`;
    document.getElementById('fids-wx-wind').textContent = `Wind ${windDirStr}°/${wx.windSpeed}kt • Vis ${wx.visKm}km • QNH ${wx.qnh} hPa`;

    // 3. Weather Tab Details
    document.getElementById('wx-airport-title').textContent = `Cuaca Penerbangan — ${airport.iata} / ${airport.icao}`;
    const rwy0 = airport.runways[0];
    document.getElementById('wx-airport-elevation').textContent = `Elevasi: ${airport.elev} ft • Runway Aktif: RWY ${rwy0.id} / ${rwy0.opposite} (${rwy0.length})`;
    
    const catBadge = document.getElementById('wx-flight-cat-badge');
    catBadge.textContent = cat.label;
    catBadge.className = `px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${cat.badgeClass}`;

    document.getElementById('wx-temp-dew').textContent = `${wx.temp}°C / ${wx.dew}°C`;
    document.getElementById('wx-humidity').textContent = `Kelembapan ${wx.humidity}%`;
    document.getElementById('wx-wind-main').textContent = `${windDirStr}° / ${wx.windSpeed} kt`;
    document.getElementById('wx-wind-gust').textContent = wx.windGust > 0 ? `Gust hingga ${wx.windGust} kt` : 'Gust: Tidak ada';
    document.getElementById('wx-vis').textContent = `${wx.visKm.toFixed(1)} km`;
    document.getElementById('wx-ceiling').textContent = `Ceiling: ${wx.ceiling}`;
    document.getElementById('wx-qnh').textContent = `${wx.qnh} hPa`;
    document.getElementById('wx-qnh-inhg').textContent = `${(wx.qnh * 0.02953).toFixed(2)} inHg`;

    // Raw METAR & TAF
    const now = new Date();
    const zulu = `${String(now.getUTCDate()).padStart(2, '0')}${String(now.getUTCHours()).padStart(2, '0')}00Z`;
    document.getElementById('raw-metar-text').textContent = `${airport.icao} ${zulu} ${metarWind} ${wx.metarSuffix}`;
    document.getElementById('raw-taf-text').textContent = `TAF ${airport.icao} 171100Z 1712/1812 ${wx.taf}`;

    // Alert Banner & Dot
    const impactBanner = document.getElementById('weather-impact-banner');
    const alertDot = document.getElementById('weather-alert-dot');
    if (wx.alert) {
        impactBanner.classList.remove('hidden');
        alertDot.classList.remove('hidden');
        document.getElementById('wx-alert-title').textContent = wx.alert.title;
        document.getElementById('wx-alert-desc').textContent = wx.alert.desc;
    } else {
        impactBanner.classList.add('hidden');
        alertDot.classList.add('hidden');
    }

    updateWindCalculations();
    renderHubWeatherGrid();
}

// Kalkulasi Headwind & Crosswind terhadap Runway
function updateWindCalculations() {
    const wx = WEATHER_SCENARIOS[currentWeatherScenario];
    const select = document.getElementById('runway-select');
    if (!select || !select.options.length) return;

    const selectedOpt = select.options[select.selectedIndex];
    const rwyHeading = parseInt(select.value, 10);
    const rwyId = selectedOpt.dataset.rwyId;
    const oppId = selectedOpt.dataset.oppId;

    const rwyGroup = document.getElementById('svg-runway-group');
    const windArrow = document.getElementById('svg-wind-arrow');
    if (rwyGroup) rwyGroup.setAttribute('transform', `rotate(${rwyHeading} 110 110)`);
    if (windArrow) windArrow.setAttribute('transform', `rotate(${wx.windDir} 110 110)`);
    if (document.getElementById('svg-rwy-top')) document.getElementById('svg-rwy-top').textContent = rwyId;
    if (document.getElementById('svg-rwy-bot')) document.getElementById('svg-rwy-bot').textContent = oppId;

    const angleDiffRad = ((wx.windDir - rwyHeading) * Math.PI) / 180;
    const speedToUse = wx.windGust > 0 ? wx.windGust : wx.windSpeed;
    const headwind = Math.round(speedToUse * Math.cos(angleDiffRad));
    const crosswind = Math.abs(Math.round(speedToUse * Math.sin(angleDiffRad)));

    const hwLabel = document.getElementById('headwind-label');
    const hwVal = document.getElementById('headwind-val');
    if (headwind >= 0) {
        hwLabel.textContent = 'HEADWIND';
        hwLabel.className = 'text-[11px] font-semibold text-sky-700';
        hwVal.textContent = `${headwind} kt`;
        hwVal.className = 'text-base font-mono font-bold text-sky-900 mt-0.5';
    } else {
        hwLabel.textContent = 'TAILWIND';
        hwLabel.className = 'text-[11px] font-semibold text-amber-700';
        hwVal.textContent = `${Math.abs(headwind)} kt`;
        hwVal.className = 'text-base font-mono font-bold text-amber-800 mt-0.5';
    }

    const cwBox = document.getElementById('crosswind-box');
    const cwLabel = document.getElementById('crosswind-label');
    const cwVal = document.getElementById('crosswind-val');
    cwVal.textContent = `${crosswind} kt`;

    if (crosswind >= 20) {
        cwBox.className = 'bg-rose-50 p-3 rounded-xl border border-rose-200 text-center';
        cwLabel.className = 'text-[11px] font-semibold text-rose-700';
        cwVal.className = 'text-base font-mono font-bold text-rose-800 mt-0.5';
    } else if (crosswind >= 12) {
        cwBox.className = 'bg-amber-50 p-3 rounded-xl border border-amber-200 text-center';
        cwLabel.className = 'text-[11px] font-semibold text-amber-700';
        cwVal.className = 'text-base font-mono font-bold text-amber-800 mt-0.5';
    } else {
        cwBox.className = 'bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-center';
        cwLabel.className = 'text-[11px] font-semibold text-emerald-700';
        cwVal.className = 'text-base font-mono font-bold text-emerald-900 mt-0.5';
    }
}

// Render Grid Cuaca Bandara Hub Utama
function renderHubWeatherGrid() {
    const grid = document.getElementById('hub-weather-grid');
    if (!grid) return;
    grid.innerHTML = '';

    Object.entries(HUB_WEATHER).forEach(([code, data]) => {
        const catColors = {
            VFR: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            MVFR: 'bg-amber-100 text-amber-800 border-amber-200',
            IFR: 'bg-rose-100 text-rose-800 border-rose-200'
        };
        const badgeCls = catColors[data.cat] || catColors.VFR;

        const card = document.createElement('div');
        card.className = 'p-3.5 rounded-xl bg-sky-50/40 border border-sky-100 hover:border-sky-300 transition flex flex-col justify-between gap-2';
        card.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <span class="font-mono font-bold text-sm text-sky-900">${code}</span>
                    <span class="text-xs text-slate-500 ml-1">${data.city}</span>
                </div>
                <span class="px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${badgeCls}">${data.cat}</span>
            </div>
            <div class="flex items-center justify-between my-1">
                <div class="flex items-center gap-2">
                    <i class="fa-solid ${data.icon} text-lg"></i>
                    <span class="text-xs font-semibold text-slate-700">${data.condition}</span>
                </div>
                <span class="font-mono font-bold text-base text-slate-800">${data.temp}°C</span>
            </div>
            <div class="text-[11px] font-mono text-slate-500 border-t border-slate-100 pt-1.5 flex justify-between">
                <span>Wind ${data.wind}</span>
                <span>Vis ${data.vis}</span>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Aksi Cepat: Terapkan Weather Delay (+30 Menit) ke Penerbangan Aktif
function applyWeatherDelayToFlights() {
    const wx = WEATHER_SCENARIOS[currentWeatherScenario];
    let affectedCount = 0;

    flights = flights.map(f => {
        if (['Scheduled', 'Boarding', 'In Flight'].includes(f.status)) {
            const baseTime = f.estimatedTime || f.time;
            const [h, m] = baseTime.split(':').map(Number);
            const totalMin = h * 60 + m + 30;
            const newH = String(Math.floor(totalMin / 60) % 24).padStart(2, '0');
            const newM = String(totalMin % 60).padStart(2, '0');

            affectedCount++;
            return {
                ...f,
                status: 'Delayed',
                estimatedTime: `${newH}:${newM}`,
                delayReason: `Weather Delay (${wx.label})`
            };
        }
        return f;
    });

    if (affectedCount > 0) {
        saveFlightsToStorage();
        renderApp();
        showToast(`${affectedCount} penerbangan diperbarui menjadi Weather Delay (+30 menit).`);
    } else {
        showToast('Tidak ada penerbangan aktif yang perlu ditandai delay.');
    }
}

// Ganti Tab View Utama
function setMainView(view) {
    currentMainView = view;

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('bg-white', 'text-sky-700', 'shadow-sm', 'font-semibold');
        btn.classList.add('text-slate-600', 'font-medium');
    });
    const activeTab = document.getElementById(`tab-${view}`);
    if (activeTab) {
        activeTab.classList.add('bg-white', 'text-sky-700', 'shadow-sm', 'font-semibold');
        activeTab.classList.remove('text-slate-600', 'font-medium');
    }

    const tableContainer = document.getElementById('table-container');
    const resourcesContainer = document.getElementById('resources-container');
    const weatherContainer = document.getElementById('weather-container');
    const filterBar = document.getElementById('filter-bar');

    tableContainer.classList.add('hidden');
    resourcesContainer.classList.add('hidden');
    weatherContainer.classList.add('hidden');

    if (view === 'RESOURCES') {
        resourcesContainer.classList.remove('hidden');
        filterBar.classList.add('hidden');
    } else if (view === 'WEATHER') {
        weatherContainer.classList.remove('hidden');
        filterBar.classList.add('hidden');
        updateWeatherUI();
    } else {
        tableContainer.classList.remove('hidden');
        if (!isFidsMode) filterBar.classList.remove('hidden');
    }

    const fidsTitle = document.getElementById('fids-board-title');
    if (fidsTitle) {
        if (view === 'ARRIVAL') fidsTitle.textContent = 'ARRIVALS — INFORMASI KEDATANGAN PESAWAT';
        else if (view === 'DEPARTURE') fidsTitle.textContent = 'DEPARTURES — INFORMASI KEBERANGKATAN PESAWAT';
        else fidsTitle.textContent = 'FLIGHT INFORMATION DISPLAY SYSTEM (FIDS)';
    }

    renderApp();
}

function resetFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('airline-filter').value = 'ALL';
    document.getElementById('terminal-filter').value = 'ALL';
    document.getElementById('status-filter').value = 'ALL';
    renderApp();
}

// Toggle Mode Layar Bandara (FIDS)
function toggleFidsMode() {
    isFidsMode = !isFidsMode;
    const body = document.getElementById('app-body');
    const controlPanel = document.getElementById('control-panel');
    const statsSection = document.getElementById('stats-section');
    const fidsBanner = document.getElementById('fids-banner');
    const tableContainer = document.getElementById('table-container');
    const resourcesContainer = document.getElementById('resources-container');
    const weatherContainer = document.getElementById('weather-container');
    const toggleBtn = document.getElementById('toggle-fids-btn');
    const fidsBtnText = document.getElementById('fids-btn-text');

    if (isFidsMode) {
        if (currentMainView === 'RESOURCES' || currentMainView === 'WEATHER') currentMainView = 'ALL';
        body.classList.remove('bg-sky-50/60');
        body.classList.add('bg-sky-100/70');
        
        controlPanel.classList.add('hidden');
        statsSection.classList.add('hidden');
        resourcesContainer.classList.add('hidden');
        weatherContainer.classList.add('hidden');
        fidsBanner.classList.remove('hidden');
        tableContainer.classList.remove('hidden');

        tableContainer.classList.add('shadow-md', 'border-sky-200');

        fidsBtnText.textContent = 'Keluar Mode Layar';
        toggleBtn.classList.remove('bg-white', 'text-sky-700');
        toggleBtn.classList.add('bg-amber-400', 'text-slate-900', 'font-bold', 'border-amber-300');
    } else {
        if (fidsAutoSwitchInterval) {
            clearInterval(fidsAutoSwitchInterval);
            fidsAutoSwitchInterval = null;
            document.getElementById('auto-switch-label').textContent = 'Auto-Switch: OFF';
        }

        body.classList.add('bg-sky-50/60');
        body.classList.remove('bg-sky-100/70');

        controlPanel.classList.remove('hidden');
        statsSection.classList.remove('hidden');
        fidsBanner.classList.add('hidden');

        tableContainer.classList.remove('shadow-md', 'border-sky-200');

        fidsBtnText.textContent = 'Mode Layar Bandara';
        toggleBtn.classList.add('bg-white', 'text-sky-700');
        toggleBtn.classList.remove('bg-amber-400', 'text-slate-900', 'font-bold', 'border-amber-300');
        setMainView(currentMainView);
    }

    renderApp();
}

// Auto-Switch Arrival <-> Departure di Mode FIDS
function toggleAutoSwitchFids() {
    const label = document.getElementById('auto-switch-label');
    if (fidsAutoSwitchInterval) {
        clearInterval(fidsAutoSwitchInterval);
        fidsAutoSwitchInterval = null;
        label.textContent = 'Auto-Switch: OFF';
        showToast('Auto-Switch layar FIDS dimatikan.');
    } else {
        setMainView('ARRIVAL');
        label.textContent = 'Auto-Switch: ON (8s)';
        showToast('Auto-Switch FIDS aktif: berganti setiap 8 detik.');
        fidsAutoSwitchInterval = setInterval(() => {
            const nextView = currentMainView === 'ARRIVAL' ? 'DEPARTURE' : 'ARRIVAL';
            setMainView(nextView);
        }, 8000);
    }
}

// Helper Konversi Waktu HH:MM ke Menit
function timeToMinutes(timeStr) {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
}

// Deteksi Bentrok Jadwal Gate (< 45 menit)
function detectGateConflicts() {
    const conflicts = [];
    const conflictFlightIds = new Set();
    const activeFlights = flights.filter(f => f.status !== 'Cancelled' && f.gate && f.gate !== '-');

    for (let i = 0; i < activeFlights.length; i++) {
        for (let j = i + 1; j < activeFlights.length; j++) {
            const f1 = activeFlights[i];
            const f2 = activeFlights[j];
            if (f1.gate.trim().toLowerCase() === f2.gate.trim().toLowerCase()) {
                const t1 = timeToMinutes(f1.estimatedTime || f1.time);
                const t2 = timeToMinutes(f2.estimatedTime || f2.time);
                if (Math.abs(t1 - t2) < 45) {
                    conflicts.push({ gate: f1.gate, f1, f2, diff: Math.abs(t1 - t2) });
                    conflictFlightIds.add(f1.id);
                    conflictFlightIds.add(f2.id);
                }
            }
        }
    }
    return { conflicts, conflictFlightIds };
}

// Badge Warna Status Lengkap
function getStatusBadge(status) {
    const styles = {
        'Scheduled': 'bg-slate-100 text-slate-700 border-slate-200',
        'Boarding': 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse',
        'Gate Closed': 'bg-orange-100 text-orange-800 border-orange-300',
        'Departed': 'bg-sky-100 text-sky-800 border-sky-200',
        'In Flight': 'bg-indigo-100 text-indigo-800 border-indigo-200',
        'Landed': 'bg-emerald-100 text-emerald-800 border-emerald-200',
        'Baggage Claim': 'bg-teal-100 text-teal-800 border-teal-300',
        'Delayed': 'bg-rose-100 text-rose-800 border-rose-200',
        'Cancelled': 'bg-slate-200 text-slate-600 border-slate-300 line-through'
    };

    const icons = {
        'Scheduled': 'fa-calendar-check',
        'Boarding': 'fa-person-walking-luggage',
        'Gate Closed': 'fa-door-closed',
        'Departed': 'fa-plane-departure',
        'In Flight': 'fa-plane-up',
        'Landed': 'fa-plane-arrival',
        'Baggage Claim': 'fa-suitcase-rolling',
        'Delayed': 'fa-circle-exclamation',
        'Cancelled': 'fa-ban'
    };

    const badgeClass = styles[status] || styles['Scheduled'];
    const iconClass = icons[status] || 'fa-circle-info';

    return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${badgeClass}">
                <i class="fa-solid ${iconClass} text-[10px]"></i>
                <span>${status.toUpperCase()}</span>
            </span>`;
}

// Badge Warna Maskapai
function getAirlineBadge(airline) {
    const colors = {
        'Garuda Indonesia': 'bg-sky-700 text-white',
        'Citilink': 'bg-emerald-600 text-white',
        'Lion Air': 'bg-red-600 text-white',
        'Batik Air': 'bg-purple-700 text-white',
        'Super Air Jet': 'bg-amber-600 text-white',
        'AirAsia': 'bg-rose-600 text-white',
        'Sriwijaya Air': 'bg-blue-600 text-white',
        'Pelita Air': 'bg-cyan-600 text-white',
        'Wings Air': 'bg-orange-600 text-white'
    };
    const bg = colors[airline] || 'bg-slate-600 text-white';
    const initials = airline.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

    return `<div class="flex items-center gap-2.5">
                <span class="w-7 h-7 rounded-lg ${bg} text-[11px] font-bold flex items-center justify-center shrink-0 shadow-sm">${initials}</span>
                <span class="font-medium text-slate-800">${airline}</span>
            </div>`;
}

// Update Statistik Operasional & OTP
function updateStats(conflictCount) {
    const total = flights.length;
    const arrivals = flights.filter(f => f.type === 'ARRIVAL').length;
    const departures = flights.filter(f => f.type === 'DEPARTURE').length;
    const active = flights.filter(f => ['Boarding', 'Gate Closed', 'In Flight', 'Baggage Claim'].includes(f.status)).length;
    const delayedOrCancel = flights.filter(f => ['Delayed', 'Cancelled'].includes(f.status)).length;
    const onTimeCount = total - delayedOrCancel;
    const otpPercent = total > 0 ? Math.round((onTimeCount / total) * 100) : 100;

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-arrival').textContent = arrivals;
    document.getElementById('stat-departure').textContent = departures;
    document.getElementById('stat-otp').textContent = `${otpPercent}%`;
    document.getElementById('stat-active').textContent = active;
    document.getElementById('stat-delayed').textContent = delayedOrCancel;

    const conflictBadge = document.getElementById('conflict-badge');
    if (conflictCount > 0) {
        conflictBadge.textContent = conflictCount;
        conflictBadge.classList.remove('hidden');
    } else {
        conflictBadge.classList.add('hidden');
    }
}

// Render Utama Aplikasi
function renderApp() {
    const { conflicts, conflictFlightIds } = detectGateConflicts();
    updateStats(conflicts.length);
    renderFlightsTable(conflictFlightIds);
    renderResourcesView(conflicts, conflictFlightIds);
}

// Helper Ekstrak Cuaca Kota Asal/Tujuan dari kode IATA
function getRouteWeatherBadge(cityString) {
    const match = cityString.match(/\(([A-Z]{3})\)/);
    if (!match) return '';
    const iata = match[1];
    const hub = HUB_WEATHER[iata];
    if (!hub) return '';

    return `<div class="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-500 mt-0.5">
                <i class="fa-solid ${hub.icon} text-[10px]"></i>
                <span>${hub.condition} • ${hub.temp}°C (${hub.cat})</span>
            </div>`;
}

// Render Tabel Jadwal Penerbangan
function renderFlightsTable(conflictFlightIds) {
    const searchQuery = document.getElementById('search-input').value.toLowerCase().trim();
    const airlineFilter = document.getElementById('airline-filter').value;
    const terminalFilter = document.getElementById('terminal-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    const tbody = document.getElementById('flight-table-body');
    const emptyState = document.getElementById('empty-state');

    document.querySelectorAll('.admin-col').forEach(el => {
        el.style.display = isFidsMode ? 'none' : '';
    });

    const filtered = flights
        .filter(flight => {
            const matchType = currentMainView === 'ALL' || currentMainView === 'RESOURCES' || currentMainView === 'WEATHER' || flight.type === currentMainView;
            const matchAirline = airlineFilter === 'ALL' || flight.airline === airlineFilter;
            const matchTerminal = terminalFilter === 'ALL' || flight.terminal === terminalFilter;
            const matchStatus = statusFilter === 'ALL' || flight.status === statusFilter;
            const matchSearch = 
                flight.flightNumber.toLowerCase().includes(searchQuery) ||
                flight.airline.toLowerCase().includes(searchQuery) ||
                flight.city.toLowerCase().includes(searchQuery) ||
                (flight.aircraft && flight.aircraft.toLowerCase().includes(searchQuery)) ||
                flight.gate.toLowerCase().includes(searchQuery);
            return matchType && matchAirline && matchTerminal && matchStatus && matchSearch;
        })
        .sort((a, b) => a.time.localeCompare(b.time));

    tbody.innerHTML = '';

    if (filtered.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    } else {
        emptyState.classList.add('hidden');
    }

    filtered.forEach(flight => {
        const isArrival = flight.type === 'ARRIVAL';
        const hasConflict = conflictFlightIds.has(flight.id);
        const rowHover = 'hover:bg-sky-50/50 border-slate-100';
        
        const hasNewEst = flight.estimatedTime && flight.estimatedTime !== flight.time && flight.status !== 'Cancelled';
        const estLabel = isArrival ? 'ETA' : 'ETD';
        const timeHtml = hasNewEst
            ? `<div class="flex flex-col">
                <span class="font-mono text-xs line-through text-slate-400">${flight.time}</span>
                <span class="font-mono text-base font-bold ${flight.status === 'Delayed' ? 'text-rose-600' : 'text-emerald-600'}">${flight.estimatedTime} <span class="text-[10px] font-sans uppercase">${estLabel}</span></span>
               </div>`
            : `<span class="font-mono text-base font-bold text-slate-800">${flight.time}</span>`;

        const typeBadge = isArrival
            ? `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200/80">
                <i class="fa-solid fa-plane-arrival"></i> Arrival
               </span>`
            : `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                <i class="fa-solid fa-plane-departure"></i> Departure
               </span>`;

        const routeDirection = isArrival ? 'Dari:' : 'Ke:';
        const conflictBadge = hasConflict && !isFidsMode
            ? `<span class="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded mt-1" title="Jadwal gate berdekatan dengan penerbangan lain">
                <i class="fa-solid fa-triangle-exclamation"></i> Bentrok Gate
               </span>`
            : '';

        const beltHtml = isArrival && flight.baggage && flight.baggage !== '-'
            ? `<span class="text-[11px] font-mono text-amber-700 bg-amber-50 border border-amber-200/80 px-1.5 py-0.5 rounded mt-1 inline-block"><i class="fa-solid fa-suitcase-rolling mr-1"></i>${flight.baggage}</span>`
            : '';

        const delayReasonHtml = (flight.status === 'Delayed' || flight.status === 'Cancelled') && flight.delayReason
            ? `<div class="text-[11px] mt-1 text-rose-600 font-medium max-w-[200px] truncate" title="${flight.delayReason}">
                <i class="fa-solid fa-circle-info mr-1"></i>${flight.delayReason}
               </div>`
            : '';

        const routeWeatherHtml = getRouteWeatherBadge(flight.city);

        const tr = document.createElement('tr');
        tr.className = `transition-colors ${rowHover} ${hasConflict && !isFidsMode ? 'bg-rose-50/40' : ''}`;
        tr.innerHTML = `
            <td class="py-3.5 px-4 whitespace-nowrap">
                ${timeHtml}
            </td>
            <td class="py-3.5 px-4 whitespace-nowrap">
                <div class="font-mono font-bold px-2.5 py-1 rounded-md text-xs inline-block bg-sky-50/80 text-sky-900 border border-sky-200/80">${flight.flightNumber}</div>
                <div class="text-[11px] font-mono mt-1 text-slate-500">${flight.aircraft || '-'}</div>
            </td>
            <td class="py-3.5 px-4 whitespace-nowrap">
                ${getAirlineBadge(flight.airline)}
            </td>
            <td class="py-3.5 px-4 whitespace-nowrap">
                ${typeBadge}
            </td>
            <td class="py-3.5 px-4 whitespace-nowrap">
                <div class="text-[11px] text-slate-400">${routeDirection}</div>
                <div class="font-semibold ${isFidsMode ? 'text-slate-900 text-base' : 'text-slate-800'}">${flight.city}</div>
                ${routeWeatherHtml}
            </td>
            <td class="py-3.5 px-4 whitespace-nowrap">
                <div class="flex flex-col items-start">
                    <span class="font-mono text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">${flight.terminal} • ${flight.gate}</span>
                    ${beltHtml}
                    ${conflictBadge}
                </div>
            </td>
            <td class="py-3.5 px-4 whitespace-nowrap">
                ${getStatusBadge(flight.status)}
                ${delayReasonHtml}
            </td>
            <td class="py-3.5 px-4 whitespace-nowrap text-right admin-col" style="${isFidsMode ? 'display:none;' : ''}">
                <div class="inline-flex items-center gap-1">
                    <button onclick="announceFlight('${flight.id}')" class="p-2 rounded-lg text-amber-600 hover:bg-amber-50 border border-transparent hover:border-amber-200 transition" title="Pengumuman Suara Bandara (TTS)">
                        <i class="fa-solid fa-bullhorn"></i>
                    </button>
                    <button onclick="openModal('${flight.id}')" class="p-2 rounded-lg text-sky-600 hover:bg-sky-50 border border-transparent hover:border-sky-200 transition" title="Edit Jadwal / Status">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button onclick="promptDelete('${flight.id}')" class="p-2 rounded-lg text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition" title="Hapus Jadwal">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Render Tampilan Gate & Baggage Claim Allocation
function renderResourcesView(conflicts, conflictFlightIds) {
    const alertBox = document.getElementById('conflict-alert-box');
    const alertDesc = document.getElementById('conflict-alert-desc');
    if (conflicts.length > 0) {
        alertBox.classList.remove('hidden');
        const detailText = conflicts.map(c => `${c.gate} (${c.f1.flightNumber} pukul ${c.f1.time} & ${c.f2.flightNumber} pukul ${c.f2.time})`).join('; ');
        alertDesc.textContent = `Ditemukan ${conflicts.length} potensi bentrok gate: ${detailText}.`;
    } else {
        alertBox.classList.add('hidden');
    }

    const gateMap = {};
    flights.forEach(f => {
        if (!f.gate || f.gate === '-') return;
        if (!gateMap[f.gate]) gateMap[f.gate] = [];
        gateMap[f.gate].push(f);
    });

    const gatesGrid = document.getElementById('gates-grid');
    const gateNames = Object.keys(gateMap).sort();
    document.getElementById('total-gates-count').textContent = gateNames.length;
    gatesGrid.innerHTML = '';

    gateNames.forEach(gate => {
        const list = gateMap[gate].sort((a, b) => a.time.localeCompare(b.time));
        const gateHasConflict = list.some(f => conflictFlightIds.has(f.id));

        const card = document.createElement('div');
        card.className = `rounded-xl border p-4 ${gateHasConflict ? 'border-rose-200 bg-rose-50/40' : 'border-sky-100 bg-sky-50/30'}`;
        
        const itemsHtml = list.map(f => `
            <div class="flex items-center justify-between py-2 border-b border-slate-200/60 last:border-0 text-xs">
                <div>
                    <span class="font-mono font-bold text-sky-900">${f.flightNumber}</span>
                    <span class="text-slate-500 ml-1">(${f.city})</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="font-mono font-semibold text-slate-700">${f.estimatedTime || f.time}</span>
                    ${getStatusBadge(f.status)}
                </div>
            </div>
        `).join('');

        card.innerHTML = `
            <div class="flex items-center justify-between mb-2.5">
                <span class="font-mono font-bold text-sm text-sky-900 flex items-center gap-1.5">
                    <i class="fa-solid fa-door-open text-sky-600"></i> ${gate}
                </span>
                ${gateHasConflict 
                    ? '<span class="px-2 py-0.5 text-[10px] font-bold bg-rose-600 text-white rounded-full">BENTROK</span>' 
                    : `<span class="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded-full">${list.length} Penerbangan</span>`}
            </div>
            <div>${itemsHtml}</div>
        `;
        gatesGrid.appendChild(card);
    });

    const beltMap = {};
    flights.filter(f => f.type === 'ARRIVAL' && f.baggage && f.baggage !== '-').forEach(f => {
        if (!beltMap[f.baggage]) beltMap[f.baggage] = [];
        beltMap[f.baggage].push(f);
    });

    const baggageGrid = document.getElementById('baggage-grid');
    baggageGrid.innerHTML = '';
    const beltNames = Object.keys(beltMap).sort();

    if (beltNames.length === 0) {
        baggageGrid.innerHTML = '<p class="text-xs text-slate-400 col-span-full">Belum ada alokasi conveyor bagasi untuk kedatangan.</p>';
    } else {
        beltNames.forEach(belt => {
            const list = beltMap[belt].sort((a, b) => a.time.localeCompare(b.time));
            const card = document.createElement('div');
            card.className = 'rounded-xl border border-amber-200/80 bg-amber-50/40 p-4';
            const itemsHtml = list.map(f => `
                <div class="flex items-center justify-between py-1.5 border-b border-amber-200/50 last:border-0 text-xs">
                    <div>
                        <div class="font-mono font-bold text-slate-800">${f.flightNumber}</div>
                        <div class="text-[11px] text-slate-500">${f.city}</div>
                    </div>
                    <div class="text-right">
                        <div class="font-mono font-bold text-amber-800">${f.estimatedTime || f.time}</div>
                        <div class="text-[10px] text-slate-500">${f.status}</div>
                    </div>
                </div>
            `).join('');

            card.innerHTML = `
                <div class="flex items-center justify-between mb-2">
                    <span class="font-mono font-bold text-sm text-amber-900 flex items-center gap-1.5">
                        <i class="fa-solid fa-suitcase-rolling text-amber-600"></i> ${belt}
                    </span>
                    <span class="text-[11px] font-semibold text-amber-700">${list.length} Flight</span>
                </div>
                <div>${itemsHtml}</div>
            `;
            baggageGrid.appendChild(card);
        });
    }
}

// Pengumuman Suara Bandara Otomatis (Web Speech API)
function announceFlight(id) {
    const f = flights.find(item => item.id === id);
    if (!f) return;

    if (!('speechSynthesis' in window)) {
        showToast('Browser Anda tidak mendukung fitur pengumuman suara.');
        return;
    }

    window.speechSynthesis.cancel();
    const spelledFlight = f.flightNumber.replace('-', ' ').split('').join(' ');
    let text = '';

    if (f.type === 'DEPARTURE') {
        if (f.status === 'Boarding') {
            text = `Perhatian. Panggilan naik pesawat untuk penumpang ${f.airline} dengan nomor penerbangan ${spelledFlight} tujuan ${f.city}. Silakan menuju ke pintu keberangkatan ${f.gate}, ${f.terminal}. Terima kasih.`;
        } else if (f.status === 'Delayed') {
            text = `Mohon perhatian. Penerbangan ${f.airline} nomor ${spelledFlight} tujuan ${f.city} mengalami keterlambatan menjadi pukul ${f.estimatedTime || f.time}. Mohon maaf atas ketidaknyamanan ini.`;
        } else {
            text = `Informasi keberangkatan. Penerbangan ${f.airline} nomor ${spelledFlight} tujuan ${f.city}, dijadwalkan berangkat pukul ${f.estimatedTime || f.time} melalui ${f.gate}.`;
        }
    } else {
        text = `Informasi kedatangan. Pesawat ${f.airline} nomor penerbangan ${spelledFlight} dari ${f.city}, status saat ini ${f.status}. Pengambilan bagasi tersedia di ${f.baggage !== '-' ? f.baggage : 'area pengambilan bagasi'}.`;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
    showToast(`Memutar pengumuman suara untuk ${f.flightNumber}...`);
}

// Export ke CSV
function exportCSV() {
    const headers = ['ID', 'Tipe', 'No Penerbangan', 'Maskapai', 'Pesawat', 'Kota', 'Jadwal', 'Estimasi', 'Terminal', 'Gate', 'Baggage', 'Status', 'Alasan Delay'];
    const rows = flights.map(f => [
        f.id, f.type, f.flightNumber, `"${f.airline}"`, `"${f.aircraft || ''}"`, `"${f.city}"`,
        f.time, f.estimatedTime || f.time, `"${f.terminal}"`, `"${f.gate}"`, `"${f.baggage || '-'}"`, f.status, `"${f.delayReason || ''}"`
    ].join(','));

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jadwal_penerbangan_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('File CSV berhasil diunduh!');
}

// Export Backup JSON
function exportJSON() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(flights, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `backup_aerotrack_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Backup JSON berhasil diunduh!');
}

// Import Restore JSON
function importJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            if (Array.isArray(imported)) {
                flights = imported;
                saveFlightsToStorage();
                renderApp();
                showToast(`Berhasil memulihkan ${flights.length} jadwal penerbangan.`);
            } else {
                showToast('Format file JSON tidak valid.');
            }
        } catch (err) {
            showToast('Gagal membaca file JSON.');
        }
        event.target.value = '';
    };
    reader.readAsText(file);
}

// Modal Form Handlers
function toggleDelayReasonField() {
    const status = document.getElementById('form-status').value;
    const wrapper = document.getElementById('delay-reason-wrapper');
    if (status === 'Delayed' || status === 'Cancelled') {
        wrapper.classList.remove('hidden');
    } else {
        wrapper.classList.add('hidden');
    }
}

function toggleBaggageField() {
    const type = document.getElementById('form-type').value;
    const bagInput = document.getElementById('form-baggage');
    const bagWrapper = document.getElementById('baggage-field-wrapper');
    if (type === 'ARRIVAL') {
        bagInput.disabled = false;
        bagWrapper.classList.remove('opacity-50');
    } else {
        bagInput.disabled = true;
        bagInput.value = '';
        bagWrapper.classList.add('opacity-50');
    }
}

function openModal(id = null) {
    const modal = document.getElementById('flight-modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('flight-form');
    const airlineSelect = document.getElementById('form-airline');
    form.reset();

    if (id) {
        const flight = flights.find(f => String(f.id) === String(id));
        if (!flight) {
            showToast('Data jadwal tidak ditemukan.');
            return;
        }
        title.textContent = `Edit Jadwal — ${flight.flightNumber}`;
        document.getElementById('flight-id').value = flight.id;
        document.getElementById('form-type').value = flight.type;
        document.getElementById('form-flightNumber').value = flight.flightNumber;

        const hasAirlineOption = Array.from(airlineSelect.options).some(opt => opt.value === flight.airline);
        if (!hasAirlineOption && flight.airline) {
            const customOpt = new Option(flight.airline, flight.airline);
            airlineSelect.add(customOpt);
        }
        airlineSelect.value = flight.airline;

        document.getElementById('form-aircraft').value = flight.aircraft || '';
        document.getElementById('form-city').value = flight.city;
        document.getElementById('form-time').value = flight.time;
        document.getElementById('form-estimatedTime').value = flight.estimatedTime || flight.time;
        document.getElementById('form-terminal').value = flight.terminal;
        document.getElementById('form-gate').value = flight.gate;
        document.getElementById('form-baggage').value = flight.baggage && flight.baggage !== '-' ? flight.baggage : '';
        document.getElementById('form-status').value = flight.status;
        document.getElementById('form-delayReason').value = flight.delayReason || '';
    } else {
        title.textContent = 'Tambah Jadwal Penerbangan Baru';
        document.getElementById('flight-id').value = '';
        document.getElementById('form-type').value = currentMainView === 'DEPARTURE' ? 'DEPARTURE' : 'ARRIVAL';
        document.getElementById('form-status').value = 'Scheduled';
    }

    toggleBaggageField();
    toggleDelayReasonField();
    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('flight-modal').classList.add('hidden');
}

function saveFlight(event) {
    event.preventDefault();
    const id = document.getElementById('flight-id').value;
    const stdTime = document.getElementById('form-time').value;
    const etdInput = document.getElementById('form-estimatedTime').value;
    const typeVal = document.getElementById('form-type').value;
    const bagVal = document.getElementById('form-baggage').value.trim().toUpperCase();

    let finalEtd = etdInput || stdTime;
    if (id) {
        const oldFlight = flights.find(f => String(f.id) === String(id));
        if (oldFlight && oldFlight.time !== stdTime && etdInput === oldFlight.time) {
            finalEtd = stdTime;
        }
    }

    const flightData = {
        id: id || 'FL-' + Date.now(),
        type: typeVal,
        flightNumber: document.getElementById('form-flightNumber').value.trim().toUpperCase(),
        airline: document.getElementById('form-airline').value,
        aircraft: document.getElementById('form-aircraft').value.trim().toUpperCase(),
        city: document.getElementById('form-city').value.trim(),
        time: stdTime,
        estimatedTime: finalEtd,
        terminal: document.getElementById('form-terminal').value,
        gate: document.getElementById('form-gate').value.trim().toUpperCase(),
        baggage: typeVal === 'ARRIVAL' && bagVal ? bagVal : '-',
        status: document.getElementById('form-status').value,
        delayReason: document.getElementById('form-delayReason').value.trim()
    };

    if (id) {
        const index = flights.findIndex(f => String(f.id) === String(id));
        if (index !== -1) {
            flights[index] = flightData;
            showToast(`Jadwal ${flightData.flightNumber} berhasil diperbarui.`);
        }
    } else {
        flights.push(flightData);
        showToast(`Jadwal ${flightData.flightNumber} berhasil ditambahkan.`);
    }

    saveFlightsToStorage();
    closeModal();
    renderApp();
}

// Delete Modal Handlers
function promptDelete(id) {
    const flight = flights.find(f => f.id === id);
    if (!flight) return;
    flightIdToDelete = id;
    document.getElementById('delete-modal-text').textContent = `Anda yakin ingin menghapus penerbangan ${flight.flightNumber} (${flight.airline} - ${flight.city})?`;
    document.getElementById('delete-modal').classList.remove('hidden');
}

function closeDeleteModal() {
    flightIdToDelete = null;
    document.getElementById('delete-modal').classList.add('hidden');
}

function confirmDelete() {
    if (!flightIdToDelete) return;
    const deleted = flights.find(f => f.id === flightIdToDelete);
    flights = flights.filter(f => f.id !== flightIdToDelete);
    saveFlightsToStorage();
    closeDeleteModal();
    renderApp();
    showToast(`Jadwal ${deleted ? deleted.flightNumber : ''} telah dihapus.`);
}

// Toast Helper
function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-message').textContent = message;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3200);
}